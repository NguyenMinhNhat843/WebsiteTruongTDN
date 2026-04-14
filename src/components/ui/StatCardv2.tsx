interface StatCardv2Props {
  label: string;
  val: number | string;
  unit?: string;
  icon: React.ElementType;
  iconBg: string;
  css?: string;
  Icon?: React.ElementType;
}

const StatCardv2 = ({
  label,
  val,
  unit,
  iconBg,
  css,
  Icon,
}: StatCardv2Props) => {
  return (
    <div className={`${css} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          {Icon ? <Icon className="w-6 h-6" /> : null}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{val}</div>
          <div className="text-xs opacity-70">{unit}</div>
        </div>
      </div>
      <div className="text-md font-semibold tracking-wide">{label}</div>
    </div>
  );
};

export default StatCardv2;
