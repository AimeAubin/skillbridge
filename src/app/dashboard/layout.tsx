import DashboardLayout from "@/components/dashboardLayout";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const session = await auth();

    if (!session) {
      return redirect("/auth/login");
    }

    return <DashboardLayout>{children}</DashboardLayout>;
  } catch (error) {
    return redirect("/auth/login");
  }
}
