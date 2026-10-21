import { useState } from "react";
import { useSendBusinessEnquiryMutation } from "../services/sinnchemApi";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sendEnquiry, state] = useSendBusinessEnquiryMutation();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSent(false);
    try {
      await sendEnquiry({
        name: String(data.get("name")),
        company: String(data.get("company") || ""),
        email: String(data.get("email")),
        phone: String(data.get("phone") || ""),
        interest: String(data.get("interest") || ""),
        requirement: String(data.get("requirement")),
      }).unwrap();
      setSent(true);
      form.reset();
    } catch {
      setSent(false);
    }
  }
  return (
    <main>
      <header className="page-heading">
        <p className="eyebrow">Reach our team</p>
        <h1>Let's talk chemistry.</h1>
        <p>For product details, partnerships, and business enquiries.</p>
      </header>
      <div className="contact-grid">
        <section className="contact-details">
          <h2>Sinnchem Life Sciences</h2>
          <p>
            <small>VISIT</small>Plot No 119/5, Phase-2, IDA Cherlaplly,
            Hyderabad - 500051, Telangana, India
          </p>
          <p>
            <small>EMAIL</small>
            <a href="mailto:info@sinnchem.com">info@sinnchem.com</a>
          </p>
          <p>
            <small>CALL</small>
            <a href="tel:+919850498435">+91 98504 98435</a>
          </p>
          <a
            className="location-panel location-link"
            href="https://maps.google.com/?q=Plot+No+119%2F5%2C+Phase-2%2C+IDA+Cherlaplly%2C+Hyderabad+500051%2C+Telangana%2C+India"
            target="_blank"
            rel="noreferrer"
          >
            <span className="eyebrow">Sinnchem in India</span>
            <strong>Hyderabad</strong>
            <span>IDA Cherlaplly · Telangana</span>
            <b>Open directions ↗</b>
          </a>
        </section>
        <form className="form-panel" onSubmit={submit}>
          <h2>Send a business enquiry</h2>
          {sent && (
            <p className="form-success" role="status" aria-live="polite">
              Thank you. Your enquiry was sent successfully. Our team will
              follow up with you.
            </p>
          )}
          <div className="form-grid">
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Company
              <input name="company" autoComplete="organization" />
            </label>
            <label>
              Work email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="wide">
              Area of interest
              <select name="interest">
                <option value="">Select a category</option>
                <option>Pharmaceutical Chemical</option>
                <option>Speciality Chemical</option>
                <option>Plant Growth Regulator</option>
                <option>Agriculture Herbicide</option>
                <option>Contract research & manufacturing</option>
                <option>Other</option>
              </select>
            </label>
            <label className="wide">
              Requirement
              <textarea
                name="requirement"
                required
                placeholder="Product, quantity, or project context"
              />
            </label>
          </div>
          {state.isError && (
            <p className="form-error">
              We couldn't send your enquiry. Please try again or email
              info@sinnchem.com.
            </p>
          )}
          <button className="button-primary" disabled={state.isLoading}>
            {state.isLoading ? "Sending…" : "Send enquiry ↗"}
          </button>
        </form>
      </div>
    </main>
  );
}
