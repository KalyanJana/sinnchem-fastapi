export type Screen =
  | "home"
  | "products"
  | "detail"
  | "about"
  | "careers"
  | "contact"
  | "quote";

export interface BusinessEnquiry {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  interest?: string;
  requirement: string;
}

export interface ApiMessage {
  message: string;
  reference_id: string;
}

export interface Product {
  name: string;
  category: string;
  image: string;
  images: string[];
  cas?: string;
  description: string;
  specification: Record<string, string>;
  additionalInformation?: Record<string, string>;
  minimumQuantity?: number;
  unit?: string;
  price?: number;
}
