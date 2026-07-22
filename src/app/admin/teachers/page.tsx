import { AdminPageShell } from "@/components/ui/admin-page-shell";

export default function AdminTeachersPage() {
  return (
    <AdminPageShell
      title="선생님 소개 관리"
      description="선생님 프로필, 전문 분야, 노출 순서를 관리할 예정입니다."
      sections={["프로필 목록", "전문 분야", "노출 순서"]}
    />
  );
}
