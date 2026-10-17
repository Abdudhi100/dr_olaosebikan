import type { Metadata } from "next";
import Link from "next/link";
import release from "../../../config/clinic-release.json";
import { site } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";

const published =
  release.releaseStatus === "approved" &&
  release.booking.enabled === true &&
  release.booking.privacyNoticeApproved === true;

export const metadata: Metadata = {
  ...defaultMetadata({
    title: published
      ? "Appointment privacy information | Dr Olaosebikan"
      : "Appointment privacy information — draft for clinic review",
    description:
      "How Dr Hakeem Olaosebikan handles administrative appointment enquiries and Web3Forms requests.",
    path: "/appointment-privacy",
  }),
  robots: { index: published, follow: published },
};

/**
 * This page remains draft and noindex until the named clinic operator approves
 * its exact wording and the mailbox's retention, staff access and deletion plan.
 * An approved config alone controls the label; the release checklist requires
 * documented operator approval before config can be changed.
 */
export default function AppointmentPrivacyInformation() {
  return (
    <section className="clinic-privacy-page">
      <div className="clinic-container">
        <nav className="clinic-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/appointments/book">Appointments</Link>
          <span aria-hidden="true">/</span>
          Privacy
        </nav>
        <article className="clinic-privacy-content">
          {!published && (
            <p className="clinic-privacy-eyebrow">PRELAUNCH REVIEW · NOT YET APPROVED</p>
          )}
          <h1>Privacy information for appointment requests</h1>
          <p className="clinic-privacy-lead">
            {published
              ? "This information explains how the private practice handles appointment requests. Sending a request does not book or confirm an appointment."
              : "This notice is a draft for review by the clinic. Online appointment submissions are not enabled yet. Contact the clinic by phone, WhatsApp or email until the final policy is approved."}
          </p>

          <h2>Who is responsible for your information?</h2>
          <p>
            Dr Hakeem Olaosebikan personally operates this private practice and
            determines how its appointment enquiries are handled. In-person
            consultations are arranged at Maryamville Medical Center,
            144 Bode Thomas Road, Surulere, Lagos. Maryamville is the venue;
            this notice does not describe it as the operator of the practice.
            For privacy enquiries, contact <a href={"mailto:" + site.email}>{site.email}</a>.
          </p>

          <h2>Which details does the form send?</h2>
          <p>
            An enabled appointment request form sends your full name, telephone
            number, consultation type (virtual or in person), and any optional
            contact email, preferred date and preferred time you provide.
            The dates and times are preferences, not available or confirmed slots.
          </p>
          <p>
            The optional reason-for-consultation selector and free-text booking
            note stay on the page and are excluded from the Web3Forms notification.
            Please do not include diagnoses, symptoms, medical records, test
            results or other sensitive health information in an appointment
            request. Ask the clinic how to share clinical records safely.
          </p>

          <h2>Why do we process these details?</h2>
          <p>
            The practice uses your information to respond to your enquiry,
            take steps you request toward arranging a consultation, discuss
            availability, communicate fees and share appointment instructions.
            For routine scheduling information, these steps are intended to be
            taken at your request before a consultation arrangement is agreed.
            Any incidental sensitive information and additional legal duties
            must be assessed separately. A request is not a medical record,
            confirmed booking or marketing subscription.
          </p>

          <h2>Who else processes the details?</h2>
          <p>
            Web3Forms receives online form details and creates a notification
            to <strong>{site.email}</strong>. Cloudflare Email Routing forwards
            that message to the clinic&apos;s designated receiving mailbox.
            Web3Forms uses infrastructure and sub-processors which may process
            information outside Nigeria, subject to its published safeguards.
            The clinic must restrict access to people authorized to arrange
            consultations. For more information, see{" "}
            <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">
              Web3Forms&apos; privacy policy
            </a>.
          </p>

          <h2>How long is the information kept?</h2>
          <p>
            The form account currently shows Web3Forms&apos; <strong>three years</strong>
            default retention selection. According to the provider, the
            submission is removed after the configured retention period unless
            deleted earlier. The free dashboard&apos;s 30-day submission-history
            view is not a promise that submissions are deleted after 30 days.
          </p>
          <p>
            The copies forwarded to the clinic email inbox, or created
            through WhatsApp or telephone enquiries, may be retained separately.
            Their precise administrative retention and deletion practice
            requires the clinic operator&apos;s approval; an email deleted
            from a visible inbox may remain in provider backups for a period.
            Information should not be kept longer than needed for legitimate
            appointment and legal purposes.
          </p>

          <h2>Security, your rights and questions</h2>
          <p>
            The form&apos;s saved settings show Basic Advanced Spam Filtering
            enabled, with no mandatory CAPTCHA and no additional form
            integrations. These controls cannot guarantee that every malicious
            submission will be prevented. The clinic must control access
            to notifications and have a process for incidents and privacy
            requests.
          </p>
          <p>
            Depending on the applicable circumstances, you may ask to
            access, correct, restrict or delete your information, object to
            processing, or contact the Nigeria Data Protection Commission.
            Email <a href={"mailto:" + site.email}>{site.email}</a> with a privacy
            enquiry. The clinic will need to verify identity before disclosing
            confidential records.
          </p>

          {!published && (
            <aside className="clinic-privacy-draft-warning">
              <strong>Pending clinic approval</strong>
              <p>
                Before this notice is published and requests are enabled,
                the clinic must confirm the forwarded mailbox retention
                and deletion procedure, who may read those messages, the
                reasons for selecting three-year Web3Forms retention, and
                acceptance of this exact notice. These items have not yet
                been confirmed as complete.
              </p>
            </aside>
          )}
          <Link href="/appointments/book" className="clinic-text-link">
            Return to appointment information <span aria-hidden="true">↗</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
