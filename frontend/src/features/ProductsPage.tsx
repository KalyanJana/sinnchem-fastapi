import { useMemo, useState } from "react";
import { categories, products } from "../data";
import type { Product } from "../types";

interface Props {
  onQuote: (product?: Product) => void;
}

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
    const specificationRows = Object.entries(selected.specification);
    if (
      selected.minimumQuantity !== undefined &&
      !specificationRows.some(([label]) => /minimum/i.test(label))
    ) {
      specificationRows.push([
        "Minimum quantity",
        `${selected.minimumQuantity} ${selected.unit ?? ""}`.trim(),
      ]);
    }

    return (
      <main className="product-detail">
        <button className="back-link" onClick={() => setSelected(null)}>
          ← Back to products
        </button>
        <div className="detail-grid">
          <div className="detail-image">
            {selected.images.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${selected.name} catalogue image ${index + 1}`}
              />
            ))}
          </div>
          <div>
            <p className="eyebrow">{selected.category}</p>
            <h1>{selected.name}</h1>
            <p className="detail-intro">{selected.description}</p>
            <h2>Product specifications</h2>
            <table className="spec-table">
              <tbody>
                {specificationRows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selected.additionalInformation && (
              <>
                <h2>Additional information</h2>
                <table className="spec-table">
                  <tbody>
                    {Object.entries(selected.additionalInformation).map(
                      ([label, value]) => (
                        <tr key={label}>
                          <th>{label}</th>
                          <td>{value}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </>
            )}
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
