import { useEffect, useState } from "react";
import { categories, products } from "../data";
import type { Screen } from "../types";

interface Props {
  onNavigate: (screen: Screen, category?: string) => void;
}
const productGroups = [
  {
    label: "Pharmaceutical chemicals",
    products: products.filter(
      (product) => product.category === "Pharmaceutical Chemical",
    ),
  },
  {
    label: "Speciality chemicals",
    products: products.filter(
      (product) => product.category === "Speciality Chemical",
    ),
  },
  {
    label: "Plant growth and agriculture",
    products: products.filter((product) =>
      ["Plant Growth Regulator", "Agriculture Herbicide"].includes(
        product.category,
      ),
    ),
  },
  {
    label: "New products",
    products: products.filter((product) => product.category === "New Items"),
  },
];
const heroProducts = productGroups.flatMap((group) => group.products);
const productGroupStarts = productGroups.map((group) =>
  heroProducts.findIndex((product) => product === group.products[0]),
);

export function HomePage({ onNavigate }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const activeProduct = heroProducts[activeSlide];
  const activeGroup = productGroupStarts.reduce(
    (groupIndex, startIndex, index) =>
      activeSlide >= startIndex ? index : groupIndex,
    0,
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setActiveSlide((current) => (current + 1) % heroProducts.length);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-kicker">Chemistry for progress</span>
          <h1>
            Ideas into <em>impact.</em>
          </h1>
          <p>
            Research and manufacturing support for pharmaceutical chemistry,
            from lead generation to clinical.
          </p>
          <div className="hero-actions">
            <button
              className="button-primary"
              onClick={() => onNavigate("products")}
            >
              Explore capabilities ↗
            </button>
            <button className="text-link" onClick={() => onNavigate("about")}>
              Our story
            </button>
            <a className="hero-call" href="tel:+919850498435">
              ☎ <span>+91 98504 98435</span>
            </a>
          </div>
        </div>
        <div className="hero-image" aria-label="Sinnchem product catalogue">
          <div className="hero-slide is-active" key={activeProduct.name}>
            <img src={activeProduct.image} alt={activeProduct.name} />
            <div className="hero-product-footer">
              <div className="hero-slide-label">
                <div className="hero-product-category">
                  {activeProduct.category}
                </div>
                <strong className="hero-product-name">
                  {activeProduct.name}
                </strong>
              </div>
              <div className="hero-controls" aria-label="Choose hero image">
                {productGroups.map((group, index) => (
                  <button
                    className="hero-dot"
                    key={group.label}
                    type="button"
                    aria-label={`Show ${group.label}`}
                    aria-current={activeGroup === index}
                    onClick={() => setActiveSlide(productGroupStarts[index])}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="intro-row">
        <strong>
          Thoughtful chemistry.
          <br />
          Made for ambitious science.
        </strong>
        <span>⌖ Telangana, India</span>
      </div>
      <section className="content-section">
        <div className="section-heading">
          <div>
            <p>Explore our range</p>
            <h2>Areas of chemistry</h2>
          </div>
          <button className="arrow-link" onClick={() => onNavigate("products")}>
            All products ↗
          </button>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              className="category-card"
              key={category.filter}
              onClick={() => onNavigate("products", category.filter)}
            >
              <span>{category.count}</span>
              <strong>{category.title}</strong>
              <b>↗</b>
            </button>
          ))}
        </div>
      </section>
      <section className="company-snapshot">
        <p className="eyebrow">Sinnchem at a glance</p>
        <h2>A focused partner for chemistry-led development.</h2>
        <div className="fact-grid">
          <div>
            <strong>Since 2021</strong>
            <span>Established in Hyderabad, Telangana</span>
          </div>
          <div>
            <strong>R&amp;D to clinical</strong>
            <span>
              Support stated from lead generation through clinical studies
            </span>
          </div>
          <div>
            <strong>Fine chemicals &amp; APIs</strong>
            <span>Areas named in the company profile</span>
          </div>
          <div>
            <strong>Custom synthesis</strong>
            <span>Manufacturing and research partnership focus</span>
          </div>
        </div>
        <div className="snapshot-careers">
          <p>
            <strong>Build your career in chemistry</strong>Explore illustrative
            early-career and experienced-role opportunities.
          </p>
          <button className="text-link" onClick={() => onNavigate("careers")}>
            Explore careers ↗
          </button>
        </div>
      </section>
      <section className="journey-band">
        <div className="journey-inner">
          <p>Research &amp; manufacturing support</p>
          <h2>Along the R&amp;D journey</h2>
          <ol className="journey-steps">
            <li>
              <span>01</span>
              <h3>Lead generation</h3>
            </li>
            <li>
              <span>02</span>
              <h3>Development support</h3>
            </li>
            <li>
              <span>03</span>
              <h3>Clinical stage</h3>
            </li>
          </ol>
        </div>
      </section>
      <section className="content-section home-cta">
        <p className="eyebrow">Start a conversation</p>
        <h2>Have a molecule in mind?</h2>
        <p>
          Tell us what you are developing. Our team can help you explore the
          right chemistry support.
        </p>
        <button className="button-primary" onClick={() => onNavigate("quote")}>
          Discuss your requirement ↗
        </button>
      </section>
    </main>
  );
}
