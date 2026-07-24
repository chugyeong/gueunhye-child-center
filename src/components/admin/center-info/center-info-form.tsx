"use client";

import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { updateCenterInfo, type UpdateCenterInfoInput } from "@/services/centerInfo";
import { useCenterInfoStore } from "@/stores/centerInfoStore";
import type { CenterInfo, DayOperatingHours, OperatingHours } from "@/types/centerInfo";

const ICON_STROKE = 1.8;

const days = [
  { key: "monday", label: "월" },
  { key: "tuesday", label: "화" },
  { key: "wednesday", label: "수" },
  { key: "thursday", label: "목" },
  { key: "friday", label: "금" },
  { key: "saturday", label: "토" },
  { key: "sunday", label: "일" },
] as const;

const weekdayKeys = days.slice(0, 5).map((day) => day.key);
const weekendKeys = days.slice(5).map((day) => day.key);
const areaCodes = [
  "02",
  "031",
  "032",
  "033",
  "041",
  "042",
  "043",
  "044",
  "051",
  "052",
  "053",
  "054",
  "055",
  "061",
  "062",
  "063",
  "064",
] as const;

type DayKey = (typeof days)[number]["key"];
type HoursPreset = "all" | "weekdays" | "custom";

type DaumPostcodeAddress = {
  address: string;
  roadAddress: string;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: { oncomplete: (data: DaumPostcodeAddress) => void }) => {
        open: () => void;
      };
    };
  }
}

type CenterInfoFormState = {
  address: string;
  address_detail: string;
  center_phone_area_code: string;
  center_phone_local: string;
  mobile_phone: string;
  business_number: string;
  operating_hours: OperatingHours;
};

const defaultDayHours: DayOperatingHours = {
  open: true,
  start: "09:00",
  end: "18:00",
};
const defaultStartTime = "09:00";
const defaultEndTime = "18:00";

