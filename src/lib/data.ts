export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  specs: Record<string, string>;
  visibleTo: string[]; // stakeholder IDs
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  company: string;
  password: string;
}

const PRODUCTS_KEY = "catalog_products";
const STAKEHOLDERS_KEY = "catalog_stakeholders";
const ADMIN_PASSWORD = "admin123"; // Simple demo admin

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Oak Desk",
    description: "Handcrafted solid oak desk with cable management and adjustable height mechanism. Perfect for executive offices.",
    category: "Furniture",
    price: 1299,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop",
    specs: { Material: "Solid Oak", Dimensions: "160×80×75cm", Weight: "45kg", Warranty: "5 years" },
    visibleTo: ["s1", "s2"],
  },
  {
    id: "p2",
    name: "Ergonomic Task Chair",
    description: "Advanced lumbar support with breathable mesh back. Fully adjustable armrests and seat depth.",
    category: "Furniture",
    price: 849,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=400&fit=crop",
    specs: { Material: "Mesh + Aluminum", "Max Weight": "150kg", Adjustments: "12-point", Warranty: "10 years" },
    visibleTo: ["s1", "s3"],
  },
  {
    id: "p3",
    name: "Wireless Conference Speaker",
    description: "360° omnidirectional microphone array with noise cancellation. Supports up to 20 participants.",
    category: "Electronics",
    price: 399,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop",
    specs: { Connectivity: "Bluetooth 5.2 + USB-C", Battery: "12 hours", Range: "15m", Drivers: "4× 40mm" },
    visibleTo: ["s2", "s3"],
  },
  {
    id: "p4",
    name: "Smart Whiteboard 75\"",
    description: "Interactive touch display with real-time collaboration. Integrates with all major video conferencing platforms.",
    category: "Electronics",
    price: 4999,
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&h=400&fit=crop",
    specs: { Display: "4K UHD", "Touch Points": "20", OS: "Android 12", Connectivity: "Wi-Fi 6 + Ethernet" },
    visibleTo: ["s1"],
  },
  {
    id: "p5",
    name: "Modular Shelving System",
    description: "Configurable wall-mounted shelving in powder-coated steel. Expand and reconfigure as needs change.",
    category: "Furniture",
    price: 599,
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=400&fit=crop",
    specs: { Material: "Powder-coated Steel", Modules: "6 included", "Max Load": "30kg/shelf", Colors: "Black, White, Sage" },
    visibleTo: ["s1", "s2", "s3"],
  },
  {
    id: "p6",
    name: "LED Desk Lamp Pro",
    description: "Color temperature adjustable from 2700K to 6500K. Built-in wireless charging pad and USB-C port.",
    category: "Accessories",
    price: 189,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=400&fit=crop",
    specs: { Brightness: "1200 lux", "Color Temp": "2700-6500K", Power: "12W", Height: "45cm" },
    visibleTo: ["s2", "s3"],
  },
];

const defaultStakeholders: Stakeholder[] = [
  { id: "s1", name: "Sarah Chen", email: "sarah@acmecorp.com", company: "Acme Corp", password: "acme2024" },
  { id: "s2", name: "James Rivera", email: "james@globex.com", company: "Globex Inc", password: "globex2024" },
  { id: "s3", name: "Maria Petrov", email: "maria@initech.com", company: "Initech Ltd", password: "initech2024" },
];

function loadFromStorage<T>(key: string, defaults: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaults;
  } catch {
    return defaults;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getProducts(): Product[] {
  return loadFromStorage(PRODUCTS_KEY, defaultProducts);
}

export function saveProducts(products: Product[]) {
  saveToStorage(PRODUCTS_KEY, products);
}

export function getStakeholders(): Stakeholder[] {
  return loadFromStorage(STAKEHOLDERS_KEY, defaultStakeholders);
}

export function saveStakeholders(stakeholders: Stakeholder[]) {
  saveToStorage(STAKEHOLDERS_KEY, stakeholders);
}

export function authenticateStakeholder(email: string, password: string): Stakeholder | null {
  const stakeholders = getStakeholders();
  return stakeholders.find((s) => s.email === email && s.password === password) || null;
}

export function authenticateAdmin(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getProductsForStakeholder(stakeholderId: string): Product[] {
  return getProducts().filter((p) => p.visibleTo.includes(stakeholderId));
}

export function getCategories(): string[] {
  const products = getProducts();
  return [...new Set(products.map((p) => p.category))];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
