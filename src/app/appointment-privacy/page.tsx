import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...defaultMetadata({
    title: "Appointment privacy information — draft for clinic review",
    description: "Draft details about how a proposed appointment request service would handle scheduling contact information.",
    path: "/appointment-privacy",
  }),
  robots: { index: false, follow: false },
};

export default function AppointmentPrivacyDraft() {
  return (
    <section className="clinic-privacy-page">
      <div className="clinic-container">
        <nav className="clinic-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/appointments/book">Appointments</Link>
          <span aria-hidden="true">/</span>
          Privacy draft
        </nav>
        <article className="clinic-privacy-content">
          <p className="clinic-privacy-eyebrow">PRELAUNCH REVIEW · NOT YET APPROVED</p>
          <h1>How appointment requests would be handled</h1>
          <p className="clinic-privacy-lead">
            This is a draft privacy explanation for review by the clinic. Online
            appointment submissions are not currently enabled. Please contact
            the clinic by phone or email until a final policy is approved.
          </p>

          <h2>Who would handle a request?</h2>
          <p>
            The {site.clinicName} in Lagos is the intended contact for
            appointment arrangements. The person or entity responsible for
            processing requests, and the relevant data-protection contact,
            must be confirmed before activating the form. For questions now,
            email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>What information would be sent?</h2>
          <p>
            If approved, the website form would send your name, telephone
            number, consultation format (virtual or in person), and any
            optional contact email, preferred date and preferred time you enter.
            Your preferred time is a request, not a booked appointment.
          </p>
          <p>
            The optional consultation-reason selector and free-text booking
            note are excluded from the outgoing Web3Forms notification.
            Please do not submit symptoms, diagnoses, medical records, test
            results or other sensitive medical details through this form.
          </p>

          <h2>Why would these details be used?</h2>
          <p>
            The proposed purpose is to contact you about arranging a
            consultation and to communicate practical appointment details.
            This form would not create a medical record, confirm a booking,
            or subscribe you to marketing. The clinic still needs to record
            its lawful processing basis and final patient-information
            arrangements before accepting submissions.
          </p>

          <h2>Which services would receive the details?</h2>
          <p>
            The proposed website flow uses Web3Forms to process a request
            and send a notification to <strong>{site.email}</strong>.
            Cloudflare Email Routing forwards incoming mail to the clinic&apos;s
            approved receiving inbox. The clinic will need to document
            which authorized staff can access those notifications.
            Web3Forms and its service providers may process the data in
            other countries under their own processing terms.
          </p>

          <h2>How long would the information be kept?</h2>
          <p>
            The clinic&apos;s proposed operating target is <strong>30 days
            for routine appointment scheduling enquiries</strong>, with
            exceptions where applicable law or legitimate record-keeping
            obligations require otherwise. This period is <strong>not yet
            configured or independently verified</strong> in either Web3Forms
            or the receiving mailbox. Web3Forms&apos; July 2026 privacy policy
            permits longer retention unless a shorter setting or deletion
            applies. The clinic must confirm and implement the stated period
            in each applicable system before accepting online requests.
          </p>

          <h2>Security and enquiries</h2>
          <p>
            Before launch, the clinic must approve access restrictions,
            anti-spam controls, incident handling, data-subject requests and
            any applicable cross-border safeguards. Patients should be able
            to ask about, correct or seek deletion of their personal
            information, subject to applicable law.
          </p>
          <p>
            For a privacy question, contact
            {" "}<a href={`mailto:${site.email}`}>{site.email}</a>.
            This draft does not replace a final published privacy notice.
          </p>

          <aside className="clinic-privacy-draft-warning">
            <strong>Pending clinic approval</strong>
            <p>
              Responsible controller identity, lawful basis, precise retention
              period, Web3Forms settings, university mailbox authorization,
              staff access and a complete privacy contact process.
              Real online appointment requests remain disabled until these
              decisions are documented and approved.
            </p>
          </aside>
          <Link href="/appointments/book" className="clinic-text-link">
            Return to appointment information <span aria-hidden="true">↗</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
