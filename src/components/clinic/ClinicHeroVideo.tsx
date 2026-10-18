"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { heroMedia, heroVideoSource } from "@/lib/hero-media";

type Connection = EventTarget & { saveData?: boolean };
/** Decorative footage stays behind the existing poster, scrim and content geometry. */
export function ClinicHeroVideo({ variant, overlayClassName = "clinic-hero-shade" }: { variant: string; overlayClassName?: string }) {
  const media = heroMedia[variant];
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [source, setSource] = useState<string>();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!media) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let visible = false;
    const update = () => {
      const allowed = visible && !motion.matches && !connection?.saveData;
      if (!allowed) { setReady(false); setPlaying(false); }
      setSource(allowed ? heroVideoSource(media, location.hostname, location.search, window.innerWidth) : undefined);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (root.current) observer.observe(root.current);
    motion.addEventListener("change", update);
    connection?.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); motion.removeEventListener("change", update); connection?.removeEventListener("change", update); window.removeEventListener("resize", update); };
  }, [media]);
  useEffect(() => {
    const element = video.current;
    if (!source || !element || failed) return;
    let active = true;
    element.muted = true;
    if (manuallyPaused.current) { setReady(true); setPlaying(false); }
    else element.play().catch(() => { if (active) { setFailed(true); setReady(false); } });
    return () => { active = false; element.pause(); };
  }, [source, failed]);
  // Keep the intersection target mounted even when a hero has no approved poster.
  // A local-review poster is visible only after a loopback, opt-in source is selected.
  const approvedFootageEnabled =
    process.env.NEXT_PUBLIC_CLINIC_HERO_PREVIEW === "1" ||
    process.env.NEXT_PUBLIC_CLINIC_HERO_PUBLIC === "1";
  // The poster remains visible even when the video fails, is paused, or is
  // prevented by reduced-motion, Save-Data, visibility or browser autoplay.
  const poster = media?.poster ||
    (approvedFootageEnabled ? media?.approvedPoster : undefined) ||
    (source ? media?.reviewPoster : undefined);
  if (!media) return null;
  return <>
    <div ref={root} className="clinic-hero-media" data-hero-media={variant}>
      {poster && <img className="clinic-hero-photo" src={poster} alt="" fetchPriority="high" />}
      {source && poster && !failed && <video ref={video} className="clinic-hero-video" style={{ opacity: ready ? 1 : 0 }}
        src={source} poster={poster} muted loop playsInline autoPlay={!manuallyPaused.current} preload="none" aria-hidden="true" tabIndex={-1}
        onPlaying={() => { setReady(true); setPlaying(true); }} onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setReady(false); }} />}
    </div>
    {poster && <div className={overlayClassName} aria-hidden="true" />}
    {ready && !failed && <button type="button" className="clinic-hero-playback" aria-label={playing ? "Pause background video" : "Play background video"}
      onClick={() => {
        const element = video.current;
        if (!element) return;
        if (playing) { manuallyPaused.current = true; element.pause(); }
        else { manuallyPaused.current = false; element.play().catch(() => { setFailed(true); setReady(false); }); }
      }}>{playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}<span>{playing ? "Pause" : "Play"}</span></button>}
  </>;
}
