import { useMemo, useState } from "react";
import { categories, products } from "../data";
import type { Product } from "../types";

interface Props {
  onQuote: (product?: Product) => void;
}
const specs: Record<string, Array<[string, string]>> = {
  "Methyl 2-Amino-4,6-dihydroxy Nicotinate": [
    ["CAS No.", "523992-26-9"],
    ["Chemical formula", "C7H8N2O4"],
    ["Purity", ">98% (HPLC)"],
    ["Grade", "Reagent Grade"],
    ["Physical form", "Solid"],
    ["Packaging", "1 kg can"],
  ],
  "Dimethyl 2-Methoxymalonate": [
    ["CAS No.", "5018-30-4"],
    ["Purity", ">96%"],
    ["Grade", "Reagent Grade; Industrial Grade standard"],
    ["Physical form", "Liquid"],
    ["Minimum order quantity", "5 kg"],
  ],
  "N-Acetyl Thiazolidine-4-Carboxylic Acid (NATCA)": [
    ["CAS No.", "5025-82-1"],
    ["Purity", ">99% (HPLC)"],
    ["Grade", "Reagent Grade; Industrial Grade standard"],
    ["Physical form", "Powder"],
    ["Minimum order quantity", "1 kg"],
  ],
};

export function ProductsPage({ onQuote }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const visible = useMemo(
    () =>
      products.filter(
        (product) =>
          (filter === "all" || product.category === filter) &&
          `${product.name} ${product.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [filter, query],
  );
  if (selected) {
    const rows = specs[selected.name] ?? [
      ["CAS No.", "Request specification"],
      ["Chemical formula", "Request specification"],
      ["Molecular weight", "Request specification"],
      ["Purity", "Request specification"],
      ["Grade", "Request specification"],
      ["Physical form", "Request specification"],
      ["Packaging / MOQ", "Request current options"],
    ];
    return (
      <main className="product-detail">
        <button className="back-link" onClick={() => setSelected(null)}>
          ← Back to products
        </button>
        <div className="detail-grid">
          <div className="detail-image">
            <img
              src={selected.image}
              alt={`${selected.name} catalogue product`}
            />
          </div>
          <div>
            <p className="eyebrow">{selected.category}</p>
            <h1>{selected.name}</h1>
            <p className="detail-intro">{selected.description}</p>
            <h2>Product specifications</h2>
            <table className="spec-table">
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="supply-note">
              Confirm the current specification, documentation, pricing, and
              supply timeline directly with Sinnchem before ordering.
            </p>
            <button
              className="button-primary"
              onClick={() => onQuote(selected)}
            >
              Request product information ↗
            </button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main>
      <header className="page-heading">
        <p className="eyebrow">Product directory</p>
        <h1>Find your chemistry.</h1>
        <p>Browse products and categories currently listed by Sinnchem.</p>
      </header>
      <div className="product-tools">
        <label className="search-input">
          ⌕{" "}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search product or category"
          />
        </label>
        <div className="filter-row">
          <button
            className={filter === "all" ? "filter-chip active" : "filter-chip"}
            onClick={() => setFilter("all")}
          >
            All products
          </button>
          {categories.map((item) => (
            <button
              key={item.filter}
              className={
                filter === item.filter ? "filter-chip active" : "filter-chip"
              }
              onClick={() => setFilter(item.filter)}
            >
              {item.title.replace(/s$/, "")}
            </button>
          ))}
          <button
            className={
              filter === "New Items" ? "filter-chip active" : "filter-chip"
            }
            onClick={() => setFilter("New Items")}
          >
            New items
          </button>
        </div>
        <p className="results-count">{visible.length} catalogue listings</p>
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <button
            className="product-row"
            key={product.name}
            onClick={() => setSelected(product)}
          >
            <img src={product.image} alt="" />
            <span>
              <strong>{product.name}</strong>
              <small>{product.category}</small>
            </span>
            <b>›</b>
          </button>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="empty-state">No matching products. Try another search.</p>
      )}
    </main>
  );
}
