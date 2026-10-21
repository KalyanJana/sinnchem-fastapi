import { useState } from "react";
import { useSubmitCareerApplicationMutation } from "../services/sinnchemApi";

const roles = [
  {
    title: "Laboratory Chemist",
    level: "B.Sc. / M.Sc.",
    type: "Early career · Chemistry",
    experience: "0–2 years · illustrative",
    description:
      "Support laboratory work, sample preparation, reaction monitoring, and accurate recording of results. Chemistry graduates with careful lab practice are encouraged to apply.",
  },
  {
    title: "Research Associate",
    level: "M.Sc.",
    type: "Research · Organic chemistry",
    experience: "0–3 years · illustrative",
    description:
      "Contribute to synthesis and development projects through experiment planning, reaction execution, work-up, and documentation under project guidance.",
  },
  {
    title: "Quality Control Analyst",
    level: "B.Sc. / M.Sc.",
    type: "Quality · Laboratory",
    experience: "1–3 years · illustrative",
    description:
      "Assist with sample testing, laboratory records, and reporting. Relevant analytical chemistry experience and careful documentation are valued.",
  },
  {
    title: "Process Chemist",
    level: "M.Sc. + experience",
    type: "Experienced · Process chemistry",
    experience: "2+ years · illustrative",
    description:
      "Bring practical process chemistry experience to route execution, optimization support, scale-up activities, and clear technical reporting.",
  },
];

export function CareersPage() {
  const [role, setRole] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitApplication, state] = useSubmitCareerApplicationMutation();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size === 0) return;
    if (cv.size > 5 * 1024 * 1024) {
      window.alert("Please choose a PDF or Word CV up to 5 MB.");
      return;
    }
    try {
      await submitApplication(data).unwrap();
      setSuccess(true);
      form.reset();
    } catch {
      setSuccess(false);
    }
  }

  function applyFor(title: string) {
    setRole(title);
    setSuccess(false);
    document
      .getElementById("career-application")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <header className="page-heading">
        <p className="eyebrow">Careers at Sinnchem</p>
        <h1>Bring your curiosity to chemistry.</h1>
        <p>
          Explore example roles across laboratory research, quality, and process
          chemistry in Hyderabad.
        </p>
      </header>
      <section className="career-grid">
        {roles.map((item) => (
          <article className="career-card" key={item.title}>
            <span className="career-type">{item.type}</span>
            <div className="career-title-row">
              <h2>{item.title}</h2>
              <span className="career-tag">{item.level}</span>
            </div>
            <p className="career-meta">Hyderabad · {item.experience}</p>
            <p>{item.description}</p>
            <button
              className="outline-button"
              onClick={() => applyFor(item.title)}
            >
              Apply now ↗
            </button>
          </article>
        ))}
      </section>
      <section className="application-section" id="career-application">
        <p className="eyebrow">Candidate application</p>
        <h2>{role ? `Apply for ${role}` : "Share your profile"}</h2>
        <p className="form-note">
          CV and personal details are sent to Sinnchem by email. Use only
          information you are comfortable sharing.
        </p>
        <form
          className="form-panel"
          onSubmit={submit}
          encType="multipart/form-data"
        >
          <div className="form-grid">
            <label>
              Full name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Mobile number
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              Role
              <select
                name="role"
                required
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="">Select a role</option>
                {roles.map((item) => (
                  <option key={item.title}>{item.title}</option>
                ))}
                <option>Other / General application</option>
              </select>
            </label>
            <label>
              Highest education qualification
              <select name="education" required defaultValue="">
                <option value="" disabled>
                  Select qualification
                </option>
                <option>B.Sc.</option>
                <option>M.Sc.</option>
                <option>M.Pharm.</option>
                <option>Ph.D.</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Specialization / discipline
              <input
                name="discipline"
                required
                placeholder="e.g. Organic Chemistry"
              />
            </label>
            <label>
              Total industry experience (years)
              <input
                name="experience_years"
                type="number"
                min="0"
                max="60"
                step="0.5"
                required
                placeholder="0 for fresher"
              />
            </label>
            <label>
              Current city
              <input
                name="city"
                autoComplete="address-level2"
                required
                placeholder="City, state"
              />
            </label>
            <label className="wide">
              Updated CV
              <input
                className="file-input"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                required
              />
              <small>PDF or Word document · up to 5 MB</small>
            </label>
            <label className="wide">
              Short note (optional)
              <textarea
                name="note"
                placeholder="A short introduction or relevant experience"
              />
            </label>
          </div>
          {state.isError && (
            <p className="form-error">
              We couldn't submit your application. Please try again or email
              info@sinnchem.com.
            </p>
          )}
          {success && (
            <p className="form-success">
              Your application has been accepted for delivery to Sinnchem.
            </p>
          )}
          <button className="button-primary" disabled={state.isLoading}>
            {state.isLoading ? "Submitting…" : "Submit application ↗"}
          </button>
        </form>
      </section>
    </main>
  );
}
