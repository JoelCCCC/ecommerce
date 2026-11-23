import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { Product, RawProduct, Order, OrderItem, CreateProductInput, CreateOrderInput } from "./types";
import { SEED_PRODUCTS } from "./seed-data";

// Database file path: supports DATABASE_PATH env (used in Docker volume) or local ./data/ecommerce.db
const DB_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DB_PATH = process.env.DATABASE_PATH || path.join(DB_DIR, "ecommerce.db");

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;

  // Ensure database directory exists
  const targetDir = path.dirname(DB_PATH);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const db = new DatabaseSync(DB_PATH);
  // Enable WAL mode for better concurrency and foreign keys
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  initSchema(db);
  dbInstance = db;
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
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

  // Check if products exist; if empty, seed initial clothes
  const countRow = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (countRow && countRow.count === 0) {
    seedDatabase(db);
  }
}

export function seedDatabase(db?: DatabaseSync) {
  const targetDb = db || getDatabase();
  const now = new Date().toISOString();

  const insert = targetDb.prepare(`
    INSERT INTO products (
      name, slug, description, price, category, gender, sizes, colors, image_url, stock, featured, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of SEED_PRODUCTS) {
    insert.run(
      item.name,
      item.slug || generateSlug(item.name),
      item.description,
      item.price,
      item.category,
      item.gender,
      JSON.stringify(item.sizes),
      JSON.stringify(item.colors),
      item.image_url,
      item.stock,
      item.featured ? 1 : 0,
      now,
      now
    );
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 6);
}

function formatProduct(raw: RawProduct): Product {
  return {
    ...raw,
    sizes: typeof raw.sizes === "string" ? JSON.parse(raw.sizes) : raw.sizes,
    colors: typeof raw.colors === "string" ? JSON.parse(raw.colors) : raw.colors,
    featured: Boolean(raw.featured),
  };
}

// ---------------- PRODUCTS CRUD ----------------

export function getAllProducts(filter?: {
  category?: string;
  gender?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Product[] {
  const db = getDatabase();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filter?.category && filter.category !== "All") {
    conditions.push("category = ?");
    params.push(filter.category);
  }

  if (filter?.gender && filter.gender !== "All") {
    conditions.push("gender = ?");
    params.push(filter.gender);
  }

  if (filter?.featured !== undefined) {
    conditions.push("featured = ?");
    params.push(filter.featured ? 1 : 0);
  }

  if (filter?.minPrice !== undefined) {
    conditions.push("price >= ?");
    params.push(filter.minPrice);
  }

  if (filter?.maxPrice !== undefined) {
    conditions.push("price <= ?");
    params.push(filter.maxPrice);
  }

  if (filter?.search) {
    conditions.push("(name LIKE ? OR description LIKE ? OR category LIKE ?)");
    const query = `%${filter.search}%`;
    params.push(query, query, query);
  }

  let sql = "SELECT * FROM products";
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  switch (filter?.sort) {
    case "price-asc":
      sql += " ORDER BY price ASC";
      break;
    case "price-desc":
      sql += " ORDER BY price DESC";
      break;
    case "name":
      sql += " ORDER BY name ASC";
      break;
    case "newest":
    default:
      sql += " ORDER BY id DESC";
      break;
  }

  const rows = db.prepare(sql).all(...params) as unknown as RawProduct[];
  return rows.map(formatProduct);
}

export function getProductById(id: number): Product | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as unknown as RawProduct | undefined;
  if (!row) return null;
  return formatProduct(row);
}

export function createProduct(input: CreateProductInput): Product {
  const db = getDatabase();
  const now = new Date().toISOString();
  const slug = input.slug || generateSlug(input.name);

  const stmt = db.prepare(`
    INSERT INTO products (
      name, slug, description, price, category, gender, sizes, colors, image_url, stock, featured, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.name,
    slug,
    input.description,
    input.price,
    input.category,
    input.gender,
    JSON.stringify(input.sizes || []),
    JSON.stringify(input.colors || []),
    input.image_url,
    input.stock ?? 10,
    input.featured ? 1 : 0,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return getProductById(newId)!;
}

export function updateProduct(id: number, input: Partial<CreateProductInput>): Product | null {
  const db = getDatabase();
  const existing = getProductById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updatedName = input.name !== undefined ? input.name : existing.name;
  const updatedDesc = input.description !== undefined ? input.description : existing.description;
  const updatedPrice = input.price !== undefined ? input.price : existing.price;
  const updatedCategory = input.category !== undefined ? input.category : existing.category;
  const updatedGender = input.gender !== undefined ? input.gender : existing.gender;
  const updatedSizes = input.sizes !== undefined ? JSON.stringify(input.sizes) : JSON.stringify(existing.sizes);
  const updatedColors = input.colors !== undefined ? JSON.stringify(input.colors) : JSON.stringify(existing.colors);
  const updatedImage = input.image_url !== undefined ? input.image_url : existing.image_url;
  const updatedStock = input.stock !== undefined ? input.stock : existing.stock;
  const updatedFeatured = input.featured !== undefined ? (input.featured ? 1 : 0) : (existing.featured ? 1 : 0);

  const stmt = db.prepare(`
    UPDATE products SET
      name = ?,
      description = ?,
      price = ?,
      category = ?,
      gender = ?,
      sizes = ?,
      colors = ?,
      image_url = ?,
      stock = ?,
      featured = ?,
      updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updatedName,
    updatedDesc,
    updatedPrice,
    updatedCategory,
    updatedGender,
    updatedSizes,
    updatedColors,
    updatedImage,
    updatedStock,
    updatedFeatured,
    now,
    id
  );

  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

// ---------------- ORDERS CRUD ----------------

export function getAllOrders(filter?: { status?: string; search?: string }): Order[] {
  const db = getDatabase();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filter?.status && filter.status !== "all") {
    conditions.push("status = ?");
    params.push(filter.status);
  }

  if (filter?.search) {
    conditions.push("(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)");
    const query = `%${filter.search}%`;
    params.push(query, query, query);
  }

  let sql = "SELECT * FROM orders";
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY id DESC";

  const orders = db.prepare(sql).all(...params) as unknown as Order[];

  // Attach items to each order
  const getItemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  for (const order of orders) {
    order.items = getItemsStmt.all(order.id) as unknown as OrderItem[];
  }

  return orders;
}

export function getOrderById(id: number): Order | null {
  const db = getDatabase();
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as unknown as Order | undefined;
  if (!order) return null;

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(id) as unknown as OrderItem[];
  order.items = items;
  return order;
}

export function getOrderByNumber(orderNumber: string): Order | null {
  const db = getDatabase();
  const order = db.prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber) as unknown as Order | undefined;
  if (!order) return null;

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id) as unknown as OrderItem[];
  order.items = items;
  return order;
}

export function createOrder(input: CreateOrderInput): Order {
  const db = getDatabase();
  const now = new Date().toISOString();
  const orderNumber = "TC-" + Math.floor(100000 + Math.random() * 900000);

  // Calculate totals
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 75 ? 0 : 8.00; // Free shipping over $75
  const total = subtotal + shippingFee;

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      order_number, customer_name, customer_email, shipping_address, city, postal_code, country,
      subtotal, shipping_fee, total, status, payment_method, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
  `);

  const orderResult = insertOrder.run(
    orderNumber,
    input.customer_name,
    input.customer_email,
    input.shipping_address,
    input.city,
    input.postal_code,
    input.country,
    subtotal,
    shippingFee,
    total,
    input.payment_method || "Credit Card",
    now,
    now
  );

  const orderId = Number(orderResult.lastInsertRowid);

  const insertItem = db.prepare(`
    INSERT INTO order_items (
      order_id, product_id, product_name, product_image, size, color, price, quantity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const decrementStock = db.prepare(`
    UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
  `);

  for (const item of input.items) {
    insertItem.run(
      orderId,
      item.productId,
      item.name,
      item.image_url,
      item.size,
      item.color,
      item.price,
      item.quantity
    );
    // Decrement stock
    decrementStock.run(item.quantity, item.productId);
  }

  return getOrderById(orderId)!;
}

export function updateOrderStatus(id: number, status: string): Order | null {
  const db = getDatabase();
  const now = new Date().toISOString();
  const stmt = db.prepare("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?");
  stmt.run(status, now, id);
  return getOrderById(id);
}

export function deleteOrder(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare("DELETE FROM orders WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

// Reset database back to seed data
export function resetDatabase() {
  const db = getDatabase();
  db.exec("DELETE FROM order_items;");
  db.exec("DELETE FROM orders;");
  db.exec("DELETE FROM products;");
  seedDatabase(db);
}
