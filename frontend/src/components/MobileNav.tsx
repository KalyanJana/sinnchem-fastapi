import type { Screen } from "../types";

interface MobileNavProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}

const links: Array<{ screen: Screen; label: string; icon: string }> = [
  { screen: "home", label: "Home", icon: "⌂" },
  { screen: "products", label: "Products", icon: "+" },
  { screen: "careers", label: "Careers", icon: "✳" },
  { screen: "about", label: "Company", icon: "S" },
  { screen: "contact", label: "Contact", icon: "↗" },
];

export function MobileNav({ screen, onNavigate }: MobileNavProps) {
  const activeScreen =
    screen === "detail" ? "products" : screen === "quote" ? "contact" : screen;
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {links.map((link) => (
        <button
          key={link.screen}
          type="button"
          aria-current={activeScreen === link.screen ? "page" : undefined}
          onClick={() => onNavigate(link.screen)}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            {link.icon}
          </span>
          <span>{link.label}</span>
        </button>
      ))}
    </nav>
  );
}
