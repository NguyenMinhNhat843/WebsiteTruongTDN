import { CheckCircle, Clock, XCircle } from "lucide-react";

interface BadgeStatusExemtionProps {
  status: EnumExemptionStatus;
}

export const EnumExemptionStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;
export type EnumExemptionStatus =
  (typeof EnumExemptionStatus)[keyof typeof EnumExemptionStatus];

const StyleMapEnumExemptionStatus = {
  [EnumExemptionStatus.PENDING]: {
    label: "Đang chờ duyệt",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    Icon: Clock,
  },
  [EnumExemptionStatus.APPROVED]: {
    label: "Đã duyệt",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    Icon: CheckCircle,
  },
  [EnumExemptionStatus.REJECTED]: {
    label: "Bị từ chối",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    Icon: XCircle,
  },
};

const BadgeStatusExemtion = ({ status }: BadgeStatusExemtionProps) => {
  const { Icon, bgColor, label, textColor } =
    StyleMapEnumExemptionStatus[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export default BadgeStatusExemtion;
