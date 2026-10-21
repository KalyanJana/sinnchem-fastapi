import { useEffect, useState } from "react";
import { MobileNav } from "./components/MobileNav";
import { SiteHeader } from "./components/SiteHeader";
import { BusinessEnquiryPage } from "./features/BusinessEnquiryPage";
import { CareersPage } from "./features/CareersPage";
import { CompanyPage } from "./features/CompanyPage";
import { ContactPage } from "./features/ContactPage";
import { HomePage } from "./features/HomePage";
import { ProductsPage } from "./features/ProductsPage";
import type { Product, Screen } from "./types";

export default function App() {
  const initial = window.location.hash.replace("#", "") as Screen;
  const [screen, setScreen] = useState<Screen>(
    ["home", "products", "about", "careers", "contact", "quote"].includes(
      initial,
    )
      ? initial
      : "home",
  );
  const [productForQuote, setProductForQuote] = useState<Product | null>(null);

  function navigate(next: Screen, category?: string) {
    if (next === "products" && category)
      window.history.replaceState(
        null,
        "",
        `#products?category=${encodeURIComponent(category)}`,
      );
    else window.history.replaceState(null, "", `#${next}`);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openQuote(product?: Product) {
    setProductForQuote(product ?? null);
    navigate("quote");
  }

  useEffect(() => {
    const onHash = () => {
      const route = window.location.hash.slice(1).split("?")[0] as Screen;
      if (
        ["home", "products", "about", "careers", "contact", "quote"].includes(
          route,
        )
      )
        setScreen(route);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="site-shell">
      <SiteHeader screen={screen} onNavigate={navigate} />
      <div className="screen-content" key={screen}>
        {screen === "home" && <HomePage onNavigate={navigate} />}
        {screen === "products" && <ProductsPage onQuote={openQuote} />}
        {screen === "about" && <CompanyPage />}
        {screen === "careers" && <CareersPage />}
        {screen === "contact" && <ContactPage />}
        {screen === "quote" && (
          <BusinessEnquiryPage initialProduct={productForQuote} />
        )}
      </div>
      <footer className="site-footer">
        <span>
          Sinnchem Life Sciences (OPC) Private Limited · Hyderabad, India
        </span>
        <a href="mailto:info@sinnchem.com">info@sinnchem.com</a>
      </footer>
      <MobileNav screen={screen} onNavigate={navigate} />
    </div>
  );
}
