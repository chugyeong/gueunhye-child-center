"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ToastMessage } from "@/components/ui/toast-message";
import type { Notice } from "@/data/notices";
import {
  createNotice,
  deleteNotice,
  updateNotice,
  type CreateNoticePayload,
  type UpdateNoticePayload,
} from "@/services/notices";
import { useNoticesStore } from "@/stores/noticesStore";
import { getSortedNotices } from "@/lib/notices";

const ICON_STROKE = 1.8;

type NoticeFormState = {
  title: string;
  content: string;
};

type FormErrors = Partial<Record<keyof NoticeFormState, string>>;
type ModalMode = "create" | "edit";

const emptyFormState: NoticeFormState = {
  title: "",
  content: "",
};

export function NoticeManagement() {
  const notices = useNoticesStore((state) => state.notices);
  const isLoading = useNoticesStore((state) => state.isLoading);
  const error = useNoticesStore((state) => state.error);
  const refetch = useNoticesStore((state) => state.refetch);
  const sortedNotices = useMemo(() => getSortedNotices(notices), [notices]);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [formState, setFormState] = useState<NoticeFormState>(emptyFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedNotice(null);
    setFormState(emptyFormState);
    clearStatus();
  };

  const openEditModal = (notice: Notice) => {
    setModalMode("edit");
    setSelectedNotice(notice);
    setFormState({
      title: notice.title,
      content: notice.content,
    });
    clearStatus();
  };

  const closeFormModal = () => {
    if (isSubmitting) {
      return;
    }

    setModalMode(null);
    setSelectedNotice(null);
    setFormState(emptyFormState);
    setFormErrors({});
  };

  const clearStatus = () => {
    setMessage(null);
    setSubmitError(null);
    setFormErrors({});
  };

  const handleFormChange =
    (field: keyof NoticeFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
      setMessage(null);
      setSubmitError(null);
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalMode || isSubmitting) {
      return;
    }

    const nextErrors = validateForm(formState);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setSubmitError(null);

    try {
      if (modalMode === "create") {
        const payload: CreateNoticePayload = toTrimmedFormState(formState);

        await createNotice(payload);
        setMessage("공지사항이 등록되었습니다.");
      } else if (selectedNotice) {
        const payload = toUpdatePayload(selectedNotice, formState);

        if (!payload) {
          setMessage("변경된 내용이 없습니다.");
          setIsSubmitting(false);
          return;
        }

        await updateNotice(selectedNotice.id, payload);
        setMessage("공지사항이 수정되었습니다.");
      }

      await refetch();
      closeFormModalAfterSuccess();
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error ? mutationError.message : "공지사항을 저장하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setSubmitError(null);

    try {
      await deleteNotice(deleteTarget.id);
      await refetch();
      setDeleteTarget(null);
      setMessage("공지사항이 삭제되었습니다.");
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error ? mutationError.message : "공지사항을 삭제하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeFormModalAfterSuccess = () => {
    setModalMode(null);
    setSelectedNotice(null);
    setFormState(emptyFormState);
    setFormErrors({});
  };

  return (
    <section className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">공지사항 관리</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              제목과 본문만 입력해 공지사항을 작성하고 수정합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 active:bg-teal-900">
            <Plus aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
            공지 등록
          </button>
        </div>
      </div>

      <ToastMessage message={message} tone="success" onClose={() => setMessage(null)} />
      <ToastMessage message={submitError} tone="error" onClose={() => setSubmitError(null)} />

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading && sortedNotices.length === 0 ? <LoadingState /> : null}

        {!isLoading && error ? (
          <div className="grid gap-3 p-5">
            <StatusPanel tone="error">{error}</StatusPanel>
            <button
              type="button"
              onClick={() => void refetch()}
              className="w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700">
              다시 시도
            </button>
          </div>
        ) : null}

        {!isLoading && !error && sortedNotices.length === 0 ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">
            등록된 공지사항이 없습니다.
          </div>
        ) : null}

        {sortedNotices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="w-28 px-4 py-3">작성일</th>
                  <th className="px-4 py-3">제목</th>
                  <th className="w-28 px-4 py-3">상태</th>
                  <th className="w-48 px-4 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedNotices.map((notice) => (
                  <tr key={notice.id} className="text-sm text-slate-700">
                    <td className="px-4 py-3 text-slate-500">{notice.createdAt}</td>
                    <td className="min-w-0 px-4 py-3">
                      <p className="truncate font-bold text-slate-950">{notice.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">{notice.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      {notice.isPinned ? (
                        <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-800">
                          고정
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                          일반
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(notice)}
                          disabled={isSubmitting}
                          className="inline-flex h-9 min-w-16 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400">
                          <Pencil aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(notice)}
                          disabled={isSubmitting}
                          className="inline-flex h-9 min-w-16 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-red-100 px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300">
                          <Trash2 aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {modalMode ? (
        <NoticeFormModal
          mode={modalMode}
          formState={formState}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onChange={handleFormChange}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteNoticeModal
          notice={deleteTarget}
          isSubmitting={isSubmitting}
          onCancel={() => {
            if (!isSubmitting) {
              setDeleteTarget(null);
            }
          }}
          onConfirm={handleDelete}
        />
      ) : null}
    </section>
  );
}

