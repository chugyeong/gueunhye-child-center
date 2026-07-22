import { AdminPageShell } from "@/components/ui/admin-page-shell";

export default function AdminNewsPage() {
  return (
    <AdminPageShell
      title="센터 소식 관리"
      description="센터 활동 사진과 소식 게시글을 관리하는 화면으로 확장합니다."
      sections={["소식 목록", "대표 이미지", "게시 예약"]}
    />
  );
}
