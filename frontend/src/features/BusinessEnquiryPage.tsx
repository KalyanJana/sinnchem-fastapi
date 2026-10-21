import { useSendBusinessEnquiryMutation } from "../services/sinnchemApi";
import type { Product } from "../types";

interface Props {
  initialProduct?: Product | null;
}

export function BusinessEnquiryPage({ initialProduct }: Props) {
  const [sendEnquiry, state] = useSendBusinessEnquiryMutation();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      await sendEnquiry({
        name: String(values.get("name")),
        company: String(values.get("company") || ""),
        email: String(values.get("email")),
        phone: String(values.get("phone") || ""),
        interest: String(values.get("interest") || ""),
        requirement: String(values.get("requirement")),
      }).unwrap();
      form.reset();
    } catch {
      /* RTK Query exposes the error state in the form. */
    }
  }
  return (
    <main>
      <header className="page-heading">
        <p className="eyebrow">Business enquiry</p>
        <h1>Tell us what you need.</h1>
        <p>Share a few details and Sinnchem's team can follow up with you.</p>
      </header>
      <form className="form-panel enquiry-form" onSubmit={submit}>
        {state.isSuccess && (
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
            <select
              name="interest"
              defaultValue={initialProduct?.category ?? ""}
            >
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
              defaultValue={
                initialProduct
                  ? `Product: ${initialProduct.name}\nRequired quantity / pack:\nDelivery destination:`
                  : ""
              }
              placeholder="Product, quantity, or project context"
            />
          </label>
        </div>
        {state.isError && (
          <p className="form-error">
            We couldn't send your enquiry. Please email info@sinnchem.com.
          </p>
        )}
        <p className="form-note">
          Your enquiry will be emailed to Sinnchem. Please do not include
          sensitive personal or medical information.
        </p>
        <button className="button-primary" disabled={state.isLoading}>
          {state.isLoading ? "Sending…" : "Send enquiry ↗"}
        </button>
      </form>
    </main>
  );
}
