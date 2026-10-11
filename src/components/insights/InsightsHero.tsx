import Link from "next/link";
import styles from "./insights.module.css";
export function InsightsHero({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow: string;
}) {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className={styles.inverseButton} href="/appointments/book">
        Request an appointment
      </Link>
    </section>
  );
}
