import { BookOpen, Building2, Calendar, Star, TrendingUp } from "lucide-react";
import InfoRow from "../../../../../components/ui/InfoRow";
import SectionCard from "../../../../../components/ui/SectionCard";
import { HE_DAO_TAO_STYLES } from "../../mockStyleMapEnum";
import type { HocSinh } from "../../mockType";

const TabHocTap = ({ hs }: { hs: HocSinh }) => {
  const heStyle = HE_DAO_TAO_STYLES[hs.heDaoTao];
  return (
    <div className="space-y-4">
      <SectionCard title="Chương trình đào tạo">
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
          <div className="flex flex-col gap-1">
            <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hệ đào tạo
            </dt>
            <dd>
              <span
                className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-bold border ${heStyle.bg} ${heStyle.text} ${heStyle.border}`}
              >
                {hs.heDaoTao}
              </span>
            </dd>
          </div>
          <InfoRow
            label="Ngành học"
            value={hs.nganh}
            icon={<BookOpen size={11} />}
          />
          <InfoRow label="Chuyên ngành" value={hs.chuyenNganh} />
          <InfoRow label="Lớp" value={hs.lop} icon={<Building2 size={11} />} />
          <InfoRow
            label="Khóa học"
            value={hs.khoaHoc}
            icon={<Calendar size={11} />}
          />
          <InfoRow label="Năm nhập học" value={hs.namNhapHoc} />
        </dl>
      </SectionCard>

      <SectionCard title="Học bổng & Chính sách">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <Star size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[13px] text-blue-700 font-medium leading-relaxed">
            {hs.hocBongHienTai}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Kết quả học tập">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Học kỳ 1",
              diem: "7.8",
              xep: "Khá",
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Học kỳ 2",
              diem: "8.2",
              xep: "Giỏi",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Tích lũy",
              diem: "8.0",
              xep: "Giỏi",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
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
                {item.diem}
              </span>
              <span className={`text-[11px] font-bold mt-1 ${item.color}`}>
                {item.xep}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-400">
          <TrendingUp size={13} /> Điểm trung bình tích lũy tính theo hệ 10
        </div>
      </SectionCard>
    </div>
  );
};

export default TabHocTap;
