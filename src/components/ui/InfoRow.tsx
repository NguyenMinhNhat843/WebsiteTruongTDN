const InfoRow = ({
  label,
  value,
  icon,
  span = false,
}: {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  span?: boolean;
}) => (
  <div className={`flex flex-col gap-0.5 ${span ? "sm:col-span-2" : ""}`}>
    <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
      {icon && <span className="opacity-60">{icon}</span>}
      {label}
    </dt>
    <dd className="text-[13.5px] text-slate-700 font-medium leading-snug">
      {value || (
        <span className="text-slate-300 italic text-[12px]">Chưa cập nhật</span>
      )}
    </dd>
  </div>
);

export default InfoRow;
