import { centerInfo } from "@/data/center";
import { StaticPageLayout } from "@/components/ui/static-page-layout";

export const metadata = {
  title: "센터 소식",
  description: "구은혜아동발달센터 소식 안내",
};

export default function NewsPage() {
  return (
    <StaticPageLayout
      eyebrow="News"
      title="센터 소식"
      description="센터 소식 게시판은 관리자 기능 구현 후 실제 게시글로 연결합니다."
      items={[
        {
          title: "문의 안내",
          description: `${centerInfo.phone.display} / ${centerInfo.mobile.display}`,
        },
      ]}
    />
  );
}
