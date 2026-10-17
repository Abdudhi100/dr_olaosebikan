"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./insights.module.css";
import {
  displayDate,
  entryPath,
  formatLabel,
  type PublicEntry,
} from "@/lib/editorial";
type SearchEntry = Pick<
  PublicEntry,
  | "_id"
  | "kind"
  | "title"
  | "summary"
  | "slug"
  | "topic"
  | "tags"
  | "authorName"
  | "publishedAt"
>;
export function InsightsSearch({ entries }: { entries: SearchEntry[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [topic, setTopic] = useState("");
  const [tag, setTag] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const topics = [...new Set(entries.map((e) => e.topic))].sort();
  const tags = [...new Set(entries.flatMap((e) => e.tags ?? []))].sort();
  const results = entries.filter(
    (e) =>
      (!kind || e.kind === kind) &&
      (!topic || e.topic === topic) &&
      (!tag || e.tags?.includes(tag)) &&
      (!query ||
        `${e.title} ${e.summary} ${e.authorName} ${e.topic} ${(e.tags ?? []).join(" ")}`
          .toLocaleLowerCase()
          .includes(query)),
  );
  return (
    <section
      className={styles.collectionSection}
      aria-labelledby="search-insights-heading"
    >
      <h2 id="search-insights-heading">Find a resource.</h2>
      <div className="clinic-insights-filters">
        <div>
          <label htmlFor="insights-search">Search resources</label>
          <input
            id="insights-search"
            disabled={!ready}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, topics or authors"
            aria-controls="insights-results"
          />
        </div>
        <div>
          <label htmlFor="insights-format">Format</label>
          <select
            id="insights-format"
            disabled={!ready}
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">All formats</option>
            {Object.entries(formatLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="insights-topic">Topic</label>
          <select
            id="insights-topic"
            disabled={!ready}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        {tags.length > 0 && (
          <div>
            <label htmlFor="insights-tag">Tag</label>
            <select
              id="insights-tag"
              disabled={!ready}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <p className="clinic-small" role="status" style={{ marginBlock: 24 }}>
        {results.length} {results.length === 1 ? "resource" : "resources"}{" "}
        found.
      </p>
      <div id="insights-results" className={styles.entryGrid}>
        {results.map((e) => (
          <article className={styles.card} key={e._id}>
            <p className={styles.eyebrow}>
              {formatLabel[e.kind]} · {e.topic}
            </p>
            <h3>
              <Link href={entryPath(e)}>{e.title}</Link>
            </h3>
            <p>{e.summary}</p>
            <p style={{ marginTop: 24, fontSize: 14 }}>
              {e.authorName} ·{" "}
              <time dateTime={e.publishedAt}>{displayDate(e.publishedAt)}</time>
            </p>
            {e.tags?.length ? (
              <p className="clinic-small" style={{ marginTop: 16 }}>
                Tags: {e.tags.join(", ")}
              </p>
            ) : null}
            <Link className={styles.cardAction} href={entryPath(e)}>
              Explore {formatLabel[e.kind].toLowerCase()}{" "}
              <span aria-hidden>↗</span>
            </Link>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className={styles.empty}>
          <p>No resources match these filters.</p>
          <button
            type="button"
            className="clinic-text-link"
            onClick={() => {
              setSearch("");
              setKind("");
              setTopic("");
              setTag("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
