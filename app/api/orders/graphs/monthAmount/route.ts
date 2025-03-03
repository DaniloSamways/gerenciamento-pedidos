import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Se a sessão não for válida, retorne um erro ou redirecione
    if (!session) {
      return NextResponse.redirect("/");
    }

    const userId = session.id;

    const ordersByMonth = await prisma.order.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Agrupa por mês
            totalSales: { $sum: "$orderValue" }, // Soma o valor das vendas
          },
        },
        {
          $sort: { _id: 1 }, // Ordena por mês
        },
      ],
    });

    return NextResponse.json(ordersByMonth);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
