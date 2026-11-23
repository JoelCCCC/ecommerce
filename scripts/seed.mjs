import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const DB_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DB_PATH = process.env.DATABASE_PATH || path.join(DB_DIR, "ecommerce.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

console.log(`Connecting to SQLite at ${DB_PATH}...`);
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    gender TEXT NOT NULL,
    sizes TEXT NOT NULL,
    colors TEXT NOT NULL,
    image_url TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping_fee REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT 'card',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
`);

const SEED_PRODUCTS = [
  {
    name: "Heavyweight Boxy Fit Tee",
    slug: "heavyweight-boxy-fit-tee",
    description: "Crafted from 100% 280 GSM combed cotton. Features dropped shoulders, a structured silhouette, and reinforced collar.",
    price: 36.00,
    category: "T-Shirts",
    gender: "Unisex",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Washed Black", "Off White", "Sage Green", "Charcoal"],
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    stock: 45,
    featured: 1,
  },
  {
    name: "Vintage Washed Denim Trucker",
    slug: "vintage-washed-denim-trucker",
    description: "Classic American workwear reimagined. 13.5 oz Japanese selvedge-inspired denim with custom antique brass hardware.",
    price: 110.00,
    category: "Jackets & Outerwear",
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Medium Wash", "Raw Indigo", "Faded Black"],
    image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    featured: 1,
  },
  {
    name: "Cozy French Terry Pullover Hoodie",
    slug: "cozy-french-terry-pullover-hoodie",
    description: "Ultra-plush 450 GSM French terry cotton. Double-layered hood, hidden side pockets, and durable flatlock stitching.",
    price: 78.00,
    category: "Hoodies & Sweats",
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Heather Grey", "Midnight Navy", "Mocha Brown", "Jet Black"],
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    featured: 1,
  },
  {
    name: "Relaxed Pleated Wide-Leg Chinos",
    slug: "relaxed-pleated-wide-leg-chinos",
    description: "Tailored drape meets effortless casual style. Premium cotton twill fabric with front double pleats and clean tailored cuffs.",
    price: 68.00,
    category: "Pants & Bottoms",
    gender: "Men",
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki Sand", "Dark Olive", "Black"],
    image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    stock: 28,
    featured: 0,
  },
  {
    name: "Minimalist Wool Cashmere Trench",
    slug: "minimalist-wool-cashmere-trench",
    description: "An elegant cold-weather statement coat. Made with 80% recycled wool and 20% cashmere blend.",
    price: 185.00,
    category: "Jackets & Outerwear",
    gender: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Camel", "Oatmeal", "Black"],
    image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80",
    stock: 14,
    featured: 1,
  },
  {
    name: "Chunky Merino Ribbed Beanie",
    slug: "chunky-merino-ribbed-beanie",
    description: "Spun from 100% extra-fine Merino wool for itch-free warmth. Classic fold-over cuff and snug ribbed texture.",
    price: 28.00,
    category: "Accessories",
    gender: "Unisex",
    sizes: ["One Size"],
    colors: ["Burnt Orange", "Charcoal Heather", "Navy", "Mustard"],
    image_url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
    stock: 50,
    featured: 0,
  },
  {
    name: "Striped Nautical Long Sleeve Shirt",
    slug: "striped-nautical-long-sleeve-shirt",
    description: "Breton-inspired sailor shirt made of breathable carded organic cotton with horizontal stripes.",
    price: 44.00,
    category: "T-Shirts",
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy / Cream", "Black / White"],
    image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    featured: 0,
  },
  {
    name: "High-Rise Linen Blend Flow Pants",
    slug: "high-rise-linen-blend-flow-pants",
    description: "Airy, breathable linen-rayon blend that drapes elegantly. Elasticized back waistband with front zip closure.",
    price: 62.00,
    category: "Pants & Bottoms",
    gender: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Natural Linen", "Terracotta", "Forest Green"],
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
    stock: 24,
    featured: 1,
  },
  {
    name: "Tactical Ripstop Cargo Trousers",
    slug: "tactical-ripstop-cargo-trousers",
    description: "Durable cotton ripstop weave with water-repellent coating. 6 functional cargo pockets and articulated knees.",
    price: 76.00,
    category: "Pants & Bottoms",
    gender: "Men",
    sizes: ["30", "32", "34", "36"],
    colors: ["Military Green", "Urban Slate", "Stealth Black"],
    image_url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    featured: 0,
  },
  {
    name: "Padded Waterproof Utility Vest",
    slug: "padded-waterproof-utility-vest",
    description: "Lightweight thermal insulation with weather-resistant matte shell and reversible two-way YKK zip.",
    price: 88.00,
    category: "Jackets & Outerwear",
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Matte Black", "Olive Drab", "Desert Sand"],
    image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
    stock: 19,
    featured: 0,
  },
  {
    name: "Brushed Cotton Overshirt Shacket",
    slug: "brushed-cotton-overshirt-shacket",
    description: "Substantial brushed cotton flannel that doubles as a light jacket or heavy shirt. Twin chest flap pockets.",
    price: 72.00,
    category: "Jackets & Outerwear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Hunter Plaid", "Ochre Plaid", "Monochrome"],
    image_url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    featured: 0,
  },
  {
    name: "Full Grain Leather Minimalist Belt",
    slug: "full-grain-leather-minimalist-belt",
    description: "Solid 3.5mm vegetable-tanned Italian bridle leather with hand-burnished edges and solid brushed buckle.",
    price: 42.00,
    category: "Accessories",
    gender: "Unisex",
    sizes: ["32", "34", "36", "38"],
    colors: ["Vintage Tan", "Cognac Brown", "Pitch Black"],
    image_url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    featured: 0,
  }
];

const now = new Date().toISOString();
const insert = db.prepare(`
  INSERT OR IGNORE INTO products (
    name, slug, description, price, category, gender, sizes, colors, image_url, stock, featured, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of SEED_PRODUCTS) {
  insert.run(
    p.name,
    p.slug,
    p.description,
    p.price,
    p.category,
    p.gender,
    JSON.stringify(p.sizes),
    JSON.stringify(p.colors),
    p.image_url,
    p.stock,
    p.featured,
    now,
    now
  );
}

const count = db.prepare("SELECT count(*) as count FROM products").get();
console.log(`✅ Database successfully initialized with ${count.count} clothing items!`);
