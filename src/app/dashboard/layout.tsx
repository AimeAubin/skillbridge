import DashboardLayout from "@/components/dashboardLayout";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
