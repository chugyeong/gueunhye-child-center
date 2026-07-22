import { AdminPageShell } from "@/components/ui/admin-page-shell";

export default function AdminPage() {
  return (
    <AdminPageShell
      title="관리자 대시보드"
      description="공지사항, 센터 소식, 선생님, 치료 프로그램, 센터 정보를 관리할 예정입니다."
      sections={[
        "최근 공지 요약",
        "센터 소식 발행 상태",
        "프로그램 노출 순서",
        "기본 연락처 점검",
      ]}
    />
  );
}
