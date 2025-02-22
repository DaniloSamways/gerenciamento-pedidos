import { filterOrderSchema } from "@/schemas/orderSchemas";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const searchParams = req.nextUrl.searchParams;

    if (!searchParams.toString()) {
      const orders = await prisma.order.findMany();
      return NextResponse.json(orders);
    }

    const term = searchParams.get("term") || undefined;

    const validateData = filterOrderSchema.safeParse({ term });

    if (!validateData.success) {
      return NextResponse.json({ error: validateData.error }, { status: 400 });
    }

    const normalizedPhone = term?.replace(/\D/g, "");

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: validateData.data.term,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: normalizedPhone,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
