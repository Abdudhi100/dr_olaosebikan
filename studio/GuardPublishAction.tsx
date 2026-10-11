import type { DocumentActionComponent } from "sanity";
export function guardPublishAction(
  Original: DocumentActionComponent,
): DocumentActionComponent {
  const Guarded: DocumentActionComponent = (props) => {
    const action = Original(props);
    if (!action) return action;
    if ((props.draft ?? props.published)?.publicationStatus !== "ready")
      return {
        ...action,
        disabled: true,
        title:
          "Set release status to Ready after recording approval and media rights.",
        label: "Complete release checks",
      };
    return action;
  };
  Guarded.action = Original.action;
  return Guarded;
}
