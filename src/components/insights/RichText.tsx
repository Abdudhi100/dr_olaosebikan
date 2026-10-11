import { Fragment, type ReactNode } from "react";
import type { RichBlock } from "@/lib/editorial";
function inline(block: RichBlock) {
  return block.children.map((span, i) => {
    let text: ReactNode = span.text;
    for (const mark of span.marks ?? []) {
      if (mark === "strong") text = <strong>{text}</strong>;
      else if (mark === "em") text = <em>{text}</em>;
      else {
        const link = block.markDefs?.find((def) => def._key === mark);
        if (link)
          text = (
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          );
      }
    }
    return <Fragment key={span._key ?? i}>{text}</Fragment>;
  });
}
export function RichText({ body }: { body: RichBlock[] }) {
  const output: ReactNode[] = [];
  for (let i = 0; i < body.length; i++) {
    const block = body[i];
    if (block.listItem) {
      const kind = block.listItem,
        items = [];
      const key = block._key ?? i;
      do {
        const item = body[i];
        items.push(<li key={item._key ?? i}>{inline(item)}</li>);
        i++;
      } while (i < body.length && body[i].listItem === kind);
      i--;
      output.push(
        kind === "number" ? (
          <ol key={key}>{items}</ol>
        ) : (
          <ul key={key}>{items}</ul>
        ),
      );
    } else {
      const Tag =
        block.style === "h2"
          ? "h2"
          : block.style === "h3"
            ? "h3"
            : block.style === "blockquote"
              ? "blockquote"
              : "p";
      output.push(<Tag key={block._key ?? i}>{inline(block)}</Tag>);
    }
  }
  return <>{output}</>;
}
