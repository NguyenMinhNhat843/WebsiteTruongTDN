interface ShortcutCardProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  bgColor: string;
  onClick?: () => void;
}

const ShortcutCard = ({
  icon: Icon,
  label,
  bgColor,
  onClick,
}: ShortcutCardProps) => (
  <button
    onClick={onClick}
    className="group cursor-pointer flex flex-col items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
  >
    <div
      className={`p-3 rounded-lg mb-4 ${bgColor} group-hover:scale-110 transition-transform`}
    >
      <Icon className="text-white" size={20} />
    </div>
    <span className="font-bold text-gray-800 text-sm">{label}</span>
  </button>
);

export default ShortcutCard;
