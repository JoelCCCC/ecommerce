# ThreadCraft — Next.js & SQLite Clothing Ecommerce

A modern, full-stack apparel ecommerce platform built exclusively with **Next.js** (App Router, Route Handlers, React 19, TypeScript, Tailwind CSS) for both the frontend and backend, connected to a lightweight **SQLite** database using Node.js built-in `node:sqlite`, and packaged in a production-ready **multi-stage Dockerfile** with persistent data volume support.

---

## 🌟 Highlights

- **Full-Stack Next.js**: No external backend framework required. Both user-facing storefront and backend REST API live inside Next.js App Router (`/src/app` and `/src/app/api`).
- **Lightweight SQLite Database**: Uses Node.js's native `node:sqlite` (`DatabaseSync`). Zero heavy native binary downloads, blazing fast, WAL mode enabled, with automatic table initialization and foreign-key enforcement.
- **Clothing-Focused Domain**: Includes clothing categories (T-Shirts, Hoodies & Sweats, Jackets & Outerwear, Pants & Bottoms, Accessories), apparel attributes (sizes XS–XXL, color options, gender tags: Men/Women/Unisex), stock tracking, and realistic seed data with high-res Unsplash photography.
- **Full CRUD Functionality**:
  - **Products**: Create, Read (filter/sort/search), Update (edit details & stock), and Delete garments.
  - **Orders**: Create (checkout flow), Read (order confirmation & admin list), Update (order fulfillment statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`), and Delete.
  - **Shopping Cart**: Client-side bag with size/color selection, quantity stepper, stock bounds, free shipping progress indicator, and `localStorage` persistence.
- **Interactive Admin Control Portal**: Dedicated `/admin` route with inventory management, live stock counters, order status manager, and one-click database reset/re-seed tool.
- **Production-Ready Docker**: Multi-stage standalone Next.js build with Alpine Linux, non-root user security, and persistent `./data:/app/data` volume for the SQLite database.

---

## 🚀 Quick Start with Docker (Recommended for Server Deployment)

### Option 1: Docker Compose (1 Command)

Ensure Docker and Docker Compose are installed on your server, then run:

```bash
# Clone or navigate to the repository
cd /path/to/ecommerce

# Start the container in detached mode
docker compose up -d
```

The ecommerce store will build and launch at **`http://localhost:3000`** (or your server IP: `http://YOUR_SERVER_IP:3000`).

To stop or inspect logs:
```bash
docker compose logs -f
docker compose down
```

### Option 2: Docker CLI

```bash
# Build the production image
docker build -t threadcraft-ecommerce .

# Run the container with persistent SQLite volume mounted
docker run -d \
  --name threadcraft_ecommerce \
  --restart unless-stopped \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  threadcraft-ecommerce
```

> **Data Persistence Guarantee**: The SQLite database file (`ecommerce.db`) is stored in `/app/data` inside the container and mapped to `./data` on your host. Upgrading, restarting, or rebuilding the Docker container will **never lose** your products, inventory levels, or customer orders.

---

## 💻 Local Development Setup

To run the application locally without Docker:

### Prerequisites
- Node.js `22.5.0` or newer (for native `node:sqlite`)
- npm `10+`

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Seed initial clothing catalog into SQLite
npm run db:seed

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 Page Routes & Features

| Route | Description |
|---|---|
| `/` | **Storefront**: Hero banner, category tabs, department filter (Men/Women/Unisex), live search, price/name sorters, product grid. |
| `/products/[id]` | **Product Details**: High-resolution image, size picker (S, M, L, XL), color swatch buttons, stock indicator, quantity adjuster, Add to Bag & Buy Now. |
| `/cart` | **Shopping Bag Page**: Line items breakdown, size/color tags, quantity steppers, free shipping calculator ($75 threshold). |
| `/checkout` | **Express Checkout**: Shipping address form, contact details, payment method placeholder, live order cost calculation. |
| `/orders/[id]` | **Order Confirmation**: Order number (e.g. `TC-849201`), status badge, shipment address summary, itemized receipt with images. |
| `/admin` | **Admin Control Portal**: Full CRUD management dashboard for Products & Orders with live search, stock alerts, and database controls. |

---

## 🔌 RESTful API Reference

All backend endpoints are built using Next.js Route Handlers:

### Products API (`/api/products`)

- **`GET /api/products`**
  - Query parameters:
    - `category`: Filter by category (e.g. `T-Shirts`, `Jackets & Outerwear`)
    - `gender`: Filter by department (`Men`, `Women`, `Unisex`)
    - `search`: Keyword search in title, category, description
    - `sort`: `price-asc`, `price-desc`, `name`, `newest`
    - `featured`: `true` or `false`
  - Returns: `{ success: true, count: number, products: Product[] }`

- **`POST /api/products`**
  - Creates a new clothing garment.
  - Body:
    ```json
    {
      "name": "Heavyweight Boxy Tee",
      "price": 36.00,
      "category": "T-Shirts",
      "gender": "Unisex",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "Vintage White"],
      "image_url": "https://images.unsplash.com/...",
      "stock": 25,
      "featured": true,
      "description": "280 GSM combed cotton staple."
    }
    ```

- **`GET /api/products/:id`**
  - Returns product by ID.

- **`PUT /api/products/:id`**
  - Updates an existing product (fields, stock, prices, sizes).

- **`DELETE /api/products/:id`**
  - Deletes a product from the database.

### Orders API (`/api/orders`)

- **`GET /api/orders`**
  - Query parameters: `status` (`pending`, `processing`, `shipped`, `delivered`, `cancelled`), `search`.
  - Returns all orders with line items.

- **`POST /api/orders`**
  - Creates a new customer order and automatically decrements product stock in SQLite.
  - Body:
    ```json
    {
      "customer_name": "Alex Parker",
      "customer_email": "alex@example.com",
      "shipping_address": "742 Evergreen Terrace",
      "city": "San Francisco",
      "postal_code": "94107",
      "country": "United States",
      "payment_method": "Credit Card",
      "items": [
        {
          "productId": 1,
          "name": "Heavyweight Boxy Tee",
          "image_url": "https://images.unsplash.com/...",
          "size": "L",
          "color": "Black",
          "price": 36.00,
          "quantity": 2
        }
      ]
    }
    ```

- **`GET /api/orders/:id`**
  - Fetches order details by ID.

- **`PATCH /api/orders/:id`**
  - Updates order status: `{"status": "shipped"}`.

- **`DELETE /api/orders/:id`**
  - Deletes an order from the database.

### Database Maintenance (`/api/seed`)

- **`POST /api/seed`**
  - Resets database tables and re-populates the default 12 clothing items with images.

---

## 🗄️ SQLite Database Schema

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  sizes TEXT NOT NULL,       -- JSON array: ["S", "M", "L", "XL"]
  colors TEXT NOT NULL,      -- JSON array: ["Black", "White"]
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE orders (
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

CREATE TABLE order_items (
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
```

---

## 🔒 Security & Best Practices

- **Non-Root Docker Execution**: Runs under a dedicated `nextjs:nodejs` system user (UID 1001).
- **Standalone Next.js Output**: Minimal container size (~150MB total) with only required runtime files.
- **WAL Journaling Mode**: SQLite concurrency configured with Write-Ahead Logging (`PRAGMA journal_mode = WAL`) and foreign key enforcement enabled (`PRAGMA foreign_keys = ON`).
- **Input Sanitization**: Parameterized SQLite statements via `DatabaseSync.prepare(...)` to prevent SQL injection.
