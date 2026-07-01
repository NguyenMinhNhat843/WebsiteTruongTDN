const InfoItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}) => (
  <div
    className={`space-y-1 p-2 rounded-lg hover:bg-slate-50 transition-colors ${className}`}
  >
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <p className="text-sm font-semibold text-gray-700">{value || "---"}</p>
  </div>
);

export default InfoItem;
