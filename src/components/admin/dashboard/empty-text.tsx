type EmptyTextProps = {
  children: React.ReactNode;
};

export function EmptyText({ children }: EmptyTextProps) {
  return (
    <p className="rounded-md bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
      {children}
    </p>
  );
}
