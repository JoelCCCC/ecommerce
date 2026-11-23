"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  X,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  Database,
  Eye,
  Home,
} from "lucide-react";
import { Product, Order, OrderStatus, CreateProductInput } from "@/lib/types";
import { CATEGORIES, GENDERS } from "@/lib/seed-data";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "database">("products");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filters
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Product Modal State (Create / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<CreateProductInput>({
    name: "",
    description: "",
    price: 39.99,
    category: "T-Shirts",
    gender: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    featured: false,
  });

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrd] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      const dataProd = await resProd.json();
      const dataOrd = await resOrd.json();

      if (dataProd.success) setProducts(dataProd.products);
      if (dataOrd.success) setOrders(dataOrd.orders);
    } catch (e) {
      console.error("Error loading admin data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- PRODUCT CRUD ----------------

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: 45.0,
      category: "T-Shirts",
      gender: "Unisex",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Heather Grey", "White"],
      image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      stock: 20,
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      gender: prod.gender,
      sizes: prod.sizes,
      colors: prod.colors,
      image_url: prod.image_url,
      stock: prod.stock,
      featured: prod.featured,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // UPDATE
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          showNotification(`Updated garment "${data.product.name}" successfully!`);
          setIsProductModalOpen(false);
        }
      } else {
        // CREATE
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          showNotification(`Created new garment "${data.product.name}"!`);
          setIsProductModalOpen(false);
        }
      }
    } catch (e) {
      console.error("Save product error", e);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification(`Garment "${name}" was deleted.`);
      }
    } catch (e) {
      console.error("Delete product error", e);
    }
  };

  // ---------------- ORDER CRUD ----------------

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as OrderStatus } : o))
        );
        showNotification(`Order status updated to "${status}".`);
      }
    } catch (e) {
      console.error("Update order status error", e);
    }
  };

  const handleDeleteOrder = async (orderId: number, orderNum: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderNum}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showNotification(`Order ${orderNum} was deleted.`);
      }
    } catch (e) {
      console.error("Delete order error", e);
    }
  };

  // ---------------- DATABASE RESET ----------------

  const handleResetDatabase = async () => {
    if (!confirm("Reset database to initial clothing catalog? Existing orders will be cleared.")) return;
    try {
      setLoading(true);
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showNotification("Database reset to demo clothes catalog successfully!");
        await loadData();
      }
    } catch (e) {
      console.error("Reset db error", e);
    } finally {
      setLoading(false);
    }
  };

  // Calculations for stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total : 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  // Filtered views
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-800 text-xs font-semibold animate-slide-up">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900">Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
            Ecommerce Management Hub
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateProduct}
            className="px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-950">${totalRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-gray-400 mt-1">From completed orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Orders</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-950">{orders.length}</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">
            {pendingOrdersCount} pending fulfillment
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Garment Catalog</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-950">{products.length}</div>
          <p className="text-[11px] text-gray-400 mt-1">Active items in stock</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Low Stock Alert</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{lowStockCount}</div>
          <p className="text-[11px] text-gray-400 mt-1">&le; 5 units remaining</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-gray-950 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-950 hover:bg-gray-100"
          }`}
        >
          Garments & Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-gray-950 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-950 hover:bg-gray-100"
          }`}
        >
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "database"
              ? "bg-gray-950 text-white shadow-xs"
              : "text-gray-600 hover:text-gray-950 hover:bg-gray-100"
          }`}
        >
          SQLite & System
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE (CRUD) */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="text-xs text-gray-500 self-center">
              Showing {filteredProducts.length} of {products.length} garments
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{p.name}</span>
                            <span className="text-[11px] text-gray-400">
                              Sizes: {p.sizes.join(", ")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">{p.category}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                          {p.gender}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-gray-950">${p.price.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            p.stock <= 0
                              ? "bg-rose-100 text-rose-700"
                              : p.stock <= 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.featured ? (
                          <span className="text-indigo-600 font-bold">Yes ★</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Garment"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Garment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/products/${p.id}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                            title="View on store"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS TABLE (CRUD) */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by number or customer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Filter status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status (Click to Change)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        No orders recorded matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {ord.order_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-900 block">{ord.customer_name}</span>
                          <span className="text-[11px] text-gray-400">{ord.customer_email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-medium">
                          {ord.items?.length || 0} items
                        </td>
                        <td className="py-3.5 px-4 font-black text-gray-950">${ord.total.toFixed(2)}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none ${
                              ord.status === "delivered"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : ord.status === "shipped"
                                ? "bg-indigo-50 text-indigo-800 border-indigo-300"
                                : ord.status === "processing"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : ord.status === "cancelled"
                                ? "bg-rose-50 text-rose-800 border-rose-300"
                                : "bg-blue-50 text-blue-800 border-blue-300"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(ord.id, ord.order_number)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SQLITE & SYSTEM DIAGNOSTICS */}
      {activeTab === "database" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-950">SQLite Database Diagnostics</h2>
              <p className="text-xs text-gray-500">
                Lightweight, embedded database powered by Node.js built-in `node:sqlite`.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="font-bold uppercase tracking-wider text-gray-400 block">Database Details</span>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Engine</span>
                <span className="font-semibold text-gray-900">node:sqlite (Node.js 22+ built-in)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Storage Location</span>
                <span className="font-mono text-gray-900 text-[11px]">./data/ecommerce.db</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Journal Mode</span>
                <span className="font-semibold text-emerald-600">WAL (Write-Ahead Logging)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Docker Volume</span>
                <span className="font-mono text-gray-900 text-[11px]">/app/data</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="font-bold uppercase tracking-wider text-gray-400 block">Schema Counts</span>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Garment Items Table</span>
                <span className="font-bold text-gray-900">{products.length} records</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Orders Table</span>
                <span className="font-bold text-gray-900">{orders.length} records</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Order Items Table</span>
                <span className="font-bold text-gray-900">
                  {orders.reduce((acc, o) => acc + (o.items?.length || 0), 0)} line records
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-950">Reset to Sample Catalog</h4>
              <p className="text-xs text-gray-500">
                Resets the database and restores the 12 default stylish clothing garments.
              </p>
            </div>
            <button
              onClick={handleResetDatabase}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              Reset Database & Re-seed
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-950">
                {editingProduct ? "Edit Clothing Item" : "Add New Garment to Catalog"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Heavyweight Boxy Tee"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Department</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm({ ...productForm, gender: e.target.value as "Men" | "Women" | "Unisex" })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-indigo-600"
                />
                <div className="flex gap-2 mt-1.5 overflow-x-auto text-[10px] text-indigo-600">
                  <span className="text-gray-400">Sample photos:</span>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800" })}
                    className="underline hover:text-indigo-800"
                  >
                    T-Shirt
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800" })}
                    className="underline hover:text-indigo-800"
                  >
                    Hoodie
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800" })}
                    className="underline hover:text-indigo-800"
                  >
                    Denim
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800" })}
                    className="underline hover:text-indigo-800"
                  >
                    Pants
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.sizes.join(", ")}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="S, M, L, XL"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Colors (comma-separated)</label>
                <input
                  type="text"
                  value={productForm.colors.join(", ")}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Black, Washed Olive, Cream"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-indigo-600"
                  placeholder="Apparel fabric, GSM weight, tailoring details..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="font-semibold text-gray-800 cursor-pointer">
                  Highlight as Featured Garment on homepage
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gray-950 hover:bg-indigo-600 text-white font-bold transition-colors shadow-sm"
                >
                  {editingProduct ? "Save Changes" : "Create Garment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-950">
                  Order #{selectedOrder.order_number}
                </h3>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-1">Customer & Shipping</h4>
                <p className="font-semibold text-gray-950">{selectedOrder.customer_name}</p>
                <p className="text-gray-500">{selectedOrder.customer_email}</p>
                <p className="text-gray-700 mt-1">
                  {selectedOrder.shipping_address}, {selectedOrder.city}, {selectedOrder.postal_code}, {selectedOrder.country}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Garments in Order</h4>
                <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 block">{item.product_name}</span>
                        <span className="text-[11px] text-gray-500">
                          {item.size} • {item.color} • Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-gray-950">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>${selectedOrder.shipping_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-950 pt-1 border-t border-gray-100">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block font-bold text-gray-800 mb-1">Change Order Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleUpdateOrderStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value as OrderStatus });
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
