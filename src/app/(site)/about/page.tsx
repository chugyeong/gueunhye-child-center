import Image from "next/image";
import { centerImages, centerInfo } from "@/data/center";

export const metadata = {
  title: "센터 소개",
  description: "구은혜아동발달센터 소개",
};

const introItems = [
  "아이들의 성장을 함께하는 따뜻한 공간",
  "언어재활사와 작업치료사가 함께하는 전문 치료",
  "보호자와 함께 방향을 세우는 치료 과정",
  "아이에게 필요한 맞춤형 치료 프로그램",
];

export default function AboutPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">About</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
            {centerInfo.name}
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            아이의 발달과 일상 적응을 세심하게 살피며,
            <br />
            보호자와 함께 치료의 방향을 만들어가는 아동발달센터입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div data-aos="fade-up" data-aos-delay="80">
            <h2 className="text-3xl font-bold leading-tight text-stone-950">
              아이에게 필요한 도움을 차분하게 연결합니다.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-stone-600">
              <p>
                구은혜아동발달센터는 언어, 구강운동, 작업인지, 시지각, 연하재활, 사회성 프로그램을
                통해 아이에게 필요한 발달 지원을 제공합니다.
              </p>
              <p>
                전문 치료사가 아이의 현재 모습을 관찰하고, 보호자와 함께 일상에서 이어갈 수 있는
                치료 방향을 세워갑니다.
              </p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {introItems.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-semibold leading-6 text-stone-800">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="140"
            className="grid gap-4 sm:grid-cols-[1fr_0.82fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={centerImages.reception}
                alt="구은혜아동발달센터 안내 데스크"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority
              />
            </div>
            <div className="grid gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <Image
                  src={centerImages.classroom}
                  alt="구은혜아동발달센터 치료실"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 24vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <Image
                  src={centerImages.sensoryRoom}
                  alt="구은혜아동발달센터 활동 공간"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 24vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          data-aos="fade-up"
          className="mt-12 grid gap-4 rounded-lg border border-stone-200 bg-stone-50 p-5 md:grid-cols-3 md:p-6">
          <InfoBlock title="주소" description={centerInfo.address} />
          <InfoBlock
            title="대표 프로그램"
            description="언어치료, 작업인지 및 시지각, 연하재활치료, 사회성 그룹"
          />
          <InfoBlock
            title="문의"
            description={`${centerInfo.phone.display} / ${centerInfo.mobile.display}`}
          />
        </div>
      </div>
    </section>
  );
}

type InfoBlockProps = {
  title: string;
  description: string;
};

function InfoBlock({ title, description }: InfoBlockProps) {
  return (
    <div>
      <h2 className="text-sm font-bold text-teal-700">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-700">{description}</p>
    </div>
  );
}