export function CenterInfoForm() {
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const isLoading = useCenterInfoStore((state) => state.isLoading);
  const error = useCenterInfoStore((state) => state.error);
  const initialize = useCenterInfoStore((state) => state.initialize);
  const refetch = useCenterInfoStore((state) => state.refetch);
  const [draftFormState, setDraftFormState] = useState<CenterInfoFormState | null>(null);
  const [selectedHoursPreset, setSelectedHoursPreset] = useState<HoursPreset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const initialFormState = useMemo(() => {
    return centerInfo ? toFormState(centerInfo) : null;
  }, [centerInfo]);
  const activeFormState = draftFormState ?? initialFormState;
  const initialPayload = useMemo(() => {
    return initialFormState ? toPayload(initialFormState) : null;
  }, [initialFormState]);
  const currentPayload = activeFormState ? toPayload(activeFormState) : null;
  const hasChanges =
    Boolean(initialPayload && currentPayload) &&
    JSON.stringify(initialPayload) !== JSON.stringify(currentPayload);
  const inferredHoursPreset = activeFormState
    ? getHoursPreset(activeFormState.operating_hours)
    : "custom";
  const hoursPreset = selectedHoursPreset ?? inferredHoursPreset;

  const updateDraft = (updater: (current: CenterInfoFormState) => CenterInfoFormState) => {
    setDraftFormState((current) => {
      const base = current ?? activeFormState;

      return base ? updater(base) : current;
    });
    clearStatus();
  };

  const clearStatus = () => {
    setMessage(null);
    setSubmitError(null);
  };

  const handleTextChange =
    (field: "address_detail" | "business_number") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateDraft((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleAreaCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateDraft((current) => ({
      ...current,
      center_phone_area_code: event.target.value,
    }));
  };

  const handleAddressSearch = async () => {
    try {
      await loadDaumPostcodeScript();
      new window.daum!.Postcode({
        oncomplete: (data: DaumPostcodeAddress) => {
          updateDraft((current) => ({
            ...current,
            address: data.roadAddress || data.address,
          }));
        },
      }).open();
    } catch {
      setSubmitError("주소 검색 서비스를 불러오지 못했습니다.");
      setMessage(null);
    }
  };

  const handleCenterPhoneLocalChange = (nextValue: string) => {
    updateDraft((current) => ({
      ...current,
      center_phone_local: onlyDigits(nextValue).slice(0, 8),
    }));
  };

  const handleMobilePhoneChange = (nextValue: string) => {
    updateDraft((current) => ({
      ...current,
      mobile_phone: onlyDigits(nextValue).slice(0, 11),
    }));
  };

  const handlePresetChange = (preset: HoursPreset) => {
    if (!activeFormState) {
      return;
    }

    setSelectedHoursPreset(preset);
    const sampleHours = getFirstOpenDayHours(activeFormState.operating_hours) ?? defaultDayHours;

    updateDraft((current) => ({
      ...current,
      operating_hours: applyHoursPreset(current.operating_hours, preset, sampleHours),
    }));
  };

  const handleGroupTimeChange =
    (group: "all" | "weekdays", field: "start" | "end") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const targetKeys = group === "all" ? days.map((day) => day.key) : weekdayKeys;

      updateDraft((current) => ({
        ...current,
        operating_hours: updateDays(current.operating_hours, targetKeys, (dayHours) => ({
          ...dayHours,
          open: true,
          [field]: event.target.value,
        })),
      }));
    };

  const handleDayOpenChange =
    (day: DayKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const isOpen = event.target.checked;

      setSelectedHoursPreset("custom");
      updateDraft((current) => ({
        ...current,
        operating_hours: {
          ...current.operating_hours,
          [day]: {
            ...current.operating_hours[day],
            open: isOpen,
                  start: isOpen ? current.operating_hours[day].start ?? defaultStartTime : null,
                  end: isOpen ? current.operating_hours[day].end ?? defaultEndTime : null,
          },
        },
      }));
    };

  const handleDayTimeChange =
    (day: DayKey, field: "start" | "end") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedHoursPreset("custom");
      updateDraft((current) => ({
        ...current,
        operating_hours: {
          ...current.operating_hours,
          [day]: {
            ...current.operating_hours[day],
            [field]: event.target.value,
          },
        },
      }));
    };

  const handleReset = () => {
    setDraftFormState(null);
    setSelectedHoursPreset(null);
    clearStatus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeFormState || !currentPayload || isSaving) {
      return;
    }

    if (!hasChanges) {
      setSubmitError(null);
      setMessage("변경된 내용이 없습니다.");
      return;
    }

    const validationError = validatePayload(currentPayload);

    if (validationError) {
      setMessage(null);
      setSubmitError(validationError);
      return;
    }

    setIsSaving(true);
    clearStatus();

    try {
      await updateCenterInfo(currentPayload);
      await refetch();
      setDraftFormState(null);
      setSelectedHoursPreset(null);
      setMessage("센터 정보가 저장되었습니다.");
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error ? saveError.message : "센터 정보를 저장하지 못했습니다.";

      setSubmitError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeFormState && isLoading) {
    return <LoadingPanel />;
  }

  if (!activeFormState && error) {
    return <StatusPanel tone="error">{error}</StatusPanel>;
  }

  if (!activeFormState) {
    return <StatusPanel>등록된 센터 정보가 없습니다.</StatusPanel>;
  }

  return (
    <form className="grid max-w-5xl gap-5" onSubmit={handleSubmit}>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">센터 정보</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          홈페이지에 노출되는 센터 연락처, 주소, 운영시간을 관리합니다.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">기본 정보</h2>
        {centerInfo?.center_name ? (
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold text-slate-500">센터명</p>
            <p className="mt-1 text-sm font-bold text-slate-950">{centerInfo.center_name}</p>
          </div>
        ) : null}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <FormField label="주소" required className="md:col-span-2">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <TextInput value={activeFormState.address} readOnly disabled={isSaving} />
              <button
                type="button"
                onClick={handleAddressSearch}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400">
                주소 찾기
              </button>
            </div>
          </FormField>
          <FormField label="상세주소" className="md:col-span-2">
            <TextInput
              value={activeFormState.address_detail}
              onChange={handleTextChange("address_detail")}
              disabled={isSaving}
            />
          </FormField>
          <FormField label="대표번호" required>
            <div className="grid grid-cols-[104px_1fr] gap-2">
              <select
                value={activeFormState.center_phone_area_code}
                onChange={handleAreaCodeChange}
                disabled={isSaving}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-950 transition focus:border-teal-700 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500">
                {areaCodes.map((areaCode) => (
                  <option key={areaCode} value={areaCode}>
                    {areaCode}
                  </option>
                ))}
              </select>
              <FormattedPhoneInput
                value={formatLocalPhone(activeFormState.center_phone_local)}
                onValueChange={handleCenterPhoneLocalChange}
                disabled={isSaving}
                maxDigits={8}
              />
            </div>
          </FormField>
          <FormField label="휴대폰번호" required>
            <FormattedPhoneInput
              value={formatMobilePhone(activeFormState.mobile_phone)}
              onValueChange={handleMobilePhoneChange}
              disabled={isSaving}
              maxDigits={11}
            />
          </FormField>
          <FormField label="사업자등록번호" className="md:col-span-2">
            <TextInput
              value={activeFormState.business_number}
              onChange={handleTextChange("business_number")}
              disabled={isSaving}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">운영시간</h2>
            <p className="mt-1 text-sm text-slate-500">
              자주 쓰는 패턴을 먼저 고르고, 필요할 때만 요일별로 조정하세요.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <PresetButton
            active={hoursPreset === "all"}
            title="평일/주말 모두"
            description="매일 같은 시간 운영"
            onClick={() => handlePresetChange("all")}
            disabled={isSaving}
          />
          <PresetButton
            active={hoursPreset === "weekdays"}
            title="평일만"
            description="월-금 운영, 주말 휴무"
            onClick={() => handlePresetChange("weekdays")}
            disabled={isSaving}
          />
          <PresetButton
            active={hoursPreset === "custom"}
            title="직접 할게요"
            description="요일별로 따로 설정"
            onClick={() => handlePresetChange("custom")}
            disabled={isSaving}
          />
        </div>

        <div className="mt-5">
          {hoursPreset === "all" ? (
            <GroupHoursEditor
              label="매일"
              start={activeFormState.operating_hours.monday.start ?? defaultStartTime}
              end={activeFormState.operating_hours.monday.end ?? defaultEndTime}
              onStartChange={handleGroupTimeChange("all", "start")}
              onEndChange={handleGroupTimeChange("all", "end")}
              disabled={isSaving}
            />
          ) : null}

          {hoursPreset === "weekdays" ? (
            <div className="grid gap-3">
              <GroupHoursEditor
                label="평일"
                start={activeFormState.operating_hours.monday.start ?? defaultStartTime}
                end={activeFormState.operating_hours.monday.end ?? defaultEndTime}
                onStartChange={handleGroupTimeChange("weekdays", "start")}
                onEndChange={handleGroupTimeChange("weekdays", "end")}
                disabled={isSaving}
              />
              <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                토요일과 일요일은 휴무로 저장됩니다.
              </p>
            </div>
          ) : null}

          {hoursPreset === "custom" ? (
            <div className="grid gap-3">
              {days.map((day) => {
                const dayHours = activeFormState.operating_hours[day.key];

                return (
                  <div
                    key={day.key}
                    className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-[72px_110px_1fr] md:items-center">
                    <p className="text-sm font-bold text-slate-800">{day.label}요일</p>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={dayHours.open}
                        onChange={handleDayOpenChange(day.key)}
                        disabled={isSaving}
                        className="size-4 accent-teal-700"
                      />
                      운영
                    </label>
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                      <TimeInput
                        value={dayHours.start ?? ""}
                        onChange={handleDayTimeChange(day.key, "start")}
                        disabled={isSaving || !dayHours.open}
                      />
                      <span className="hidden text-center text-sm font-semibold text-slate-400 sm:block">
                        -
                      </span>
                      <TimeInput
                        value={dayHours.end ?? ""}
                        onChange={handleDayTimeChange(day.key, "end")}
                        disabled={isSaving || !dayHours.open}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {message ? <StatusPanel tone="success">{message}</StatusPanel> : null}
      {submitError ? <StatusPanel tone="error">{submitError}</StatusPanel> : null}

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur md:mx-0 md:rounded-lg md:border md:bg-white">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400">
            되돌리기
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-5 text-sm font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 active:bg-teal-900">
            <Save aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
            {isSaving ? "저장 중" : "저장"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormField({
  label,
  required = false,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid gap-2 text-sm font-bold text-slate-800 ${className}`}>
      <span>
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  disabled,
  readOnly = false,
}: {
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  readOnly?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition placeholder:text-slate-400 focus:border-teal-700 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
    />
  );
}

function TimeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition focus:border-teal-700 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
    />
  );
}

function FormattedPhoneInput({
  value,
  onValueChange,
  disabled,
  maxDigits,
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  maxDigits: number;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") {
      return;
    }

    const input = event.currentTarget;
    const cursor = input.selectionStart ?? 0;

    if (cursor > 0 && value[cursor - 1] === "-") {
      event.preventDefault();
      const digitsBeforeHyphen = onlyDigits(value.slice(0, cursor - 1));
      const digitsAfterCursor = onlyDigits(value.slice(cursor));
      const nextDigits = `${digitsBeforeHyphen.slice(0, -1)}${digitsAfterCursor}`;

      onValueChange(nextDigits.slice(0, maxDigits));
    }
  };

  return (
    <input
      type="tel"
      value={value}
      onChange={(event) => onValueChange(onlyDigits(event.target.value).slice(0, maxDigits))}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      inputMode="numeric"
      className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 transition placeholder:text-slate-400 focus:border-teal-700 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
    />
  );
}

function PresetButton({
  active,
  title,
  description,
  onClick,
  disabled,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-20 rounded-md border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-70 ${
        active
          ? "border-teal-400 bg-teal-50 text-teal-900 ring-1 ring-teal-300"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/50"
      }`}>
      <span className="block text-sm font-bold">{title}</span>
      <span className="mt-1 block text-xs font-medium text-slate-500">{description}</span>
    </button>
  );
}

function GroupHoursEditor({
  label,
  start,
  end,
  onStartChange,
  onEndChange,
  disabled,
}: {
  label: string;
  start: string;
  end: string;
  onStartChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEndChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[96px_1fr] md:items-center">
      <p className="text-sm font-bold text-slate-800">{label}</p>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <TimeInput value={start} onChange={onStartChange} disabled={disabled} />
        <span className="hidden text-center text-sm font-semibold text-slate-400 sm:block">-</span>
        <TimeInput value={end} onChange={onEndChange} disabled={disabled} />
      </div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <section className="max-w-5xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">센터 정보를 불러오는 중입니다.</p>
    </section>
  );
}

function StatusPanel({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "error";
  children: React.ReactNode;
}) {
  const classNameByTone = {
    neutral: "border-slate-200 bg-white text-slate-600",
    success: "border-teal-100 bg-teal-50 text-teal-800",
    error: "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <p
      className={`max-w-5xl rounded-md border px-4 py-3 text-sm font-semibold ${classNameByTone[tone]}`}>
      {children}
    </p>
  );
}

function toFormState(centerInfo: CenterInfo): CenterInfoFormState {
  const centerPhone = splitCenterPhone(centerInfo.center_phone);

  return {
    address: centerInfo.address,
    address_detail: centerInfo.address_detail ?? "",
    center_phone_area_code: centerPhone.areaCode,
    center_phone_local: centerPhone.localNumber,
    mobile_phone: onlyDigits(centerInfo.mobile_phone),
    business_number: centerInfo.business_number,
    operating_hours: normalizeOperatingHours(centerInfo.operating_hours),
  };
}

function toPayload(formState: CenterInfoFormState): UpdateCenterInfoInput {
  return {
    address: formState.address.trim(),
    address_detail: formState.address_detail.trim() || null,
    center_phone: `${formState.center_phone_area_code}${onlyDigits(formState.center_phone_local)}`,
    mobile_phone: onlyDigits(formState.mobile_phone),
    business_number: formState.business_number.trim(),
    operating_hours: days.reduce((nextHours, day) => {
      const currentDay = formState.operating_hours[day.key];

      nextHours[day.key] = {
        open: currentDay.open,
        start: currentDay.open ? currentDay.start : null,
        end: currentDay.open ? currentDay.end : null,
      };

      return nextHours;
    }, {} as OperatingHours),
  };
}

function validatePayload(payload: UpdateCenterInfoInput) {
  if (!payload.address) {
    return "주소를 입력해 주세요.";
  }

  if (!isValidCenterPhone(payload.center_phone)) {
    return "대표번호를 확인해 주세요.";
  }

  if (!/^010\d{8}$/.test(payload.mobile_phone)) {
    return "휴대폰번호는 010으로 시작하는 11자리 번호로 입력해 주세요.";
  }

  for (const day of days) {
    const dayHours = payload.operating_hours[day.key];

    if (!dayHours.open) {
      continue;
    }

    if (!dayHours.start || !dayHours.end) {
      return `${day.label}요일 운영 시작 시간과 종료 시간을 입력해 주세요.`;
    }

    if (dayHours.start >= dayHours.end) {
      return `${day.label}요일 종료 시간은 시작 시간보다 늦어야 합니다.`;
    }
  }

  return null;
}

function normalizeOperatingHours(operatingHours: OperatingHours): OperatingHours {
  return days.reduce((nextHours, day) => {
    const currentDay = operatingHours[day.key] ?? defaultDayHours;

    nextHours[day.key] = {
      open: currentDay.open,
      start: currentDay.open ? currentDay.start ?? defaultStartTime : null,
      end: currentDay.open ? currentDay.end ?? defaultEndTime : null,
    };

    return nextHours;
  }, {} as OperatingHours);
}

function applyHoursPreset(
  operatingHours: OperatingHours,
  preset: HoursPreset,
  sampleHours: DayOperatingHours,
) {
  if (preset === "custom") {
    return operatingHours;
  }

  if (preset === "all") {
    return updateDays(operatingHours, days.map((day) => day.key), () => ({
      open: true,
      start: sampleHours.start ?? defaultStartTime,
      end: sampleHours.end ?? defaultEndTime,
    }));
  }

  const weekdaysOpen = updateDays(operatingHours, weekdayKeys, () => ({
    open: true,
    start: sampleHours.start ?? defaultStartTime,
    end: sampleHours.end ?? defaultEndTime,
  }));

  return updateDays(weekdaysOpen, weekendKeys, () => ({
    open: false,
    start: null,
    end: null,
  }));
}

function updateDays(
  operatingHours: OperatingHours,
  targetDays: readonly DayKey[],
  updater: (dayHours: DayOperatingHours) => DayOperatingHours,
) {
  return targetDays.reduce(
    (nextHours, day) => ({
      ...nextHours,
      [day]: updater(nextHours[day]),
    }),
    { ...operatingHours },
  );
}

function getHoursPreset(operatingHours: OperatingHours): HoursPreset {
  const firstDay = operatingHours.monday;
  const everyDaySame = days.every((day) => isSameDayHours(firstDay, operatingHours[day.key]));

  if (everyDaySame && firstDay.open) {
    return "all";
  }

  const weekdaysSame = weekdayKeys.every((day) => isSameDayHours(firstDay, operatingHours[day]));
  const weekendsClosed = weekendKeys.every((day) => !operatingHours[day].open);

  if (weekdaysSame && weekendsClosed && firstDay.open) {
    return "weekdays";
  }

  return "custom";
}

function getFirstOpenDayHours(operatingHours: OperatingHours) {
  return days.map((day) => operatingHours[day.key]).find((dayHours) => dayHours.open) ?? null;
}

function isSameDayHours(left: DayOperatingHours, right: DayOperatingHours) {
  return left.open === right.open && left.start === right.start && left.end === right.end;
}

function splitCenterPhone(phoneNumber: string) {
  const digits = onlyDigits(phoneNumber);
  const areaCode =
    [...areaCodes].sort((left, right) => right.length - left.length).find((code) =>
      digits.startsWith(code),
    ) ?? "02";

  return {
    areaCode,
    localNumber: digits.slice(areaCode.length),
  };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatMobilePhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatLocalPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 4) {
    return digits;
  }

  return `${digits.slice(0, digits.length - 4)}-${digits.slice(-4)}`;
}

function isValidCenterPhone(value: string) {
  const digits = onlyDigits(value);

  return areaCodes.some((areaCode) => {
    if (!digits.startsWith(areaCode)) {
      return false;
    }

    const localLength = digits.length - areaCode.length;

    return localLength === 7 || localLength === 8;
  });
}

function loadDaumPostcodeScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.daum?.Postcode) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
}
