import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
