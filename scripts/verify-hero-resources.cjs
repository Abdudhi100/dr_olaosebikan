const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createReviewServer } = require('./serve-hero-review.cjs');
(async () => {
 const output = path.resolve(process.env.CLINIC_REVIEW_OUTPUT_DIR || 'visual-review-codex-20261012-video-resources/browser');
 fs.mkdirSync(output,{recursive:true});
 const [home,services] = process.argv.slice(2);
 assert.ok(home && services,'Pass the two inventoried review MP4 paths');
 const server=createReviewServer({'/__clinic-review-media/home.mp4':home,'/__clinic-review-media/services.mp4':services});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 const results=[],external=[],errors=[];
 async function context(options={}) {
  const ctx=await browser.newContext(options);
  await ctx.route('**/*', route=>{
   if(new URL(route.request().url()).origin!==origin){external.push(route.request().url());return route.abort();}
   return route.continue();
  });
  ctx.on('page',page=>page.on('pageerror',e=>errors.push(e.message)));
  return ctx;
 }
 async function painted(page){await page.evaluate(async()=>{for(const image of document.images) image.loading="eager";await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});}
 try {
  for(const width of [390,768,1440,1920]) {
   const ctx=await context({viewport:{width,height:1000}}); const page=await ctx.newPage();
   for(const [route,id] of [['/','home'],['/services','services']]) {
    const mediaRequests=[]; page.on('request',r=>{if(r.url().includes('/__clinic-review-media/')) mediaRequests.push(r.url());});
    await page.goto(origin+route);await painted(page);await page.waitForTimeout(400);
    assert.equal(await page.locator('video').count(),0,'Ordinary review remains poster-only');assert.equal(mediaRequests.length,0);
    const geometry=await page.locator('.clinic-hero').boundingBox();
    await page.screenshot({path:path.join(output,`${id}-${width}-poster.png`)});
    await page.goto(origin+route+'?heroVideoReview=1');await painted(page);
    await page.getByRole('button',{name:'Pause background video'}).waitFor({timeout:15000});
    const video=page.locator('video');
    assert.ok((await video.getAttribute('src')).endsWith(id+'.mp4'));
    assert.deepEqual(await page.locator('.clinic-hero').boundingBox(),geometry,'Motion preserves hero geometry');
    assert.ok(await video.evaluate(v=>v.muted&&v.loop&&v.playsInline&&!v.paused));
    assert.equal(await video.evaluate(v=>getComputedStyle(v).pointerEvents),'none');
    assert.equal(await video.evaluate(v=>getComputedStyle(v).objectFit),'cover');
    const pause=page.getByRole('button',{name:'Pause background video'});await pause.click();
    await page.getByRole('button',{name:'Play background video'}).waitFor();assert.ok(await video.evaluate(v=>v.paused));
    await page.getByRole('button',{name:'Play background video'}).click();await page.getByRole('button',{name:'Pause background video'}).waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
    const target=page.locator(id==='home'?'.clinic-hero-content > .clinic-text-link':'.clinic-services-search input');
    await target.scrollIntoViewIfNeeded();
    assert.ok(await target.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'Hero interaction above video');
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(output,`${id}-${width}-video.png`)});
    results.push({route,width,playback:true,geometryUnchanged:true});
   }
   if(width<=768){
    await page.getByRole('button',{name:'Open navigation'}).click();
    for(const href of ['/insights','/publications','/publications/achievements']) assert.ok(await page.locator(`.clinic-mobile-resources a[href="${href}"]`).isVisible());
    await page.screenshot({path:path.join(output,`resources-${width}.png`)});
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>e===document.activeElement),true);
   } else {
    const trigger=page.getByRole('button',{name:'Resources',exact:true});await trigger.focus();await page.keyboard.press('Enter');
    for(const href of ['/insights','/publications','/publications/achievements']) assert.ok(await page.locator(`#clinic-resources-links a[href="${href}"]`).isVisible());
    await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'/insights');
    await page.screenshot({path:path.join(output,`resources-${width}.png`)});
    await page.keyboard.press('Escape');assert.ok(await trigger.evaluate(e=>e===document.activeElement));
    await trigger.click();await page.locator('h1').click();assert.equal(await trigger.getAttribute('aria-expanded'),'false');
    await trigger.click();await page.locator('#clinic-resources-links a[href="/publications"]').click();await page.waitForURL('**/publications');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
   }
   for(const href of ['/insights','/publications','/publications/achievements']) assert.equal(await page.locator(`footer a[href="${href}"]`).count(),1);
   await ctx.close();
  }
  for(const mode of ['reduced-motion','save-data','autoplay-denied','network-failure']) {
   const ctx=await context(mode==='reduced-motion'?{reducedMotion:'reduce'}:{});
   if(mode==='save-data') await ctx.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){},removeEventListener(){}}}));
   if(mode==='autoplay-denied') await ctx.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'));};});
   if(mode==='network-failure') await ctx.route('**/__clinic-review-media/**',r=>r.abort());
   const page=await ctx.newPage();const requests=[];page.on('request',r=>{if(r.url().includes('/__clinic-review-media/'))requests.push(r.url());});
   await page.goto(origin+'/?heroVideoReview=1');await painted(page);await page.waitForTimeout(1000);
   assert.equal(await page.locator('video').count(),0,mode+' removes video');
   assert.equal(await page.locator('.clinic-hero-playback').count(),0,'No fake control');
   assert.ok(await page.locator('.clinic-hero-photo').evaluate(e=>e.naturalWidth>0));
   if(['save-data','reduced-motion'].includes(mode))assert.equal(requests.length,0,'No automatic media download');
   await page.screenshot({path:path.join(output,mode+'.png')});results.push({mode,poster:true,mediaRequests:requests.length});await ctx.close();
  }
  const ctx=await context();const page=await ctx.newPage();await page.goto(origin+'/?heroVideoReview=1');await page.getByRole('button',{name:'Pause background video'}).waitFor();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('video'));results.push({mode:'live motion preference change',poster:true});await ctx.close();
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({results,external,errors},null,2));console.log('Video and Resources browser checks passed:',results.length,'scenarios; no external requests or client errors.');
 } finally {await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
