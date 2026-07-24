import type { Teacher } from "@/types/teacher";

export type TeacherGroup = {
  title: string;
  teachers: Teacher[];
};

export function groupTeachersByGroupName(teachers: Teacher[]) {
  const groups = new Map<string, Teacher[]>();

  teachers.forEach((teacher) => {
    const groupName = teacher.group_name.trim() || "기타";
    const group = groups.get(groupName) ?? [];

    group.push(teacher);
    groups.set(groupName, group);
  });

  return Array.from(groups, ([title, groupTeachers]) => ({
    title,
    teachers: groupTeachers,
  }));
}
