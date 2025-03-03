import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Graphs from "./pageClient";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/");
  }

  return <Graphs />;
}
