import { BookOpen, CalendarDays, Camera } from "lucide-react";
import { useQuanLyHoSoContext } from "../QuanLyHoSoProvider";
import {
  HoSoTuyenSinhOneProvider,
  useHoSoTuyenSinhOneContext,
} from "./HoSoTuyenSinhOneProvider";
import InfoItemv2 from "../../../../components/ui/InfoItemv2";
import { Timeline } from "../../../../components/ui/TimeLine";
import { useNavigate } from "react-router-dom";
import SectionThongTinCaNhan from "./components/SectionThongTinCaNhan";
import SectionHoSoDinhKem from "./components/SectionHoSoDinhKem";
import SectionThongTinChaMe from "./components/SectionThongTinChaMe";
import SectionThongTinSucKhoe from "./components/SectionThongTinSucKhoe";
import PageShell from "../../../../components/ui/PageShell";
import ButtonAction from "../../../../components/ui/ButtonAction";

const HoSoTuyenSinhOne = () => {
  return (
    <HoSoTuyenSinhOneProvider>
      <Inner />
    </HoSoTuyenSinhOneProvider>
  );
};

const Inner = () => {
  const { getStatusBadge } = useQuanLyHoSoContext();
  const { applicant } = useHoSoTuyenSinhOneContext();
  const navigate = useNavigate();

  if (!applicant) {
    return <div>Không tìm thấy hồ sơ</div>;
  }

  return (
    <PageShell
      title="Hồ sơ tuyển sinh"
      sub={`Ứng viên: ${applicant.applicantName} - Đợt: ${applicant.batchLabel}`}
      icon={BookOpen}
      renderRight={
        <div className="flex justify-between items-center gap-3">
          {/* Nút Duyệt: Tông xanh Emerald đại diện cho sự tin tưởng và thành công */}
          <ButtonAction
            label="Duyệt hồ sơ"
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-200 shadow-sm"
          />

          {/* Nút Từ chối: Tông đỏ Rose/Red nhưng nhẹ nhàng, không gây cảm giác quá gắt */}
          <ButtonAction
            label="Từ chối"
            className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-all duration-200 shadow-sm"
          />

          {/* Nút Quay lại: Tông Slate/Gray trung tính, thể hiện hành động bổ trợ */}
          <ButtonAction
            label="Quay lại"
            onClick={() => navigate("/admin/tuyen-sinh/ho-so-moi")}
            className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 shadow-sm"
          />
        </div>
      }
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI (Sidebar - Chiếm 1/3) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="h-20 bg-linear-to-br from-slate-700 to-slate-900 relative">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
                    backgroundSize: "10px 10px",
                  }}
                />
              </div>
              {/* Avatar */}
              <div className="flex flex-col items-center px-4 pb-5 -mt-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-3xl font-black text-slate-500 select-none">
                    {"A"}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow hover:bg-blue-700 transition">
                    <Camera size={11} className="text-white" />
                  </button>
                </div>

                <h2 className="mt-3 text-[15px] font-black text-slate-800 text-center leading-tight">
                  {"Nguyễn Văn A"}
                </h2>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {"Mã hồ sơ: HS12345678"}
                </p>

                <div className="w-full flex justify-center pt-3 border-t border-gray-50">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {applicant.batchLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Thông tin đăng ký - Card Nổi bật */}
            <section className="bg-linear-to-br from-cyan-600 to-cyan-700 rounded-2xl p-6 text-white shadow-xl shadow-cyan-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-white/20 pb-2">
                <BookOpen className="w-5 h-5 text-cyan-200" />
                Thông tin đăng ký
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-cyan-100 text-xs uppercase tracking-wider mb-1">
                    Ngành học
                  </p>
                  <p className="font-bold text-xl">{applicant.major}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <InfoItemv2 label="Hệ đào tạo" value={applicant.system} />
                  <InfoItemv2 label="Niên khóa" value={"2021 - 2024"} />
                </div>
              </div>
            </section>

            {/* 4. Trạng thái & Lịch sử xét duyệt */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Trạng thái hồ sơ</h3>
                {getStatusBadge(applicant.status)}
              </div>

              <Timeline
                items={[
                  {
                    label: "Ngày nộp hồ sơ",
                    value: new Date(applicant.submitDate).toLocaleDateString(
                      "vi-VN",
                    ),
                    active: true,
                  },
                  ...(applicant.reviewDate
                    ? [
                        {
                          label: "Ngày xét duyệt",
                          value: new Date(
                            applicant.reviewDate,
                          ).toLocaleDateString("vi-VN"),
                          active: true,
                          description: (
                            <p>
                              Người thực hiện:{" "}
                              <span className="font-medium text-gray-700">
                                {applicant.reviewer}
                              </span>
                            </p>
                          ),
                        },
                      ]
                    : []),
                ]}
              />

              {applicant.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Ghi chú từ hội đồng:
                  </p>
                  <p className="text-sm text-gray-600 italic leading-relaxed">
                    "{applicant.notes}"
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* CỘT PHẢI (Main Content - Chiếm 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Thông tin cá nhân - Card Trắng hiện đại */}
            <SectionThongTinCaNhan />

            {/* 2. Hồ sơ đính kèm - Card Grid */}
            <SectionHoSoDinhKem />

            {/* 3. Thông tin cha mẹ */}
            <SectionThongTinChaMe />

            {/* 4. Thông tin sức khỏe */}
            <SectionThongTinSucKhoe />
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default HoSoTuyenSinhOne;
