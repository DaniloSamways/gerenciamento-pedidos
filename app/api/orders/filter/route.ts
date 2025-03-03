import { filterOrderSchema } from "@/schemas/orderSchemas";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const userId = session.id;
    const searchParams = req.nextUrl.searchParams;

    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    if (!searchParams.toString()) {
      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        skip: (page - 1) * 10,
        take: 10,
      });
      return NextResponse.json(orders);
    }

    const term = searchParams.get("term") || undefined;

    const validateData = filterOrderSchema.safeParse({ term });

    if (!validateData.success) {
      return NextResponse.json({ error: validateData.error }, { status: 400 });
    }

    const normalizedPhone = term?.replace(/\D/g, "");

    const filters: any[] = [];

    if (validateData.data.term?.trim()) {
      // Verifica se há um termo válido
      filters.push({
        fullName: {
          contains: validateData.data.term.trim(),
          mode: "insensitive",
        },
      });
    }

    if (normalizedPhone?.trim()) {
      // Verifica se há um telefone válido
      filters.push({
        phone: {
          contains: normalizedPhone.trim(),
          mode: "insensitive",
        },
      });
    }

    const orders = await prisma.order.findMany({
      skip: (page - 1) * 10,
      take: 10,
      where: {
        userId,
        ...(filters.length > 0 ? { OR: filters } : {}), // Aplica OR apenas se houver filtros
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
