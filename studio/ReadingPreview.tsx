import { useEffect, useState } from "react";
import type { UserViewComponent } from "sanity/structure";
import { releaseErrors, recordErrors } from "../shared/publishing-policy.mjs";
import type { RichBlock } from "../shared/publishing-policy.mjs";
const string = (value: unknown) => (typeof value === "string" ? value : "");
export const ReadingPreview: UserViewComponent = ({ document }) => {
  const doc = document.displayed;
  const [checks, setChecks] = useState<string[]>([]);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    let current = true;
    const validate =
      doc._type === "editorialEntry"
        ? releaseErrors(doc)
        : Promise.resolve(recordErrors(doc));
    validate.then((errors) => {
      if (current) setChecks(errors);
    });
    return () => {
      current = false;
    };
  }, [doc]);
  const blocks = Array.isArray(doc.body) ? (doc.body as RichBlock[]) : [];
  return (
    <div
      style={{
        padding: 24,
        background: "#eef1eb",
        minHeight: "100%",
        color: "#002a30",
        fontFamily: "Inter,Arial,sans-serif",
      }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.6 }}>
        Draft reading preview. This does not publish the document or send it to
        the public website.
      </p>
      <button
        type="button"
        onClick={() => setMobile(!mobile)}
        style={{
          padding: 12,
          marginBlock: 16,
          border: "1px solid #496267",
          borderRadius: 12,
        }}
      >
        {mobile ? "Use wide reading layout" : "Use mobile reading layout"}
      </button>
      <article
        style={{
          background: "#f8f7f2",
          maxWidth: mobile ? 390 : 1000,
          margin: "0 auto",
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <header
          style={{
            background: "#002a30",
            color: "#f8f7f2",
            padding: mobile ? 24 : 40,
          }}
        >
          <p style={{ fontSize: 12, textTransform: "uppercase" }}>
            {string(doc.kind) || string(doc._type)} · {string(doc.topic)}
          </p>
          <h1
            style={{
              fontSize: mobile ? 36 : 48,
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            {string(doc.title) || "Add a title"}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>
            {string(doc.summary) || string(doc.description)}
          </p>
          {doc.authorName ? (
            <p>
              {string(doc.authorName)}
              {doc.authorRole ? ` · ${string(doc.authorRole)}` : ""}
            </p>
          ) : null}
          {doc.publishedAt ? <p>{string(doc.publishedAt)}</p> : null}
        </header>
        <div
          style={{ padding: mobile ? 24 : 40, lineHeight: 1.7, fontSize: 18 }}
        >
          {blocks.map((block, i) => {
            const text = (block.children ?? [])
              .map((s) => string(s.text))
              .join("");
            return block.style === "h2" ? (
              <h2 key={block._key ?? i}>{text}</h2>
            ) : block.style === "h3" ? (
              <h3 key={block._key ?? i}>{text}</h3>
            ) : block.style === "blockquote" ? (
              <blockquote key={block._key ?? i}>{text}</blockquote>
            ) : (
              <p key={block._key ?? i}>
                {block.listItem ? "• " : ""}
                {text}
              </p>
            );
          })}
          {doc.abstract ? <p>{string(doc.abstract)}</p> : null}
          {doc.video && typeof doc.video === "object" ? (
            <section>
              <h2>Video transcript</h2>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {string((doc.video as Record<string, unknown>).transcript)}
              </p>
              <p style={{ fontSize: 14 }}>
                Review the source video, captions and media rights before
                publication.
              </p>
            </section>
          ) : null}
        </div>
      </article>
      <section
        style={{
          maxWidth: 1000,
          margin: "24px auto",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <h2>Release readiness</h2>
        {checks.length ? (
          <ul>
            {checks.map((check, i) => (
              <li key={i}>{check}</li>
            ))}
          </ul>
        ) : (
          <p>
            The recorded release fields pass validation. Verify the source
            evidence before publishing.
          </p>
        )}
      </section>
    </div>
  );
};
