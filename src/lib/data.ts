export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  
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
  // === Skills Exercises ===
  { id: "p1", name: "LTS01, SIMSEI PEGBOARD EXERCISE", description: "SIMSEI Pegboard Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777000901" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p2", name: "LTS02, SIMSEI TISSUE PLATFORM 1/EA", description: "SIMSEI Tissue Platform", category: "Skills Exercises", image: "", specs: { "Item Number": "777024001" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p3", name: "LTS03, SIMSEI TISSUE MODEL 10/PK", description: "SIMSEI Tissue Model, 10 pack", category: "Skills Exercises", image: "", specs: { "Item Number": "777023901" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p4", name: "LTS04, SIMSEI DISSECTION MODEL 5/PK", description: "SIMSEI Dissection Model, 5 pack", category: "Skills Exercises", image: "", specs: { "Item Number": "777052172" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p5", name: "LTS05, SIMSEI SUTURE PASSING EXERCISE", description: "SIMSEI Suture Passing Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777052753" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p6", name: "LTS06, SIMSEI 0° CAMERA NAVIGATION EXERCISE", description: "SIMSEI 0° Camera Navigation Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777052644" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p7", name: "LTS07, SIMSEI TISSUE MODEL 1/EA", description: "SIMSEI Tissue Model, single", category: "Skills Exercises", image: "", specs: { "Item Number": "777053060" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p8", name: "LTS08, SIMSEI DISSECTION MODEL 1/EA", description: "SIMSEI Dissection Model, single", category: "Skills Exercises", image: "", specs: { "Item Number": "777053062" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p9", name: "LTS09, SIMSEI MULTISKILL EXERCISE 1/EA", description: "SIMSEI Multiskill Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777053424" }, visibleTo: ["s1", "s2", "s3"] },

  // === Task Trainers & Models ===
  { id: "p10", name: "LTT01, SIMSEI GALLBLADDER BASE", description: "SIMSEI Gallbladder Base", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777020101" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p11", name: "LTT02, SIMSEI GALLBLADDER MODEL 1/EA", description: "SIMSEI Gallbladder Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777014201" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p12", name: "LTT03, SIMSEI GALLBLADDER MODEL 5/PK", description: "SIMSEI Gallbladder Model, 5 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777014301" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p13", name: "LTT04, SIMSEI VAGINAL CUFF MODEL 1/EA", description: "SIMSEI Vaginal Cuff Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053071" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p14", name: "LTT05, SIMSEI GYN MODEL 1/EA", description: "SIMSEI GYN Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777031301" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p15", name: "LTT11, SIMSEI FIRST ENTRY MODEL 1/EA", description: "SIMSEI First Entry Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053042" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p16", name: "LTT17, SIMSEI GYN MODEL 1/EA", description: "SIMSEI GYN Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052561" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p17", name: "LTT06, SIMSEI TRANSANAL ADAPTER", description: "SIMSEI Transanal Adapter", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777004801" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p18", name: "LTT07, SIMSEI RECTUM MODEL 3/PK", description: "SIMSEI Rectum Model, 3 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777004901" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p19", name: "LTT27, SIMSEI SUTURABLE RECTUM MODEL 5/PK", description: "SIMSEI Suturable Rectum Model, 5 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052015" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p20", name: "LTT08, SIMSEI VAGINAL CUFF BASE", description: "SIMSEI Vaginal Cuff Base", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777051801" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p21", name: "LTT09, SIMSEI VAGINAL CUFF MODEL 10/PK", description: "SIMSEI Vaginal Cuff Model, 10 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777030901" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p22", name: "LTT10, SIMSEI FIRST ENTRY MODEL 4/PK", description: "SIMSEI First Entry Model, 4 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777026601" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p23", name: "LTT12, SIMSEI ANASTOMOSIS MODEL 10/PK", description: "SIMSEI Anastomosis Model, 10 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777029801" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p24", name: "LTT13, SIMSEI ANASTOMOSIS MODEL 2/EA", description: "SIMSEI Anastomosis Model, 2 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053063" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p25", name: "LTT14, SIMSEI APPENDECTOMY MODEL", description: "SIMSEI Appendectomy Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777046101" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p26", name: "LTT18, SIMSEI EXTRACTION INSERT 1/EA", description: "SIMSEI Extraction Insert, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052188" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p27", name: "LTT19, SIMSEI SIMULATED UTERUS MODEL", description: "SIMSEI Simulated Uterus Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052346" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p28", name: "LTT20, SIMSEI RENAL HILUM MODEL", description: "SIMSEI Renal Hilum Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052736" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p29", name: "LTT28, SIMSEI ECTOPIC PREGNANCY MODEL", description: "SIMSEI Ectopic Pregnancy Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053403" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p30", name: "LTT29, SIMSEI OVARIAN CYST TORSION MODEL", description: "SIMSEI Ovarian Cyst Torsion Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053404" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p31", name: "LTT31, SIMSEI COLPOTOMY MODEL", description: "SIMSEI Colpotomy Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053595" }, visibleTo: ["s1", "s2", "s3"] },

  // === Consumables ===
  { id: "p32", name: "LTC11, SIMSEI LARGE AB WALL INSERT 4/PK", description: "SIMSEI Large Ab Wall Insert, 4 pack", category: "Consumables", image: "", specs: { "Item Number": "777007601" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p33", name: "LTC14, SIMSEI SMALL AB WALL INSERT 15/PK", description: "SIMSEI Small Ab Wall Insert, 15 pack", category: "Consumables", image: "", specs: { "Item Number": "777008301" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p34", name: "LTC09, SIMSEI LARGE AB WALL INSERT 4/PK (BASIC)", description: "SIMSEI Large Ab Wall Insert (Basic), 4 pack", category: "Consumables", image: "", specs: { "Item Number": "777049401" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p35", name: "LTC10, SIMSEI SMALL AB WALL INSERT 4/PK (BASIC)", description: "SIMSEI Small Ab Wall Insert (Basic), 4 pack", category: "Consumables", image: "", specs: { "Item Number": "777049301" }, visibleTo: ["s1", "s2", "s3"] },

  // === Trainers ===
  { id: "p36", name: "LT001, SIMSEI LAPAROSCOPIC TRAINER (Gen 1 Camera)", description: "SIMSEI Laparoscopic Trainer with Gen 1 Camera", category: "Trainers", image: "", specs: { "Item Number": "777052331" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p37", name: "LT001, SIMSEI LAPAROSCOPIC TRAINER (Gen 2 Camera)", description: "SIMSEI Laparoscopic Trainer with Gen 2 Camera", category: "Trainers", image: "", specs: { "Item Number": "777053001" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p38", name: "LT001, SIMSEI LAPAROSCOPIC TRAINER (Gen 3 Camera)", description: "SIMSEI Laparoscopic Trainer with Gen 3 Camera", category: "Trainers", image: "", specs: { "Item Number": "777053718" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p39", name: "LT002, SIMSEI LAPAROSCOPIC TRAINER EF", description: "SIMSEI Laparoscopic Trainer EF", category: "Trainers", image: "", specs: { "Item Number": "777052175" }, visibleTo: ["s1", "s2", "s3"] },

  // === Accessories ===
  { id: "p40", name: "LTA11, SIMSEI 10mm 0° CAMERA (Gen 1)", description: "SIMSEI 10mm 0° Camera, Gen 1", category: "Accessories", image: "", specs: { "Item Number": "777052321" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p41", name: "LTA11, SIMSEI 10mm 0° CAMERA (Gen 2)", description: "SIMSEI 10mm 0° Camera, Gen 2", category: "Accessories", image: "", specs: { "Item Number": "777052941" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p42", name: "LTA11, SIMSEI 10mm 0° CAMERA (Gen 3)", description: "SIMSEI 10mm 0° Camera, Gen 3", category: "Accessories", image: "", specs: { "Item Number": "777053717" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p43", name: "LTA12, SIMSEI CAMERA HOLDER", description: "SIMSEI Camera Holder", category: "Accessories", image: "", specs: { "Item Number": "777052326" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p44", name: "LTA13, SCOPE HOLDER THUMB SCREW", description: "Scope Holder Thumb Screw", category: "Accessories", image: "", specs: { "Item Number": "777053323" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p45", name: "LTA15, SIMSEI 10mm 30° CAMERA (Gen 1)", description: "SIMSEI 10mm 30° Camera, Gen 1", category: "Accessories", image: "", specs: { "Item Number": "777053450" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p46", name: "LTA22, SIMSEI LAPAROSCOPIC INSERT", description: "SIMSEI Laparoscopic Insert", category: "Accessories", image: "", specs: { "Item Number": "777052749" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p47", name: "LTA20, SIMSEI DEMO INSERT", description: "SIMSEI Demo Insert", category: "Accessories", image: "", specs: { "Item Number": "777008601" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p48", name: "LTA23, SIMSEI SMALL AB WALL HOLDER", description: "SIMSEI Small Ab Wall Holder", category: "Accessories", image: "", specs: { "Item Number": "777008501" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p49", name: "LTA21, SIMSEI ADJUSTABLE LEGS", description: "SIMSEI Adjustable Legs", category: "Accessories", image: "", specs: { "Item Number": "777008701" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p50", name: "LTA30, SIMSEI CAMERA CASE", description: "SIMSEI Camera Case", category: "Accessories", image: "", specs: { "Item Number": "777052448" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p51", name: "LTA31, SIMSEI CARRYING CASE", description: "SIMSEI Carrying Case", category: "Accessories", image: "", specs: { "Item Number": "777013401" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p52", name: "LTA25, SIMSEI 12MM FIOS DEMO TROCAR", description: "SIMSEI 12mm FIOS Demo Trocar", category: "Accessories", image: "", specs: { "Item Number": "777052312" }, visibleTo: ["s1", "s2", "s3"] },

  // === Power Supplies ===
  { id: "p53", name: "LTP10, SIMSEI POWER SUPPLY", description: "SIMSEI Power Supply", category: "Power Supplies", image: "", specs: { "Item Number": "777028101" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p54", name: "LTP11, SIMSEI POWER ADAPTER USA & JP", description: "SIMSEI Power Adapter for USA & Japan", category: "Power Supplies", image: "", specs: { "Item Number": "777052322" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p55", name: "LTP12, SIMSEI POWER ADAPTER UK", description: "SIMSEI Power Adapter for UK", category: "Power Supplies", image: "", specs: { "Item Number": "777052323" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p56", name: "LTP13, SIMSEI POWER ADAPTER EU & SA", description: "SIMSEI Power Adapter for EU & South America", category: "Power Supplies", image: "", specs: { "Item Number": "777052325" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p57", name: "LTP14, SIMSEI POWER ADAPTER AU", description: "SIMSEI Power Adapter for Australia", category: "Power Supplies", image: "", specs: { "Item Number": "777052324" }, visibleTo: ["s1", "s2", "s3"] },

  // === Additional Consumables ===
  { id: "p58", name: "LTC16, SIMSEI GelPOINT PLATFORM PK", description: "SIMSEI GelPOINT Platform Pack", category: "Consumables", image: "", specs: { "Item Number": "777020001" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p59", name: "LTC23, SIMSEI GELPOINT PATH PLATFORM PK", description: "SIMSEI GelPOINT Path Platform Pack", category: "Consumables", image: "", specs: { "Item Number": "777006201" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p60", name: "LTC01, SIMSEI PRO LAYERED INSERT", description: "SIMSEI Pro Layered Insert", category: "Consumables", image: "", specs: { "Item Number": "777052582" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p61", name: "LTC01R, SIMSEI PRO LAYERED INSERT", description: "SIMSEI Pro Layered Insert (Replacement)", category: "Consumables", image: "", specs: { "Item Number": "777052583" }, visibleTo: ["s1", "s2", "s3"] },

  // === Clinical Education ===
  { id: "p62", name: "LCE01, CLIN ED GENERAL SURGERY TRAY", description: "Clinical Education General Surgery Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777034201" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p63", name: "LCE01R, CLIN ED GENERAL SURGERY TRAY", description: "Clinical Education General Surgery Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777044901" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p64", name: "LCE02, CLIN ED HYSTERECTOMY TRAY", description: "Clinical Education Hysterectomy Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777034701" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p65", name: "LCE02R, CLIN ED HYSTERECTOMY TRAY", description: "Clinical Education Hysterectomy Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777045001" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p66", name: "LCE03, CLIN ED GASTRIC SLEEVE TRAY", description: "Clinical Education Gastric Sleeve Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777035001" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p67", name: "LCE03R, CLIN ED GASTRIC SLEEVE TRAY", description: "Clinical Education Gastric Sleeve Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777045101" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p68", name: "LCE04, CLIN ED REMOVABLE LIVER", description: "Clinical Education Removable Liver", category: "Clinical Education", image: "", specs: { "Item Number": "777052001" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p69", name: "LCE04R, CLIN ED REMOVABLE LIVER", description: "Clinical Education Removable Liver (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777052004" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p70", name: "LCE05, CLIN ED GYN PATHOLOGY TRAY", description: "Clinical Education GYN Pathology Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777052039" }, visibleTo: ["s1", "s2", "s3"] },
  { id: "p71", name: "LCE05R, CLIN ED GYN PATHOLOGY TRAY", description: "Clinical Education GYN Pathology Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777052055" }, visibleTo: ["s1", "s2", "s3"] },

  // === Additional Task Trainers ===
  { id: "p72", name: "LTT26, SIMSEI TRANSANAL ADAPTER SLEEVE 5/PK", description: "SIMSEI Transanal Adapter Sleeve, 5 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052093" }, visibleTo: ["s1", "s2", "s3"] },
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
