import { AdminPageShell } from "@/components/ui/admin-page-shell";

export default function AdminProgramsPage() {
  return (
    <AdminPageShell
      title="치료 프로그램 관리"
      description="프로그램 설명, 대상, 상담 안내 문구를 관리할 예정입니다."
      sections={["프로그램 목록", "상세 설명", "문의 연결 문구"]}
    />
  );
}
