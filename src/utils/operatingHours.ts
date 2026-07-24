import type { CenterInfo, DayOperatingHours, OperatingHours } from "@/types/centerInfo";

const dayOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const shortDayLabels = ["월", "화", "수", "목", "금", "토", "일"] as const;
const fullDayLabels = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"] as const;

export function getFullAddress(centerInfo: CenterInfo | null) {
  if (!centerInfo) {
    return "";
  }

  const detail = centerInfo.address_detail?.trim();

  return detail ? `${centerInfo.address} ${detail}` : centerInfo.address;
}

export function formatPhoneNumber(phoneNumber: string | null | undefined) {
  const digits = phoneNumber?.replace(/\D/g, "") ?? "";

  if (digits.length === 10 && digits.startsWith("02")) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return phoneNumber ?? "";
}

export function toTelHref(phoneNumber: string | null | undefined) {
  const digits = phoneNumber?.replace(/\D/g, "") ?? "";

  return digits ? `tel:${digits}` : "";
}

export function formatOperatingHours(operatingHours: OperatingHours | null | undefined) {
  if (!operatingHours) {
    return [];
  }

  const rows: string[] = [];
  let rangeStart = 0;

  for (let index = 1; index <= dayOrder.length; index += 1) {
    const previousHours = operatingHours[dayOrder[index - 1]];
    const currentHours = index < dayOrder.length ? operatingHours[dayOrder[index]] : null;

    if (currentHours && isSameHours(previousHours, currentHours)) {
      continue;
    }

    rows.push(`${formatDayRange(rangeStart, index - 1)} ${formatDayHours(previousHours)}`);
    rangeStart = index;
  }

  return rows;
}

function isSameHours(left: DayOperatingHours, right: DayOperatingHours) {
  return left.open === right.open && left.start === right.start && left.end === right.end;
}

function formatDayRange(startIndex: number, endIndex: number) {
  if (startIndex === endIndex) {
    return fullDayLabels[startIndex];
  }

  return `${shortDayLabels[startIndex]}~${shortDayLabels[endIndex]}`;
}

function formatDayHours(hours: DayOperatingHours) {
  if (!hours.open) {
    return "휴무";
  }

  if (!hours.start || !hours.end) {
    return "운영";
  }

  return `${hours.start} ~ ${hours.end}`;
}
