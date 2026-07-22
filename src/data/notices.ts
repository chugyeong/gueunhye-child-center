export type NoticeAttachment = {
  id: string;
  name: string;
  url?: string;
  size?: number;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  attachments?: NoticeAttachment[];
};

// Temporary notice data used until Supabase notice CRUD is connected.
export const notices: Notice[] = [
  {
    id: "notice-20260722-01",
    title: "상담 문의는 전화 또는 카카오 오픈채팅으로 부탁드립니다.",
    content:
      "초기 상담은 전화 문의 또는 카카오 오픈채팅으로 가능합니다.\n아이의 현재 상황과 상담 가능한 시간을 남겨주시면 확인 후 안내드리겠습니다.",
    createdAt: "2026.07.22",
    isPinned: true,
  },
  {
    id: "notice-20260722-02",
    title: "공지사항 게시판은 준비 중입니다.",
    content:
      "현재 홈페이지 공지사항 게시판은 정식 운영 전 점검 중입니다.\n운영 일정, 프로그램 모집, 휴무 안내 등 센터 공지는 이 게시판을 통해 안내될 예정입니다.",
    createdAt: "2026.07.22",
    isPinned: true,
  },
  {
    id: "notice-20260715-01",
    title: "8월 센터 휴무 일정 안내",
    content:
      "8월 센터 내부 교육 일정으로 일부 날짜에 휴무가 예정되어 있습니다.\n방문 전 상담 가능 시간을 전화로 확인해 주세요.",
    createdAt: "2026.07.15",
    isPinned: true,
    attachments: [
      {
        id: "att-20260715-01",
        name: "8월_운영일정_안내.pdf",
        size: 245760,
      },
    ],
  },
  {
    id: "notice-20260710-01",
    title: "여름방학 학교대비반 모집 안내",
    content:
      "취학 전 아동을 위한 학교대비반 모집을 준비하고 있습니다.\n그룹 적응, 사회성, 기초 인지 및 자율성 향상 프로그램으로 구성됩니다.",
    createdAt: "2026.07.10",
    isPinned: false,
  },
  {
    id: "notice-20260705-01",
    title: "사회성 그룹 및 짝수업 문의 안내",
    content:
      "또래 상호작용과 규칙 준수를 연습하는 사회성 그룹 및 짝수업 문의를 받고 있습니다.\n참여 가능 여부는 초기 상담 후 안내드립니다.",
    createdAt: "2026.07.05",
    isPinned: false,
  },
  {
    id: "notice-20260628-01",
    title: "운영시간 변경 사전 안내",
    content:
      "센터 운영시간이 프로그램 일정에 따라 일부 조정될 수 있습니다.\n확정된 변경 일정은 공지사항을 통해 다시 안내드리겠습니다.",
    createdAt: "2026.06.28",
    updatedAt: "2026.06.29",
    isPinned: false,
  },
  {
    id: "notice-20260620-01",
    title: "연하재활치료 상담 안내",
    content:
      "섭식 및 삼킴 관련 어려움이 있는 아동을 위한 연하재활치료 상담을 진행합니다.\n상담 전 현재 식사 양상과 어려운 상황을 함께 알려주세요.",
    createdAt: "2026.06.20",
    isPinned: false,
  },
  {
    id: "notice-20260612-01",
    title: "구강운동치료 프로그램 안내",
    content:
      "구강 근육 강화와 오조율 개선을 돕는 구강운동치료 프로그램을 안내드립니다.\n정확한 발음과 표현 능력 향상을 목표로 상담 후 진행됩니다.",
    createdAt: "2026.06.12",
    isPinned: false,
  },
  {
    id: "notice-20260601-01",
    title: "6월 프로그램 일정 안내",
    content:
      "6월 치료 프로그램 일정은 담당 선생님과 상담 후 확정됩니다.\n변경이 필요한 경우 센터로 미리 연락해 주세요.",
    createdAt: "2026.06.01",
    isPinned: false,
  },
  {
    id: "notice-20260525-01",
    title: "신규 언어치료 상담 접수 안내",
    content:
      "표현 및 수용 언어 지연, 의사소통 기능, 발음 개선 관련 상담 접수를 받고 있습니다.\n상담 가능 일정은 전화 문의로 확인하실 수 있습니다.",
    createdAt: "2026.05.25",
    isPinned: false,
  },
  {
    id: "notice-20260518-01",
    title: "센터 방문 전 확인 사항",
    content:
      "센터 방문 전 예약 시간과 위치를 다시 확인해 주세요.\n주소는 충남 천안시 서북구 충무로 155 2층입니다.",
    createdAt: "2026.05.18",
    isPinned: false,
  },
  {
    id: "notice-20260510-01",
    title: "어린이날 연휴 운영 안내",
    content:
      "어린이날 연휴 기간에는 일부 프로그램 운영 시간이 달라질 수 있습니다.\n개별 일정은 담당 선생님 또는 센터로 문의해 주세요.",
    createdAt: "2026.05.10",
    isPinned: false,
  },
  {
    id: "notice-20260428-01",
    title: "플로어타임 프로그램 상담 안내",
    content:
      "아동 주도의 자발적 상호작용을 돕는 플로어타임 프로그램 상담을 안내드립니다.\n프로그램 진행 여부는 상담 후 결정됩니다.",
    createdAt: "2026.04.28",
    isPinned: false,
  },
  {
    id: "notice-20260420-01",
    title: "작업인지 및 시지각 프로그램 안내",
    content:
      "시지각 협응, 공간 지각, 주의집중력 향상을 돕는 작업인지 및 시지각 프로그램을 운영합니다.\n상담 시 현재 수행 수준을 함께 살펴봅니다.",
    createdAt: "2026.04.20",
    isPinned: false,
  },
  {
    id: "notice-20260412-01",
    title: "센터 내부 환경 점검 안내",
    content:
      "쾌적한 치료 환경을 위해 센터 내부 환경 점검을 진행합니다.\n점검 시간에는 전화 응대가 지연될 수 있습니다.",
    createdAt: "2026.04.12",
    isPinned: false,
  },
  {
    id: "notice-20260401-01",
    title: "4월 상담 가능 시간 안내",
    content:
      "4월 상담 가능 시간은 프로그램 운영 일정에 따라 순차적으로 안내됩니다.\n문의 시 희망 요일과 시간을 함께 남겨주세요.",
    createdAt: "2026.04.01",
    isPinned: false,
  },
  {
    id: "notice-20260325-01",
    title: "선생님 일정 변경 안내",
    content:
      "일부 선생님의 프로그램 일정이 조정되었습니다.\n해당 보호자분들께는 개별 연락으로 자세히 안내드리겠습니다.",
    createdAt: "2026.03.25",
    isPinned: false,
  },
  {
    id: "notice-20260318-01",
    title: "무발화 핸들링 언어치료 문의 안내",
    content:
      "소리와 말 표현이 어려운 아동을 위한 무발화 핸들링 언어치료 문의를 받고 있습니다.\n초기 상담에서 현재 표현 방식과 반응을 함께 확인합니다.",
    createdAt: "2026.03.18",
    isPinned: false,
  },
  {
    id: "notice-20260310-01",
    title: "새 학기 프로그램 일정 안내",
    content:
      "새 학기 일정에 맞춰 일부 프로그램 시간이 변경될 수 있습니다.\n등원 일정과 치료 시간을 함께 조율해 주세요.",
    createdAt: "2026.03.10",
    isPinned: false,
  },
  {
    id: "notice-20260301-01",
    title: "삼일절 휴무 안내",
    content:
      "삼일절에는 센터 운영을 쉬어갑니다.\n휴무 기간 중 남겨주신 문의는 다음 운영일에 순차적으로 답변드리겠습니다.",
    createdAt: "2026.03.01",
    isPinned: false,
  },
  {
    id: "notice-20260222-01",
    title: "취학 전 학교대비반 상담 안내",
    content:
      "취학 전 아동의 그룹 적응과 기초 인지 준비를 위한 학교대비반 상담을 진행합니다.\n참여 가능 일정은 상담 후 안내드립니다.",
    createdAt: "2026.02.22",
    isPinned: false,
  },
  {
    id: "notice-20260214-01",
    title: "센터 소식 게시판 운영 예정 안내",
    content:
      "센터 활동과 프로그램 소식을 전하는 게시판을 준비하고 있습니다.\n정식 운영 전까지 주요 안내는 공지사항에서 확인해 주세요.",
    createdAt: "2026.02.14",
    isPinned: false,
  },
  {
    id: "notice-20260205-01",
    title: "설 명절 휴무 안내",
    content:
      "설 명절 기간 센터 휴무 일정을 안내드립니다.\n명절 이후 상담 문의는 접수 순서대로 안내드리겠습니다.",
    createdAt: "2026.02.05",
    isPinned: false,
    attachments: [
      {
        id: "att-20260205-01",
        name: "설명절_휴무안내.pdf",
        size: 184320,
      },
    ],
  },
  {
    id: "notice-20260128-01",
    title: "초기 상담 준비 자료 안내",
    content:
      "초기 상담 전 아이의 발달 관련 기록이나 기관 소견이 있다면 함께 준비해 주세요.\n자료는 상담 방향을 정하는 데 참고됩니다.",
    createdAt: "2026.01.28",
    isPinned: false,
  },
  {
    id: "notice-20260120-01",
    title: "겨울방학 프로그램 운영 안내",
    content:
      "겨울방학 기간 동안 일부 프로그램이 집중 운영됩니다.\n세부 일정은 상담 후 개별 안내드립니다.",
    createdAt: "2026.01.20",
    isPinned: false,
  },
  {
    id: "notice-20260112-01",
    title: "치료실 환경 정비 안내",
    content:
      "치료실 안전과 위생 관리를 위해 정기 환경 정비를 진행합니다.\n정비 일정 중 일부 공간 이용이 제한될 수 있습니다.",
    createdAt: "2026.01.12",
    isPinned: false,
  },
  {
    id: "notice-20260104-01",
    title: "2026년 새해 운영 안내",
    content:
      "2026년 센터 운영을 시작합니다.\n새해에도 아이들의 발달과 일상 적응을 함께 돕겠습니다.",
    createdAt: "2026.01.04",
    isPinned: false,
  },
  {
    id: "notice-20251224-01",
    title: "크리스마스 휴무 안내",
    content: "크리스마스 당일은 센터 휴무입니다.\n휴무 전후 상담 일정은 센터로 문의해 주세요.",
    createdAt: "2025.12.24",
    isPinned: false,
  },
  {
    id: "notice-20251215-01",
    title: "12월 프로그램 일정 확인 안내",
    content:
      "12월 프로그램 일정은 연말 운영 계획에 따라 일부 조정될 수 있습니다.\n변경 사항은 개별 연락으로 안내드립니다.",
    createdAt: "2025.12.15",
    isPinned: false,
  },
  {
    id: "notice-20251201-01",
    title: "겨울철 등원 시 유의사항",
    content:
      "겨울철 날씨 변화로 이동 시간이 길어질 수 있습니다.\n안전한 등원을 위해 예약 시간보다 여유 있게 출발해 주세요.",
    createdAt: "2025.12.01",
    isPinned: false,
  },
  {
    id: "notice-20251120-01",
    title: "센터 이전 예정 관련 사전 안내",
    content:
      "센터 이전과 관련된 계획은 아직 확정되지 않았습니다.\n변경 사항이 확정되면 공지사항을 통해 정확히 안내드리겠습니다.",
    createdAt: "2025.11.20",
    isPinned: false,
  },
  {
    id: "notice-20251110-01",
    title: "프로그램 대기 문의 안내",
    content:
      "일부 프로그램은 상담 일정에 따라 대기 기간이 발생할 수 있습니다.\n대기 가능 여부는 전화 문의로 확인해 주세요.",
    createdAt: "2025.11.10",
    isPinned: false,
  },
  {
    id: "notice-20251101-01",
    title: "가을 프로그램 운영 소식",
    content:
      "가을 시즌 프로그램 운영 소식을 안내드립니다.\n센터 소식과 공지사항을 통해 일정 변경 여부를 확인해 주세요.",
    createdAt: "2025.11.01",
    isPinned: false,
  },
];
