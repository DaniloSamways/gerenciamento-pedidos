import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NovoPedido } from "./pageClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  return <NovoPedido />;
}
