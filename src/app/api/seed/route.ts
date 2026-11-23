import { NextResponse } from "next/server";
import { resetDatabase, getAllProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    resetDatabase();
    const products = getAllProducts();
    return NextResponse.json({
      success: true,
      message: "Database reset and seeded with apparel catalog successfully.",
      count: products.length,
    });
  } catch (error) {
    console.error("Failed to seed database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
