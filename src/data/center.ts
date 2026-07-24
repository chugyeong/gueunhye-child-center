export type Program = {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  imageAlt?: string;
};

export type PhoneContact = {
  display: string;
  href: string;
};

export const centerStaticInfo = {
  englishName: "Child Development Center",
  tagline: "아이의 발달과 일상 적응을 함께 돕는 전문 아동발달센터",
  kakaoUrl: "https://open.kakao.com/o/sD5otLmg",
  instagramUrl: "https://www.instagram.com/kooeunhye_development_center?igsh=cWM4MjhhbGkyY3lr",
  coordinate: {
    lat: 36.7948,
    lng: 127.1218,
  },
  logo: "/images/logo.png",
} as const;

export const centerImages = {
  hero: "/images/center/IMG_0098.JPG",
  reception: "/images/center/IMG_0103.JPG",
  lounge: "/images/center/IMG_0104.JPG",
  hallway: "/images/center/IMG_0097.JPG",
  classroom: "/images/center/IMG_0106.JPG",
  sensoryRoom: "/images/center/IMG_0107.JPG",
  gym: "/images/center/IMG_0109.JPG",
  building: "/images/center/IMG_0110.JPG",
} as const;

export const programImages = {
  languageTherapy: "/images/center/IMG_0108.JPG",
  nonverbalLanguage: "/images/center/IMG_0094.JPG",
  oralMotor: "/images/center/IMG_0102.JPG",
  cognitiveVisual: "/images/center/IMG_0106.JPG",
  feedingRehabilitation: "/images/center/IMG_0099.JPG",
  socialGroup: "/images/center/IMG_0111.JPG",
  floorTime: "/images/center/IMG_0107.JPG",
  schoolReady: "/images/center/IMG_0109.JPG",
} as const;

export const programs: Program[] = [
  {
    id: "nonverbal-language",
    title: "무발화 언어치료",
    description: "소리와 말 표현이 어려운 아동을 위한 기초 발화 및 언어 자극",
    tag: "Core Speech",
    image: programImages.nonverbalLanguage,
    imageAlt: "무발화 언어치료 임시 이미지",
  },
  {
    id: "language-therapy",
    title: "언어치료",
    description: "표현 및 수용 언어 지연, 의사소통 기능 및 발음 개선을 위한 맞춤 치료",
    tag: "Language",
    image: programImages.languageTherapy,
    imageAlt: "언어치료 임시 이미지",
  },
  {
    id: "oral-motor",
    title: "구강운동치료",
    description: "구강 근육 강화 및 오조율 개선을 통한 정확한 발음과 표현 능력 향상",
    tag: "Oral Motor",
    image: programImages.oralMotor,
    imageAlt: "구강운동치료 임시 이미지",
  },
  {
    id: "cognitive-visual",
    title: "작업인지 및 시지각",
    description: "시지각 협응, 공간 지각, 주의집중력 및 인지적 작업 수행 능력 향상",
    tag: "Cognition",
    image: programImages.cognitiveVisual,
    imageAlt: "작업인지 및 시지각 임시 이미지",
  },
  {
    id: "feeding-rehabilitation",
    title: "연하재활치료",
    description: "섭식 및 삼킴 장애 아동을 위한 안전하고 원활한 구강 섭식 기능 재활",
    tag: "Feeding",
    image: programImages.feedingRehabilitation,
    imageAlt: "연하재활치료 임시 이미지",
  },
  {
    id: "social-group",
    title: "사회성 그룹 및 짝수업",
    description: "또래와의 상호작용, 또래 관계 형성, 규칙 준수 및 사회적 기술 습득",
    tag: "Social",
    image: programImages.socialGroup,
    imageAlt: "사회성 그룹 및 짝수업 임시 이미지",
  },
  {
    id: "floor-time",
    title: "플로어타임",
    description: "아동 주도의 자발적 상호작용 및 정서, 인지 발달을 돕는 주도적 놀이치료",
    tag: "Floor Time",
    image: programImages.floorTime,
    imageAlt: "플로어타임 임시 이미지",
  },
  {
    id: "school-ready",
    title: "학교대비반",
    description: "취학 전 아동을 위한 그룹 적응, 사회성, 기초 인지 및 자율성 향상 프로그램",
    tag: "School Ready",
    image: programImages.schoolReady,
    imageAlt: "학교대비반 임시 이미지",
  },
];
