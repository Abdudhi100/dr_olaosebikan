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
      setSource(allowed ? heroVideoSource(media, location.hostname, location.search) : undefined);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (root.current) observer.observe(root.current);
    motion.addEventListener("change", update);
    connection?.addEventListener("change", update);
    return () => { observer.disconnect(); motion.removeEventListener("change", update); connection?.removeEventListener("change", update); };
  }, [media]);
  useEffect(() => {
    const element = video.current;
    if (!source || !element || failed) return;
    let active = true;
    element.muted = true;
    element.play().catch(() => { if (active) { setFailed(true); setReady(false); } });
    return () => { active = false; element.pause(); element.removeAttribute("src"); element.load(); };
  }, [source, failed]);
  if (!media?.poster) return null;
  return <>
    <div ref={root} className="clinic-hero-media" data-hero-media={variant}>
      <img className="clinic-hero-photo" src={media.poster} alt="" fetchPriority="high" />
      {source && !failed && <video ref={video} className="clinic-hero-video" style={{ opacity: ready ? 1 : 0 }}
        src={source} poster={media.poster} muted loop playsInline autoPlay preload="none" aria-hidden="true" tabIndex={-1}
        onPlaying={() => { setReady(true); setPlaying(true); }} onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setReady(false); }} />}
    </div>
    <div className={overlayClassName} aria-hidden="true" />
    {ready && !failed && <button type="button" className="clinic-hero-playback" aria-label={playing ? "Pause background video" : "Play background video"}
      onClick={() => {
        const element = video.current;
        if (!element) return;
        if (playing) element.pause();
        else element.play().catch(() => { setFailed(true); setReady(false); });
      }}>{playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}<span>{playing ? "Pause" : "Play"}</span></button>}
  </>;
}
