import { useEffect, useState } from "react";
import { useFormValue, type StringInputProps } from "sanity";
import { contentFingerprint } from "../shared/publishing-policy.mjs";
export function ReviewFingerprint(props: StringInputProps) {
  const document = useFormValue([]) as Record<string, unknown>;
  const [fingerprint, setFingerprint] = useState("Calculating…");
  useEffect(() => {
    let alive = true;
    contentFingerprint(document)
      .then((value) => {
        if (alive) setFingerprint(value);
      })
      .catch(() => {
        if (alive) setFingerprint("Unable to calculate; do not publish.");
      });
    return () => {
      alive = false;
    };
  }, [document]);
  return (
    <div>
      <div
        style={{
          padding: 16,
          border: "1px solid #7e9997",
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <p>
          Current content fingerprint — share this and the exact content with
          the clinician.
        </p>
        <code
          style={{
            display: "block",
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
            margin: "12px 0",
          }}
        >
          {fingerprint}
        </code>
        <p>
          Enter the fingerprint approved in the independent written sign-off
          below. Copying this value alone is not proof of approval. Keep private
          evidence outside this public dataset.
        </p>
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
