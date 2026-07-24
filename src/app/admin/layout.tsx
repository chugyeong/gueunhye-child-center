import { CenterInfoInitializer } from "@/components/center-info-initializer";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";
import { NoticesInitializer } from "@/components/notices-initializer";
import { TeachersInitializer } from "@/components/teachers-initializer";

export const metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminGuard>
      <CenterInfoInitializer />
      <TeachersInitializer />
      <NoticesInitializer />
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
