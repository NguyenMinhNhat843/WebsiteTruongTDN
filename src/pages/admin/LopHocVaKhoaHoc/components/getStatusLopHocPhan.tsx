export const getStatusBadgeLopHocPhan = (status: string | undefined) => {
  const s = status?.toLowerCase() || "";
  const styles: Record<string, string> = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    planned: "bg-blue-50 text-blue-700 border-blue-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const labels: Record<string, string> = {
    open: "Đang dạy",
    planned: "Lên kế hoạch",
    closed: "Đã đóng",
    cancelled: "Đã hủy",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[s] || styles.closed}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {labels[s] || status}
    </span>
  );
};
