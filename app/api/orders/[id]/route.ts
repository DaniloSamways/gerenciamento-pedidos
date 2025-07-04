import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import {
  getOrderByIdSchema,
  updateOrderSchema,
} from "../../schemas/orderSchemas";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const orderId = params.id as string;
    const userId = session.id;

    const validateData = getOrderByIdSchema.safeParse({ id: orderId });

    if (!validateData.success) {
      return NextResponse.json({ error: validateData.error }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        id: orderId,
        userId,
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Se a sessão não for válida, retorne um erro ou redirecione
  if (!session) {
    return NextResponse.redirect("/");
  }

  const data = await req.json();
  const orderId = params.id as string;
  const userId = session.id;

  const validateData = updateOrderSchema.safeParse({ data, orderId });

  if (!validateData.success) {
    return NextResponse.json({ error: validateData.error }, { status: 400 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...validateData.data,
      userId,
    },
  });

  return NextResponse.json(updatedOrder);
}
