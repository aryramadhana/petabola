interface Props {
  updatedAt: string | null;
  label?: string;
}

export function formatIndonesianDate(dateStr: string): string {
  const date = new Date(dateStr);
  const parts = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  return `${day}/${month}/${year}`;
}

export function DataUpdatedAt({ updatedAt, label = "Data diperbarui" }: Props) {
  if (!updatedAt) {
    return (
      <p className="text-[10px] text-[#9EA3AE] dark:text-white/50 italic">
        Belum ada data pembaruan
      </p>
    );
  }

  const formatted = formatIndonesianDate(updatedAt);

  return (
    <p className="text-[10px] text-[#9EA3AE] dark:text-white/50">
      {label}: <span className="text-[#374151] dark:text-white/80 font-medium">{formatted}</span>
    </p>
  );
}
