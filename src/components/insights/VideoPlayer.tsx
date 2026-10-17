"use client";
import { useEffect, useState } from "react";
import styles from "./insights.module.css";
export function VideoPlayer({
  embedUrl,
  title,
}: {
  embedUrl: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div className={styles.video}>
      {loaded ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          <button
            type="button"
            disabled={!ready}
            onClick={() => setLoaded(true)}
          >
            Load video
          </button>
          <p>
            Loads the external video player. The video provider may receive
            browsing information.
          </p>
        </>
      )}
    </div>
  );
}
