import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db";
import { CreateProductInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const featuredParam = searchParams.get("featured");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const featured = featuredParam !== null ? featuredParam === "true" : undefined;
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    const products = getAllProducts({
      category,
      gender,
      search,
      sort,
      featured,
      minPrice,
      maxPrice,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateProductInput;

    if (!body.name || !body.price || !body.category || !body.image_url) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, price, category, image_url)" },
        { status: 400 }
      );
    }

    const product = createProduct({
      name: body.name.trim(),
      slug: body.slug,
      description: body.description || "",
      price: Number(body.price),
      category: body.category,
      gender: body.gender || "Unisex",
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : ["S", "M", "L", "XL"],
      colors: Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : ["Standard"],
      image_url: body.image_url.trim(),
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
