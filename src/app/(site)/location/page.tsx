import { LocationCtaPanel } from "@/components/location/location-cta-panel";

export const metadata = {
  title: "오시는 길",
  description: "구은혜아동발달센터 위치와 연락처 안내",
};

export default function LocationPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Location</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
            오시는 길
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            카카오 지도와 연락처를 확인하고 방문 전 상담 문의를 남겨주세요.
          </p>
        </div>
        <div className="mt-10" data-aos="fade-up" data-aos-delay="100">
          <LocationCtaPanel variant="page" />
        </div>
      </div>
    </section>
  );
}
