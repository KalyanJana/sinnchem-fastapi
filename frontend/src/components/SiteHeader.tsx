import type { Screen } from "../types";
import { Brand } from "./Brand";

interface SiteHeaderProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}

const links: Array<{ screen: Screen; label: string }> = [
  { screen: "home", label: "Home" },
  { screen: "products", label: "Products" },
  { screen: "about", label: "About Sinnchem" },
  { screen: "careers", label: "Careers" },
  { screen: "contact", label: "Contact" },
];

export function SiteHeader({ screen, onNavigate }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <button
        className="brand-button"
        type="button"
        onClick={() => onNavigate("home")}
        aria-label="Sinnchem home"
      >
        <Brand />
      </button>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <button
            key={link.screen}
            type="button"
            aria-current={screen === link.screen ? "page" : undefined}
            onClick={() => onNavigate(link.screen)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <a
          className="header-phone"
          href="tel:+919850498435"
          aria-label="Call Sinnchem at +91 98504 98435"
        >
          <span aria-hidden="true">☎</span>
          <span>+91 98504 98435</span>
        </a>
        <button
          className="header-enquire"
          type="button"
          onClick={() => onNavigate("quote")}
        >
          Enquire <span aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );
}