function NoticeFormModal({
  mode,
  formState,
  formErrors,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: ModalMode;
  formState: NoticeFormState;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onChange: (
    field: keyof NoticeFormState,
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ModalShell title={mode === "create" ? "공지 등록" : "공지 수정"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField label="제목" error={formErrors.title}>
          <input
            type="text"
            value={formState.title}
            onChange={onChange("title")}
            disabled={isSubmitting}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 focus:border-teal-700 focus:outline-none disabled:bg-slate-50"
          />
        </FormField>
        <FormField label="내용" error={formErrors.content}>
          <textarea
            value={formState.content}
            onChange={onChange("content")}
            disabled={isSubmitting}
            rows={12}
            className="min-h-72 resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 focus:border-teal-700 focus:outline-none disabled:bg-slate-50"
          />
        </FormField>
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400">
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-md bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300">
            {isSubmitting ? "저장 중" : "저장"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteNoticeModal({
  notice,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  notice: Notice;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="공지 삭제" onClose={onCancel}>
      <div className="grid gap-4">
        <div>
          <p className="text-sm font-bold text-slate-950">공지사항을 삭제하시겠습니까?</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {notice.title} 공지는 삭제 후 복구할 수 없습니다.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400">
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="h-10 rounded-md bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {isSubmitting ? "삭제 중" : "삭제"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-notice-modal-title"
        className="max-h-[min(760px,calc(100vh-48px))] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="admin-notice-modal-title" className="text-xl font-bold text-slate-950">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700">
            <X aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      {children}
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

function StatusPanel({
  tone,
  children,
}: {
  tone: "error";
  children: React.ReactNode;
}) {
  const classNameByTone = {
    error: "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <p className={`rounded-md border px-4 py-3 text-sm font-semibold ${classNameByTone[tone]}`}>
      {children}
    </p>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3 p-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}

function toTrimmedFormState(formState: NoticeFormState) {
  return {
    title: formState.title.trim(),
    content: formState.content.trim(),
  };
}

function toUpdatePayload(notice: Notice, formState: NoticeFormState): UpdateNoticePayload | null {
  const trimmedFormState = toTrimmedFormState(formState);
  const payload: UpdateNoticePayload = {};

  if (trimmedFormState.title !== notice.title) {
    payload.title = trimmedFormState.title;
  }

  if (trimmedFormState.content !== notice.content) {
    payload.content = trimmedFormState.content;
  }

  return Object.keys(payload).length > 0 ? payload : null;
}

function validateForm(formState: NoticeFormState): FormErrors {
  const errors: FormErrors = {};

  if (!formState.title.trim()) {
    errors.title = "제목을 입력해 주세요.";
  }

  if (!formState.content.trim()) {
    errors.content = "내용을 입력해 주세요.";
  }

  return errors;
}
