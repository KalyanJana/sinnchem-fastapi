import type { Product } from "./types";

const localProductImage = (name: string, extension: string) =>
  `/img/products/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${extension}`;

export const products: Product[] = [
  {
    name: "Methyl 2-Amino-4,6-dihydroxy Nicotinate",
    category: "Pharmaceutical Chemical",
    image: localProductImage("Methyl 2-Amino-4,6-dihydroxy Nicotinate", "jpg"),
    cas: "523992-26-9",
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Confirm current specification and availability with the team.",
  },
  {
    name: "6-Chloro Uracil",
    category: "Pharmaceutical Chemical",
    image: localProductImage("6-Chloro Uracil", "jpg"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "4-Acetyl-2-Methyl Benzonitrile",
    category: "Pharmaceutical Chemical",
    image: localProductImage("4-Acetyl-2-Methyl Benzonitrile", "jpg"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "Ethyl-4-Chloro-3-Hydroxy-5-Nitrobenzoate",
    category: "Pharmaceutical Chemical",
    image: localProductImage("Ethyl-4-Chloro-3-Hydroxy-5-Nitrobenzoate", "png"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "Tert-Butyl-4-Chloro-3-Hydroxy-5-Nitrobenzoate",
    category: "Pharmaceutical Chemical",
    image: localProductImage("Tert-Butyl-4-Chloro-3-Hydroxy-5-Nitrobenzoate", "png"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "Barbituric Acid",
    category: "Pharmaceutical Chemical",
    image: localProductImage("Barbituric Acid", "png"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "2-Chloro-6-Trifluoromethyl Nicotinic Acid",
    category: "Pharmaceutical Chemical",
    image: localProductImage("2-Chloro-6-Trifluoromethyl Nicotinic Acid", "png"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "Dimethyl 2-Methoxymalonate",
    category: "Speciality Chemical",
    image: localProductImage("Dimethyl 2-Methoxymalonate", "jpg"),
    cas: "5018-30-4",
    description:
      "A speciality chemical listed in Sinnchem's public catalogue. Confirm current specification and availability with the team.",
  },
  {
    name: "Dimethyl Acetone Dicarboxylate",
    category: "Speciality Chemical",
    image: localProductImage("Dimethyl Acetone Dicarboxylate", "jpg"),
    description:
      "A speciality chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "N-Acetyl Thiazolidine-4-Carboxylic Acid (NATCA)",
    category: "Plant Growth Regulator",
    image: localProductImage("N-Acetyl Thiazolidine-4-Carboxylic Acid (NATCA)", "jpg"),
    cas: "5025-82-1",
    description:
      "A plant growth regulator listed in Sinnchem's public catalogue. Confirm current specification and availability with the team.",
  },
  {
    name: "N-Methyl Sulfamide",
    category: "Agriculture Herbicide",
    image: localProductImage("N-Methyl Sulfamide", "png"),
    cas: "72179-84-1",
    description:
      "An agriculture herbicide listed in Sinnchem's public catalogue. Request current product information.",
  },
  {
    name: "2,8-Dichloroquinoxaline",
    category: "New Items",
    image: localProductImage("2,8-Dichloroquinoxaline", "jpg"),
    cas: "120258-69-7",
    description:
      "A recently listed product in Sinnchem's public catalogue. Confirm current specification and availability.",
  },
  {
    name: "6-Bromo-3-Chloroisoquinoline",
    category: "New Items",
    image: localProductImage("6-Bromo-3-Chloroisoquinoline", "jpg"),
    description:
      "A recently listed product in Sinnchem's public catalogue. Confirm current specification and availability.",
  },
  {
    name: "tert-Butyl 3,3-difluro-1,8-diazaspiro [4,5] decane-8carboxylate",
    category: "New Items",
    image: localProductImage("tert-Butyl 3,3-difluro-1,8-diazaspiro [4,5] decane-8carboxylate", "jpg"),
    description:
      "A recently listed product in Sinnchem's public catalogue. Confirm current specification and availability.",
  },
  {
    name: "2,5-Dichloroquinoxaline",
    category: "New Items",
    image: localProductImage("2,5-Dichloroquinoxaline", "jpg"),
    description:
      "A recently listed product in Sinnchem's public catalogue. Confirm current specification and availability.",
  },
  {
    name: "3,6-Dichloro-2,7-Naphthyridine",
    category: "New Items",
    image: localProductImage("3,6-Dichloro-2,7-Naphthyridine", "jpg"),
    description:
      "A recently listed product in Sinnchem's public catalogue. Confirm current specification and availability.",
  },
  {
    name: "Methyl Acetimidate Hydrochloride",
    category: "Pharmaceutical Chemical",
    image: localProductImage("Methyl Acetimidate Hydrochloride", "png"),
    description:
      "A pharmaceutical chemical listed in Sinnchem's public catalogue. Request current product information.",
  },
];

export const categories = [
  {
    title: "Pharmaceutical chemicals",
    filter: "Pharmaceutical Chemical",
    count: "08 PRODUCTS",
  },
  {
    title: "Speciality chemicals",
    filter: "Speciality Chemical",
    count: "02 PRODUCTS",
  },
  {
    title: "Plant growth regulators",
    filter: "Plant Growth Regulator",
    count: "01 PRODUCT",
  },
  {
    title: "Agriculture herbicides",
    filter: "Agriculture Herbicide",
    count: "01 PRODUCT",
  },
];
