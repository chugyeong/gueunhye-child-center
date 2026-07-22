import { LocationCtaPanel } from "@/components/location/location-cta-panel";
import { SectionHeading } from "@/components/ui/section-heading";

export function LocationPreview() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="mb-10" data-aos="fade-up">
          <SectionHeading
            eyebrow="Location"
            title="오시는 길"
            description="카카오 지도에서 위치를 확인하고 길찾기를 바로 시작할 수 있습니다."
          />
        </div>
        <div data-aos="fade-up" data-aos-delay="100">
          <LocationCtaPanel />
        </div>
      </div>
    </section>
  );
}
