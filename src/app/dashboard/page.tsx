import { auth } from "@/server/auth";

export default async function Dashboard() {
  const session = await auth();
  return <>{session && <span>{session.user.name}</span>}</>;
}
