import { CenterInfoInitializer } from "@/components/center-info-initializer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NoticesInitializer } from "@/components/notices-initializer";
import { TeachersInitializer } from "@/components/teachers-initializer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <CenterInfoInitializer />
      <TeachersInitializer />
      <NoticesInitializer />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
