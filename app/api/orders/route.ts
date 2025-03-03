import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createOrderSchema } from "../schemas/orderSchemas";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const data = await req.json();
    const userId = session.id;

    const validateData = createOrderSchema.safeParse({
      ...data,
      orderValue: data.orderValue,
      deliveryDate: new Date(data.deliveryDate),
    });

    if (!validateData.success) {
      return NextResponse.json({ error: validateData.error }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: { ...validateData.data, userId },
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

    const userId = session.id;

    const page = req.url.includes("?page=")
      ? Number(req.url.split("?page=")[1])
      : 1;

    const orders = await prisma.order.findMany({
      skip: (page - 1) * 10,
      take: 10,
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
