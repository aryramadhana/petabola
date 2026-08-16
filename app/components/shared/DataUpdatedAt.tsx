interface Props {
  updatedAt: string | null;
  label?: string;
}

export function DataUpdatedAt({ updatedAt, label = "Data diperbarui" }: Props) {
  if (!updatedAt) {
    return (
      <p className="text-[10px] text-[#9EA3AE] dark:text-white/50 italic">
        Belum ada data pembaruan
      </p>
    );
  }

  const formatted = new Date(updatedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <p className="text-[10px] text-[#9EA3AE] dark:text-white/50">
      {label}: <span className="text-[#374151] dark:text-white/80 font-medium">{formatted}</span>
    </p>
  );
}
