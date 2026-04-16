import { BookOpen, Calendar, MapPin, User } from "lucide-react";
import InfoItem from "../components/InfoItem";
import type { FunctionComponent } from "react";
import { useLopHocOneContext } from "./LopHocOneProvider";

interface ThongTinLopHocTabProps {
  row?: any;
  isEditing?: boolean; // Thêm prop này để kiểm soát chế độ sửa
  onChange?: (field: string, value: any) => void; // Callback để update dữ liệu ở component cha
}

const ThongTinLopHocTab: FunctionComponent<ThongTinLopHocTabProps> = ({
  row,
  isEditing = false,
  onChange,
}) => {
  const { editMode } = useLopHocOneContext();
  if (!row) return null;
  const pct = Math.round((row.siso / row.max) * 100);
  isEditing = editMode; // Đồng bộ với context để khi bật edit mode thì tất cả các input đều có thể chỉnh sửa

  // Helper để render content tùy theo chế độ
  const renderInput = (
    field: string,
    defaultValue: string,
    type: string = "text",
  ) => {
    if (!isEditing) return defaultValue;

    return (
      <input
        type={type}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(field, e.target.value)}
        className="w-full bg-blue-50/50 border border-blue-100 rounded px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
      />
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Grid Thông tin */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
        {/* Ngành học thường là cố định, ít khi cho sửa ở đây nhưng nếu cần bạn có thể áp dụng tương tự */}
        <InfoItem
          icon={<BookOpen size={18} className="text-blue-500" />}
          label="Ngành học"
          value={row.nganh}
          subValue={row.chuyenNganh}
        />

        <InfoItem
          icon={<User size={18} className="text-orange-500" />}
          label="Giáo viên chủ nhiệm"
          value={renderInput("gvcn", row.gvcn || "")}
        />

        <InfoItem
          icon={<Calendar size={18} className="text-purple-500" />}
          label="Niên khóa"
          value={renderInput("khoa", row.khoa)}
        />

        <InfoItem
          icon={<MapPin size={18} className="text-red-500" />}
          label="Địa điểm / Phòng"
          value={renderInput("phong", row.phong)}
        />
      </div>

      {/* Phần Sĩ số - Thường không cho sửa bằng tay mà dựa trên danh sách sinh viên */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-700">
              Tình trạng sĩ số
            </h4>
            <p className="text-xs text-gray-400">
              Tối đa cho phép:{" "}
              {isEditing ? (
                <input
                  type="number"
                  defaultValue={row.max}
                  onChange={(e) => onChange?.("max", parseInt(e.target.value))}
                  className="w-16 border-b border-blue-300 focus:outline-none px-1 font-bold text-gray-600"
                />
              ) : (
                row.max
              )}{" "}
              sinh viên
            </p>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {row.siso} <span className="text-gray-300 font-normal">/</span>{" "}
            {row.max}
          </span>
        </div>

        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${pct >= 90 ? "bg-rose-500" : "bg-blue-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] uppercase font-bold text-gray-400">
            Mức độ lấp đầy
          </span>
          <span
            className={`text-xs font-bold ${pct >= 90 ? "text-rose-500" : "text-blue-600"}`}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThongTinLopHocTab;
