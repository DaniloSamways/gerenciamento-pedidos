import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { EditarPedido } from "./pageClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProtectedPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  return <EditarPedido params={params} />;
}
