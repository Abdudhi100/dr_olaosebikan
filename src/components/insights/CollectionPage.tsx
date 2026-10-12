import Link from "next/link";
import { InsightsHero } from "./InsightsHero";
import { InsightsSearch } from "./InsightsSearch";
import styles from "./insights.module.css";
import { searchEntries, type PublicEntry } from "@/lib/editorial";
export function CollectionPage({
  title,
  description,
  entries,
}: {
  title: string;
  description: string;
  entries: PublicEntry[];
}) {
  return (
    <div className={styles.scope}>
      <InsightsHero
        title={title}
        description={description}
        eyebrow="Insights & media"
      />
      <div className={`${styles.container} ${styles.body}`}>
        <Link href="/insights" className="clinic-text-link">
          ← All insights & media
        </Link>
        <InsightsSearch entries={searchEntries(entries)} />
      </div>
    </div>
  );
}
