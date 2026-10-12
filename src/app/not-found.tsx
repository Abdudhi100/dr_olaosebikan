import Link from "next/link";
export default function NotFound() {
  return (
    <section className="clinic-section">
      <div className="clinic-container">
        <p className="clinic-eyebrow">404 · Page not found</p>
        <h1 className="clinic-subtitle" style={{ maxWidth: 740 }}>
          Let’s get you
          <br />
          back on track.
        </h1>
        <p className="clinic-lead" style={{ maxWidth: 850 }}>
          The page you are looking for could not be found. Return to the
          homepage or request an appointment.
        </p>
        <div className="clinic-actions">
          <Link href="/" className="clinic-button">
            Return to homepage
          </Link>
          <Link
            href="/appointments/book"
            className="clinic-button clinic-button-outline"
          >
            Request an appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
