export type Program = {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
};

export type PhoneContact = {
  display: string;
  href: string;
};

export type Teacher = {
  id: string;
  name: string;
  role: string;
  group: "언어재활사" | "작업치료사" | "운영진";
  profileImage?: string;
  career?: string[];
  shortBio?: string;
};

export const centerInfo = {
  name: "구은혜아동발달센터",
  englishName: "Child Development Center",
  tagline: "아이의 발달과 일상 적응을 함께 돕는 전문 아동발달센터",
  description:
    "구은혜아동발달센터는 언어, 구강운동, 작업인지, 시지각, 연하재활, 사회성 프로그램을 통해 아이에게 필요한 발달 지원을 제공합니다.",
  phone: {
    display: "041-574-9975",
    href: "tel:0415749975",
  },
  mobile: {
    display: "010-7419-9975",
    href: "tel:01074199975",
  },
  kakao: "카카오 오픈채팅",
  kakaoUrl: "https://open.kakao.com/o/sD5otLmg",
  address: "충남 천안시 서북구 충무로 155 2층 구은혜아동발달센터",
  representative: null,
  businessRegistrationNumber: null,
  coordinate: {
    lat: 36.7948,
    lng: 127.1218,
  },
  hours: ["월-금 9:30~20:30", "토 9:30~19:00"],
  logo: "/images/logo.png",
} as const;

export const centerMapLinks = {
  view: `https://map.kakao.com/link/search/${encodeURIComponent(centerInfo.address)}`,
  directions: `https://map.kakao.com/link/to/${encodeURIComponent(
    centerInfo.name,
  )},${centerInfo.coordinate.lat},${centerInfo.coordinate.lng}`,
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

export const programs: Program[] = [
  {
    id: "language-therapy",
    title: "언어치료",
    description: "표현 및 수용 언어 지연, 의사소통 기능 및 발음 개선을 위한 맞춤 치료",
    tag: "Language",
    image: "/images/center/IMG_0108.JPG",
  },
  {
    id: "nonverbal-language",
    title: "무발화 핸들링 언어치료",
    description: "소리와 말 표현이 어려운 무발화 아동을 위한 기초 발화 유도 및 다감각 언어 자극",
    tag: "Speech",
    image: "/images/center/IMG_0094.JPG",
  },
  {
    id: "oral-motor",
    title: "구강운동치료",
    description: "구강 근육 강화 및 오조율 개선을 통한 정확한 발음과 표현 능력 향상",
    tag: "Oral Motor",
    image: "/images/center/IMG_0102.JPG",
  },
  {
    id: "cognitive-visual",
    title: "작업인지 및 시지각",
    description: "시지각 협응, 공간 지각, 주의집중력 및 인지적 작업 수행 능력 향상",
    tag: "Cognition",
    image: "/images/center/IMG_0106.JPG",
  },
  {
    id: "feeding-rehabilitation",
    title: "연하재활치료",
    description: "섭식 및 삼킴 장애 아동을 위한 안전하고 원활한 구강 섭식 기능 재활",
    tag: "Feeding",
    image: "/images/center/IMG_0099.JPG",
  },
  {
    id: "social-group",
    title: "사회성 그룹 및 짝수업",
    description: "또래와의 상호작용, 또래 관계 형성, 규칙 준수 및 사회적 기술 습득",
    tag: "Social",
    image: "/images/center/IMG_0111.JPG",
  },
  {
    id: "floor-time",
    title: "플로어타임",
    description: "아동 주도의 자발적 상호작용 및 정서, 인지 발달을 돕는 주도적 놀이치료",
    tag: "Floor Time",
    image: "/images/center/IMG_0107.JPG",
  },
  {
    id: "school-ready",
    title: "학교대비반",
    description: "취학 전 아동을 위한 그룹 적응, 사회성, 기초 인지 및 자율성 향상 프로그램",
    tag: "School Ready",
    image: "/images/center/IMG_0109.JPG",
  },
];

export const teachers: Teacher[] = [
  {
    id: "guhyun",
    name: "구은혜",
    role: "언어재활사 센터장",
    group: "언어재활사",
    shortBio: "센터 운영과 언어재활을 총괄합니다.",
  },
  {
    id: "jangsuyeon",
    name: "장수연",
    role: "언어재활사",
    group: "언어재활사",
    shortBio: "표현·수용 언어 발달 지원을 담당합니다.",
  },
  {
    id: "bang-eunyoung",
    name: "방은영",
    role: "언어재활사",
    group: "언어재활사",
    shortBio: "발음과 의사소통 기능을 함께 지도합니다.",
  },
  {
    id: "songsoomin",
    name: "송수민",
    role: "언어재활사",
    group: "언어재활사",
    shortBio: "언어 자극과 일상 의사소통을 돕습니다.",
  },
  {
    id: "hanjayeong",
    name: "한자영",
    role: "작업치료사",
    group: "작업치료사",
    shortBio: "작업 수행과 일상생활 적응을 지원합니다.",
  },
  {
    id: "kimseongmo",
    name: "김성모",
    role: "작업치료사",
    group: "작업치료사",
    shortBio: "감각 통합과 인지 활동을 지도합니다.",
  },
  {
    id: "ansonghyeon",
    name: "안송현",
    role: "작업치료사",
    group: "작업치료사",
    shortBio: "손 기능과 학습 준비를 함께 돕습니다.",
  },
  {
    id: "ohserong",
    name: "오세롱",
    role: "작업치료사",
    group: "작업치료사",
    shortBio: "신체 조절과 문제 해결 능력을 지원합니다.",
  },
  {
    id: "kimyejin",
    name: "김예진",
    role: "작업치료사",
    group: "작업치료사",
    shortBio: "사회성 및 일상 루틴형 프로그램을 안내합니다.",
  },
  {
    id: "sonchansong",
    name: "손찬송",
    role: "작업치료사",
    group: "작업치료사",
    shortBio: "정서와 행동 지원을 위한 치료를 진행합니다.",
  },
  {
    id: "songjoohee",
    name: "송주희",
    role: "사무장",
    group: "운영진",
    shortBio: "센터 운영과 상담 안내를 담당합니다.",
  },
  {
    id: "kimyoungju",
    name: "김영주",
    role: "팀장",
    group: "운영진",
    shortBio: "프로그램 운영과 팀 협업을 지원합니다.",
  },
];
