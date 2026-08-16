interface Props {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = "📭" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-2">
      <span className="text-2xl opacity-60">{icon}</span>
      <p className="text-[12px] text-[#9EA3AE] dark:text-white/50 max-w-xs">{message}</p>
    </div>
  );
}
