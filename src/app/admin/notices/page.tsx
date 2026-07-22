import { AdminPageShell } from "@/components/ui/admin-page-shell";

export default function AdminNoticesPage() {
  return (
    <AdminPageShell
      title="공지사항 관리"
      description="공지 목록, 작성, 수정, 노출 상태 관리를 연결할 예정입니다."
      sections={["공지 목록", "상단 고정", "발행 상태"]}
    />
  );
}
