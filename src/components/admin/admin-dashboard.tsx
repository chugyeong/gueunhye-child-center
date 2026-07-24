"use client";

import { Clock3, MapPin, Phone, Smartphone, UserRound } from "lucide-react";
import { DashboardCard } from "@/components/admin/dashboard/dashboard-card";
import { EmptyText } from "@/components/admin/dashboard/empty-text";
import { InfoItem } from "@/components/admin/dashboard/info-item";
import { NoticeListPreview } from "@/components/admin/dashboard/notice-list-preview";
import { compareNoticeDateDesc } from "@/components/admin/dashboard/notice-utils";
import { TeacherSummaryCard } from "@/components/admin/dashboard/teacher-summary-card";
import { useCenterInfoStore } from "@/stores/centerInfoStore";
import { useNoticesStore } from "@/stores/noticesStore";
import { useTeachersStore } from "@/stores/teachersStore";
import { formatOperatingHours, formatPhoneNumber, getFullAddress } from "@/utils/operatingHours";
import { useEffect } from "react";

export function AdminDashboard() {
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const isCenterInfoLoading = useCenterInfoStore((state) => state.isLoading);
  const centerInfoError = useCenterInfoStore((state) => state.error);
  const notices = useNoticesStore((state) => state.notices);
  const isNoticesLoading = useNoticesStore((state) => state.isLoading);
  const teachers = useTeachersStore((state) => state.teachers);
  const isTeachersLoading = useTeachersStore((state) => state.isLoading);
  const teachersError = useTeachersStore((state) => state.error);
  const recentNotices = [...notices].sort(compareNoticeDateDesc).slice(0, 5);
  const operatingHours = formatOperatingHours(centerInfo?.operating_hours);

  return (
    <section className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <DashboardCard title="센터 정보" href="/admin/center-info">
          {centerInfo ? (
            <dl className="grid gap-3 text-sm">
              <InfoItem icon={UserRound} label="센터명" value={centerInfo.center_name} />
              <InfoItem
                icon={Phone}
                label="대표번호"
                value={formatPhoneNumber(centerInfo.center_phone)}
              />
              <InfoItem
                icon={Smartphone}
                label="휴대폰번호"
                value={formatPhoneNumber(centerInfo.mobile_phone)}
              />
              <InfoItem icon={MapPin} label="주소" value={getFullAddress(centerInfo)} />
              <InfoItem icon={Clock3} label="운영시간" value={operatingHours.join(" · ")} />
            </dl>
          ) : centerInfoError ? (
            <EmptyText>센터 정보를 불러오지 못했습니다.</EmptyText>
          ) : isCenterInfoLoading ? (
            <EmptyText>센터 정보를 불러오는 중입니다.</EmptyText>
          ) : (
            <EmptyText>센터 정보가 없습니다.</EmptyText>
          )}
        </DashboardCard>

        <DashboardCard title="최근 공지사항" href="/admin/notices">
          {recentNotices.length > 0 ? (
            <NoticeListPreview notices={recentNotices} />
          ) : isNoticesLoading ? (
            <EmptyText>공지사항을 불러오는 중입니다.</EmptyText>
          ) : (
            <EmptyText>등록된 공지사항이 없습니다.</EmptyText>
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="선생님 목록" href="/admin/teachers">
        {teachers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {teachers.map((teacher) => (
              <TeacherSummaryCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : teachersError ? (
          <EmptyText>선생님 정보를 불러오지 못했습니다.</EmptyText>
        ) : isTeachersLoading ? (
          <EmptyText>선생님 정보를 불러오는 중입니다.</EmptyText>
        ) : (
          <EmptyText>표시할 선생님 정보가 없습니다.</EmptyText>
        )}
      </DashboardCard>
    </section>
  );
}
