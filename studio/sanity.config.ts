import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { guardPublishAction } from "./GuardPublishAction";
import { ReadingPreview } from "./ReadingPreview";
import { schemaTypes } from "./schemaTypes";
// Sanity project/dataset are public identifiers, not API credentials.
// Using the confirmed owner project also lets the editor run without copying an env file.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "zavdffj8";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
if (!projectId || !dataset)
  throw new Error(
    "Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET. No project is created automatically.",
  );
export default defineConfig({
  name: "clinic-publishing",
  title: "Clinic publishing",
  projectId,
  dataset,
  plugins: [
    structureTool({
      defaultDocumentNode: (S) =>
        S.document().views([
          S.view.form(),
          S.view.component(ReadingPreview).title("Reading preview"),
        ]),
      structure: (S) =>
        S.list()
          .title("Weekly publishing")
          .items([
            S.listItem()
              .title("Articles, videos & clinic news")
              .child(
                S.documentTypeList("editorialEntry").title("Editorial content"),
              ),
            S.listItem()
              .title("Verified research publications")
              .child(
                S.documentTypeList("researchPublication").title("Research"),
              ),
            S.listItem()
              .title("Verified professional achievements")
              .child(
                S.documentTypeList("professionalAchievement").title(
                  "Achievements",
                ),
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (actions) =>
      actions.map((action) =>
        action.action === "publish" ? guardPublishAction(action) : action,
      ),
  },
  // Built-in Publish validation remains intact. Build validation also protects API writes.
});
