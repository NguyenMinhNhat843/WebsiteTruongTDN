import { AlertCircle, Stethoscope } from "lucide-react";
import InfoRow from "../../../../../components/ui/InfoRow";
import SectionCard from "../../../../../components/ui/SectionCard";
import type { HocSinh } from "../../mockType";

const TabSucKhoe = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    <SectionCard title="Chỉ số sức khỏe">
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Nhóm máu",
            value: hs.nhomMau,
            unit: "",
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-100",
          },
          {
            label: "Chiều cao",
            value: hs.chieuCao,
            unit: "cm",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            label: "Cân nặng",
            value: hs.canNang,
            unit: "kg",
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-100",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center p-4 rounded-xl border ${item.bg} ${item.border}`}
          >
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">
              {item.label}
            </span>
            <span className={`text-2xl font-black ${item.color}`}>
              {item.value}
            </span>
            {item.unit && (
              <span
                className={`text-[11px] font-semibold mt-0.5 ${item.color} opacity-70`}
              >
                {item.unit}
              </span>
            )}
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-1 gap-y-4">
        <InfoRow
          label="Tình trạng sức khỏe"
          value={hs.tinhTrangSucKhoe}
          icon={<Stethoscope size={11} />}
        />
      </dl>
    </SectionCard>

    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
      <p className="text-[13px] text-amber-700 leading-relaxed">
        Thông tin sức khỏe cần được cập nhật định kỳ hàng năm. Vui lòng cung cấp
        giấy khám sức khỏe mới nhất từ cơ sở y tế có thẩm quyền.
      </p>
    </div>
  </div>
);

export default TabSucKhoe;
