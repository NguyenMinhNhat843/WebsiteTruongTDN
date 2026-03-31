import ActionButton from "../../../components/ui/ActionButton";
import { appHelpers } from "../../../util/app.helpers";
import { ROLE_COLOR } from "../constants/user.constants";
import {
  DEPARTMENT,
  STAFF_POSITION,
  type UserResponse,
} from "../types/User.types";
import { userHelpers } from "../user.helpers";
import Avatar from "./Avatar";
import InfoRow from "./InfoRow";
import InfoSection from "./InfoSection";
import RoleBadge from "./RoleBadge";
import StatusDot from "./StatusDot";

interface UserDetailModalProps {
  user: UserResponse | null;
  onClose: () => void;
}

export default function UserDetailModal({
  user,
  onClose,
}: UserDetailModalProps) {
  if (!user) return null;

  // Type-safe cho role color
  const rc = ROLE_COLOR[user.role as keyof typeof ROLE_COLOR];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        style={{
          borderColor: `${rc.border}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.12)`,
        }}
        className="bg-white rounded-3xl p-7 w-full max-w-120 max-h-[85vh] overflow-y-auto border border-solid"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar user={user} size={56} />
          <div className="flex-1">
            <h2 className="text-[20px] font-extrabold text-[#f1f5f9] leading-tight">
              {user.name}
            </h2>
            <p className="text-[12px] text-[#64748b] mt-1">
              {userHelpers.getSubtitle(user)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg hover:text-gray-700 hover:bg-gray-200 transition-colors text-xl"
          >
            &times;
          </button>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap mb-5">
          <RoleBadge role={user.role} />
          <StatusDot status={user.status} />
        </div>

        {/* Info grid - Liên hệ */}
        <InfoSection title="Thông tin liên hệ">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Điện thoại" value={user.phoneNumber} />
          <InfoRow
            label="Ngày tạo"
            value={appHelpers.formatDate(user.createdAt)}
          />
        </InfoSection>

        {/* Info - Staff */}
        {user.staffProfile && (
          <InfoSection title="Thông tin công tác">
            <InfoRow label="Mã nhân viên" value={user.staffProfile.staffCode} />
            <InfoRow
              label="Chức vụ"
              value={
                STAFF_POSITION[
                  user.staffProfile.position as keyof typeof STAFF_POSITION
                ]
              }
            />
            <InfoRow
              label="Phòng/Tổ"
              value={
                DEPARTMENT[
                  user.staffProfile.department as keyof typeof DEPARTMENT
                ]
              }
            />
            {(user.staffProfile.additionalPositions ?? []).length > 0 && (
              <InfoRow
                label="Kiêm nhiệm"
                value={(user.staffProfile.additionalPositions ?? [])
                  .map((p) => STAFF_POSITION[p as keyof typeof STAFF_POSITION])
                  .join(", ")}
              />
            )}
            {user.staffProfile.specialization && (
              <InfoRow
                label="Chuyên môn"
                value={user.staffProfile.specialization}
              />
            )}
            <InfoRow
              label="Bằng cấp"
              value={user.staffProfile.qualification || "—"}
            />
            <InfoRow
              label="Loại HĐ"
              value={
                {
                  FULL_TIME: "Biên chế",
                  PART_TIME: "Bán thời gian",
                  CONTRACT: "Hợp đồng",
                }[
                  user.staffProfile.contractType as
                    | "FULL_TIME"
                    | "PART_TIME"
                    | "CONTRACT"
                ]
              }
            />
            <InfoRow
              label="Ngày vào"
              value={appHelpers.formatDate(user.staffProfile.joinDate)}
            />
          </InfoSection>
        )}

        {/* Info - Student */}
        {user.studentProfile && (
          <InfoSection title="Thông tin học sinh">
            <InfoRow
              label="Mã học sinh"
              value={user.studentProfile.studentCode}
            />
            <InfoRow label="Lớp" value={user.studentProfile.className} />
            <InfoRow
              label="Giới tính"
              value={
                { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" }[
                  user.studentProfile.gender
                ]
              }
            />
            <InfoRow
              label="Địa chỉ"
              value={user.studentProfile.address || "—"}
            />
            <InfoRow
              label="Tình trạng"
              value={
                {
                  STUDYING: "Đang học",
                  GRADUATED: "Tốt nghiệp",
                  TRANSFERRED: "Chuyển trường",
                  DROPPED_OUT: "Nghỉ học",
                }[user.studentProfile.status]
              }
            />
          </InfoSection>
        )}

        {/* Info - Parent */}
        {user.parentProfile && (
          <InfoSection title="Thông tin phụ huynh">
            <InfoRow
              label="Quan hệ"
              value={
                { FATHER: "Bố", MOTHER: "Mẹ", GUARDIAN: "Người giám hộ" }[
                  user.parentProfile.relationship
                ]
              }
            />
            <InfoRow
              label="Nghề nghiệp"
              value={user.parentProfile.occupation || "—"}
            />
            {user.parentProfile.children?.map((c, i) => (
              <InfoRow
                key={i}
                label={`Con ${i + 1}`}
                value={`${c.name} — ${c.className} (${c.studentCode})`}
              />
            ))}
          </InfoSection>
        )}

        {/* Actions Footer */}
        <div className="flex gap-2 mt-5">
          <ActionButton label="✏️ Chỉnh sửa" primary color={rc.dot} />
          {user.status === "active" ? (
            <ActionButton label="🔒 Khoá TK" color="#f87171" />
          ) : (
            <ActionButton label="🔓 Mở khoá" color="#4ade80" />
          )}
          <ActionButton label="🗑 Xoá" color="#f87171" />
        </div>
      </div>
    </div>
  );
}
