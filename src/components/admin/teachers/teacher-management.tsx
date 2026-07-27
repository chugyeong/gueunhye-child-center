"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Info, Pencil, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  createTeacher,
  deleteTeacher,
  updateTeacher,
  updateTeacherOrders,
  type CreateTeacherPayload,
  type UpdateTeacherPayload,
} from "@/services/teachers";
import { useTeachersStore } from "@/stores/teachersStore";
import type { Teacher } from "@/types/teacher";
import { ToastMessage } from "@/components/ui/toast-message";

const ICON_STROKE = 1.8;
const teacherGroups = ["언어재활사", "작업치료사", "운영진"] as const;

type TeacherFormState = {
  name: string;
  position: string;
  group_name: string;
  is_visible: boolean;
};

type FormErrors = Partial<Record<keyof TeacherFormState, string>>;
type ModalMode = "create" | "edit";

const emptyFormState: TeacherFormState = {
  name: "",
  position: "",
  group_name: teacherGroups[0],
  is_visible: true,
};

export function TeacherManagement() {
  const teachers = useTeachersStore((state) => state.teachers);
  const isLoading = useTeachersStore((state) => state.isLoading);
  const error = useTeachersStore((state) => state.error);
  const refetch = useTeachersStore((state) => state.refetch);
  const sortedTeachers = useMemo(() => sortTeachers(teachers), [teachers]);
  const teacherIds = useMemo(() => sortedTeachers.map((teacher) => teacher.id), [sortedTeachers]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [formState, setFormState] = useState<TeacherFormState>(emptyFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSaving, setIsOrderSaving] = useState(false);
  const [visibilityUpdatingId, setVisibilityUpdatingId] = useState<number | null>(null);
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isMutating = isSubmitting || isOrderSaving || visibilityUpdatingId !== null;

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedTeacher(null);
    setFormState(emptyFormState);
    clearStatus();
  };

  const openEditModal = (teacher: Teacher) => {
    setModalMode("edit");
    setSelectedTeacher(teacher);
    setFormState(toFormState(teacher));
    clearStatus();
  };

  const closeFormModal = () => {
    if (isSubmitting) {
      return;
    }

    setModalMode(null);
    setSelectedTeacher(null);
    setFormState(emptyFormState);
    setFormErrors({});
  };

  const clearStatus = () => {
    setMessage(null);
    setSubmitError(null);
    setFormErrors({});
  };

  const handleFormChange =
    (field: keyof TeacherFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "is_visible" && event.target instanceof HTMLInputElement
          ? event.target.checked
          : event.target.value;

      setFormState((current) => ({
        ...current,
        [field]: value,
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
    setSubmitError(null);
    setMessage(null);

    try {
      if (modalMode === "create") {
        const payload: CreateTeacherPayload = {
          ...toTrimmedFormState(formState),
          display_order: getNextDisplayOrder(sortedTeachers),
        };

        await createTeacher(payload);
        await refetch();
        setMessage("선생님 정보가 등록되었습니다.");
      } else if (selectedTeacher) {
        const payload = toUpdatePayload(selectedTeacher, formState);

        if (!payload) {
          setMessage("변경된 내용이 없습니다.");
          setIsSubmitting(false);
          return;
        }

        await updateTeacher(selectedTeacher.id, payload);
        await refetch();
        setMessage("선생님 정보가 수정되었습니다.");
      }

      closeFormModalAfterSuccess();
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error ? mutationError.message : "선생님 정보를 저장하지 못했습니다.",
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
    setSubmitError(null);
    setMessage(null);

    try {
      await deleteTeacher(deleteTarget.id);
      await refetch();

      const reorderedItems = normalizeOrderItems(useTeachersStore.getState().teachers);

      if (reorderedItems.length > 0) {
        await updateTeacherOrders(reorderedItems);
      }

      await refetch();
      setDeleteTarget(null);
      setMessage("선생님 정보가 삭제되었습니다.");
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error ? mutationError.message : "선생님 정보를 삭제하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (isOrderSaving) {
      return;
    }

    setActiveDragId(Number(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);

    if (isOrderSaving) {
      return;
    }

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedTeachers.findIndex((teacher) => teacher.id === active.id);
    const newIndex = sortedTeachers.findIndex((teacher) => teacher.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reorderedTeachers = arrayMove(sortedTeachers, oldIndex, newIndex);

    setIsOrderSaving(true);
    setSubmitError(null);
    setMessage(null);

    try {
      await updateTeacherOrders(normalizeOrderItems(reorderedTeachers));
      await refetch();
      setMessage("노출 순서가 변경되었습니다.");
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error ? mutationError.message : "노출 순서를 저장하지 못했습니다.",
      );
    } finally {
      setIsOrderSaving(false);
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const handleVisibilityToggle = async (teacher: Teacher) => {
    if (visibilityUpdatingId !== null || isSubmitting || isOrderSaving) {
      return;
    }

    setVisibilityUpdatingId(teacher.id);
    setSubmitError(null);
    setMessage(null);

    try {
      await updateTeacher(teacher.id, { is_visible: !teacher.is_visible });
      await refetch();
      setMessage(`${teacher.name} 선생님의 노출 여부가 변경되었습니다.`);
    } catch (mutationError) {
      setSubmitError(
        mutationError instanceof Error ? mutationError.message : "노출 여부를 변경하지 못했습니다.",
      );
    } finally {
      setVisibilityUpdatingId(null);
    }
  };

  const closeFormModalAfterSuccess = () => {
    setModalMode(null);
    setSelectedTeacher(null);
    setFormState(emptyFormState);
    setFormErrors({});
  };

  return (
    <section className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">선생님 관리</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              선생님 프로필, 그룹, 노출 여부와 표시 순서를 관리합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={isMutating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 active:bg-teal-900">
            <Plus aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
            선생님 등록
          </button>
        </div>
      </div>

      <ToastMessage message={message} tone="success" onClose={() => setMessage(null)} />
      <ToastMessage message={submitError} tone="error" onClose={() => setSubmitError(null)} />

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {isLoading && sortedTeachers.length === 0 ? <LoadingState /> : null}

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

        {!isLoading && !error && sortedTeachers.length === 0 ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">
            등록된 선생님이 없습니다.
          </div>
        ) : null}

        {sortedTeachers.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={(event) => void handleDragEnd(event)}
            onDragCancel={handleDragCancel}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="w-14 px-4 py-3" aria-label="드래그 핸들" />
                    <th className="w-20 px-4 py-3">순서</th>
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">직책</th>
                    <th className="px-4 py-3">그룹</th>
                    <th className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        노출 여부
                        <VisibilityHelpTooltip />
                      </span>
                    </th>
                    <th className="w-52 px-4 py-3 text-right">관리</th>
                  </tr>
                </thead>
                <SortableContext items={teacherIds} strategy={verticalListSortingStrategy}>
                  <tbody className="divide-y divide-slate-100">
                    {sortedTeachers.map((teacher, index) => (
                      <SortableTeacherRow
                        key={teacher.id}
                        teacher={teacher}
                        index={index}
                        isDragging={activeDragId === teacher.id}
                        isDragDisabled={isOrderSaving}
                        isMutating={isMutating}
                        isVisibilityUpdating={visibilityUpdatingId === teacher.id}
                        onEdit={openEditModal}
                        onDelete={setDeleteTarget}
                        onVisibilityToggle={handleVisibilityToggle}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </div>
          </DndContext>
        ) : null}
      </div>

      {modalMode ? (
        <TeacherFormModal
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
        <DeleteTeacherModal
          teacher={deleteTarget}
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

function SortableTeacherRow({
  teacher,
  index,
  isDragging,
  isDragDisabled,
  isMutating,
  isVisibilityUpdating,
  onEdit,
  onDelete,
  onVisibilityToggle,
}: {
  teacher: Teacher;
  index: number;
  isDragging: boolean;
  isDragDisabled: boolean;
  isMutating: boolean;
  isVisibilityUpdating: boolean;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
  onVisibilityToggle: (teacher: Teacher) => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({
      id: teacher.id,
      disabled: isDragDisabled,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`text-sm text-slate-700 ${isDragging ? "relative z-10 bg-teal-50 opacity-90 shadow-lg" : "bg-white"}`}>
      <td className="px-4 py-3">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`${teacher.name} 순서 드래그`}
          disabled={isDragDisabled}
          className="inline-flex size-9 cursor-grab items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-700 active:cursor-grabbing disabled:cursor-not-allowed disabled:text-slate-300">
          <GripVertical aria-hidden="true" size={17} strokeWidth={ICON_STROKE} />
        </button>
      </td>
      <td className="px-4 py-3 font-bold text-slate-950">{index + 1}</td>
      <td className="px-4 py-3 font-bold text-slate-950">{teacher.name}</td>
      <td className="px-4 py-3">{teacher.position}</td>
      <td className="px-4 py-3">{teacher.group_name}</td>
      <td className="px-4 py-3">
        <VisibilityToggle
          isVisible={teacher.is_visible}
          disabled={isVisibilityUpdating || isMutating}
          onClick={() => onVisibilityToggle(teacher)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(teacher)}
            disabled={isMutating}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-400">
            <Pencil aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
            수정
          </button>
          <button
            type="button"
            onClick={() => onDelete(teacher)}
            disabled={isMutating}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-red-100 px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300">
            <Trash2 aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
}

function VisibilityToggle({
  isVisible,
  disabled,
  onClick,
}: {
  isVisible: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isVisible}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-20 items-center rounded-full border px-1 transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isVisible
          ? "border-teal-200 bg-teal-600 text-white"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}>
      <span
        className={`flex size-6 items-center justify-center rounded-full bg-white text-[10px] font-bold shadow-sm transition ${
          isVisible ? "translate-x-12 text-teal-700" : "translate-x-0 text-slate-500"
        }`}>
        {isVisible ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function VisibilityHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="노출 여부 도움말"
        onClick={() => setIsOpen((current) => !current)}
        onBlur={() => setIsOpen(false)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex size-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 focus:bg-slate-200 focus:text-slate-700 focus:outline-none">
        <Info aria-hidden="true" size={15} strokeWidth={ICON_STROKE} />
      </button>
      {isOpen ? (
        <span className="fixed left-4 right-4 top-24 z-[80] rounded-md border border-slate-200 bg-white p-3 text-left text-xs font-medium leading-5 text-slate-700 shadow-xl md:absolute md:left-auto md:right-0 md:top-7 md:w-80">
          노출을 끄면 홈페이지의 선생님 목록에서 일시적으로 숨겨집니다.
          <br />
          삭제하지 않고 휴가, 정보 수정 등의 이유로 잠시 노출을 막을 때 사용할 수 있습니다.
        </span>
      ) : null}
    </span>
  );
}

function TeacherFormModal({
  mode,
  formState,
  formErrors,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: ModalMode;
  formState: TeacherFormState;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onChange: (
    field: keyof TeacherFormState,
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ModalShell title={mode === "create" ? "선생님 등록" : "선생님 수정"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField label="이름" error={formErrors.name}>
          <TextInput value={formState.name} onChange={onChange("name")} disabled={isSubmitting} />
        </FormField>
        <FormField label="직책" error={formErrors.position}>
          <TextInput
            value={formState.position}
            onChange={onChange("position")}
            disabled={isSubmitting}
          />
        </FormField>
        <FormField label="그룹" error={formErrors.group_name}>
          <select
            value={formState.group_name}
            onChange={onChange("group_name")}
            disabled={isSubmitting}
            className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 focus:border-teal-700 focus:outline-none disabled:bg-slate-50">
            {teacherGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </FormField>
        <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
          <input
            type="checkbox"
            checked={formState.is_visible}
            onChange={onChange("is_visible")}
            disabled={isSubmitting}
            className="size-4 accent-teal-700"
          />
          홈페이지에 노출
        </label>
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

function DeleteTeacherModal({
  teacher,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  teacher: Teacher;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="선생님 삭제" onClose={onCancel}>
      <div className="grid gap-4">
        <div>
          <p className="text-sm font-bold text-slate-950">선생님 정보를 삭제하시겠습니까?</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {teacher.name} 선생님 정보는 삭제 후 복구할 수 없습니다.
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
        aria-labelledby="admin-teacher-modal-title"
        className="max-h-[min(720px,calc(100vh-48px))] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="admin-teacher-modal-title" className="text-xl font-bold text-slate-950">
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

function TextInput({
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
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 focus:border-teal-700 focus:outline-none disabled:bg-slate-50"
    />
  );
}

function StatusPanel({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  const classNameByTone = {
    success: "border-teal-100 bg-teal-50 text-teal-800",
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

function sortTeachers(teachers: Teacher[]) {
  return [...teachers].sort((left, right) => left.display_order - right.display_order);
}

function getNextDisplayOrder(teachers: Teacher[]) {
  return teachers.reduce((maxOrder, teacher) => Math.max(maxOrder, teacher.display_order), 0) + 1;
}

function toFormState(teacher: Teacher): TeacherFormState {
  return {
    name: teacher.name,
    position: teacher.position,
    group_name: teacher.group_name,
    is_visible: teacher.is_visible,
  };
}

function toTrimmedFormState(formState: TeacherFormState) {
  return {
    name: formState.name.trim(),
    position: formState.position.trim(),
    group_name: formState.group_name.trim(),
    is_visible: formState.is_visible,
  };
}

function toUpdatePayload(teacher: Teacher, formState: TeacherFormState): UpdateTeacherPayload | null {
  const trimmedFormState = toTrimmedFormState(formState);
  const payload: UpdateTeacherPayload = {};

  if (trimmedFormState.name !== teacher.name) {
    payload.name = trimmedFormState.name;
  }

  if (trimmedFormState.position !== teacher.position) {
    payload.position = trimmedFormState.position;
  }

  if (trimmedFormState.group_name !== teacher.group_name) {
    payload.group_name = trimmedFormState.group_name;
  }

  if (trimmedFormState.is_visible !== teacher.is_visible) {
    payload.is_visible = trimmedFormState.is_visible;
  }

  return Object.keys(payload).length > 0 ? payload : null;
}

function validateForm(formState: TeacherFormState): FormErrors {
  const errors: FormErrors = {};

  if (!formState.name.trim()) {
    errors.name = "이름을 입력해 주세요.";
  }

  if (!formState.position.trim()) {
    errors.position = "직책을 입력해 주세요.";
  }

  if (!formState.group_name.trim()) {
    errors.group_name = "그룹을 선택해 주세요.";
  }

  return errors;
}

function normalizeOrderItems(teachers: Teacher[]) {
  return teachers.map((teacher, index) => ({
    id: teacher.id,
    display_order: index + 1,
  }));
}
