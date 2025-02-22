import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getOrderByIdSchema, updateOrderSchema } from "@/services/orderSchemas";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id as string;

    const validateData = getOrderByIdSchema.safeParse({ id: orderId });

    if (!validateData.success) {
      return NextResponse.json({ error: validateData.error }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: {
        id: orderId,
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
  const data = await req.json();
  const orderId = params.id as string;

  const validateData = updateOrderSchema.safeParse({ data, orderId });

  if (!validateData.success) {
    return NextResponse.json({ error: validateData.error }, { status: 400 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: data,
  });

  return NextResponse.json(updatedOrder);
}
