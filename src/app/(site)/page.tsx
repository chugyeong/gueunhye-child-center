import { HeroSection } from "@/components/home/hero-section";
import { HomeIntro } from "@/components/home/home-intro";
import { LocationPreview } from "@/components/home/location-preview";
import { NewsPreview } from "@/components/home/news-preview";
import { ProgramPreview } from "@/components/home/program-preview";
import { TeacherPreview } from "@/components/home/teacher-preview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeIntro />
      <ProgramPreview />
      <TeacherPreview />
      <NewsPreview />
      <LocationPreview />
    </>
  );
}
