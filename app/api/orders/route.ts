import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createOrderSchema } from "@/schemas/orderSchemas";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const data = await req.json();

    const validateData = createOrderSchema.safeParse({
      ...data,
      orderValue: String(data.orderValue),
      deliveryDate: new Date(data.deliveryDate),
    });

    if (!validateData.success) {
      return NextResponse.json({ error: validateData.error }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: data,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const orders = await prisma.order.findMany({});

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
