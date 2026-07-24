import { LocationCtaPanel } from "@/components/location/location-cta-panel";
import { SectionHeading } from "@/components/ui/section-heading";

export function LocationPreview() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="mb-8" data-aos="fade-up">
          <SectionHeading
            eyebrow="Location"
            title="오시는 길"
            description="지도와 길찾기 링크를 확인할 수 있습니다."
          />
        </div>
        <div data-aos="fade-up" data-aos-delay="100">
          <LocationCtaPanel />
        </div>
      </div>
    </section>
  );
}
