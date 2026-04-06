import Badge from "../../../../components/ui/Badge";
import { HE_BADGE, STATUS_BADGE } from "../constants";
import { HE_DAO_TAO } from "../mockData";

interface DetailModalProps {
  row: any;
  onClose: () => void;
}

export default function DetailModal({ row, onClose }: DetailModalProps) {
  if (!row) return null;
  const pct = Math.round((row.siso / row.max) * 100);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">{row.ma}</p>
            <h2 className="text-[16px] font-medium">{row.ten}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 mt-1 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <InfoRow label="Hệ đào tạo">
            <Badge className={HE_BADGE[row.he]}>{HE_DAO_TAO[row.he]}</Badge>
          </InfoRow>
          <InfoRow label="Trạng thái">
            <Badge className={STATUS_BADGE[row.status]}>{row.status}</Badge>
          </InfoRow>
          <InfoRow label="Niên khóa">{row.khoa}</InfoRow>
          <InfoRow label="Ngành">{row.nganh}</InfoRow>
          <InfoRow label="Chuyên ngành">{row.chuyenNganh}</InfoRow>
          <InfoRow label="Hình thức">{row.hinhThuc}</InfoRow>
          <InfoRow label="GVCN">{row.gvcn || "Chưa phân công"}</InfoRow>
          <InfoRow label="Phòng học">{row.phong}</InfoRow>
          <div className="col-span-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Sĩ số</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pct >= 90 ? "bg-red-400" : "bg-blue-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {row.siso}/{row.max}{" "}
                <span className="text-gray-400 font-normal">({pct}%)</span>
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
          <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors">
            Chỉnh sửa
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{children}</p>
    </div>
  );
}
