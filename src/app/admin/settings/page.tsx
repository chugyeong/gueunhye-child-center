import { AdminPageShell } from "@/components/ui/admin-page-shell";

export default function AdminSettingsPage() {
  return (
    <AdminPageShell
      title="센터 기본 정보 관리"
      description="센터명, 주소, 전화번호, 카카오톡 문의 링크, 운영 시간을 관리합니다."
      sections={["센터 정보", "연락처", "SEO 기본값"]}
    />
  );
}
