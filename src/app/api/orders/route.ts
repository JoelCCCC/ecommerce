import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, createOrder } from "@/lib/db";
import { CreateOrderInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const orders = getAllOrders({ status, search });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderInput;

    if (
      !body.customer_name ||
      !body.customer_email ||
      !body.shipping_address ||
      !body.city ||
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required order information or empty cart" },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
