import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  Download,
  HeartPulse,
  Mail,
  Phone,
  Upload,
  User,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { useQuanLyHoSoContext } from "../QuanLyHoSoProvider";
import {
  HoSoTuyenSinhOneProvider,
  useHoSoTuyenSinhOneContext,
} from "./HoSoTuyenSinhOneProvider";
import HeaderPage from "../../../../components/ui/HeaderPage";
import InfoItem from "../../../../components/ui/InfoItem";
import InfoItemv2 from "../../../../components/ui/InfoItemv2";
import { Timeline } from "../../../../components/ui/TimeLine";
import ButtonBack from "../../../../components/ui/ButtonBack";
import { useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-center p-6">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <HeaderPage
            title={"Hồ sơ tuyển sinh"}
            icon={<BookOpen className="w-10 h-10 text-cyan-600" />}
            sub={`Ứng viên: ${applicant.applicantName} - Đợt: ${applicant.batchLabel}`}
          />

          <ButtonBack
            onClick={() => navigate("/admin/tuyen-sinh/ho-so-moi")}
            className="py-3 px-6 cursor-pointer"
          />
        </div>

        <div className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI (Sidebar - Chiếm 1/3) */}
            <div className="space-y-6 sticky top-6 self-start">
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-cyan-50 border-2 border-cyan-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cyan-600">
                    {applicant.applicantName
                      .trim()
                      .split(" ")
                      .slice(-2)
                      .map((w: string) => w[0].toUpperCase())
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg leading-tight">
                    {applicant.applicantName}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {applicant.idCard}
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-gray-50">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {applicant.batchLabel}
                  </span>
                </div>
              </section>

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
                    <InfoItemv2
                      label="Năm TN"
                      value={applicant.graduationYear}
                    />
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-cyan-100 text-sm">
                      Điểm GPA trung bình:
                    </span>
                    <span className="text-2xl font-black">
                      {applicant.gpa.toFixed(1)}
                    </span>
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
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <User className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-gray-800 text-lg">
                    Thông tin cá nhân
                  </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <InfoItem
                    label="Ngày sinh"
                    value={new Date(applicant.birthDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  />
                  <InfoItem label="Giới tính" value={applicant.gender} />
                  <InfoItem label="Số CMND/CCCD" value={applicant.idCard} />
                  <InfoItem label="Địa chỉ" value={applicant.address} span2 />
                  <InfoItem
                    label="Số điện thoại"
                    value={applicant.phone}
                    icon={<Phone className="w-3.5 h-3.5" />}
                  />
                  <InfoItem
                    label="Email"
                    value={applicant.email}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />
                </div>
              </section>

              {/* 2. Hồ sơ đính kèm - Card Grid */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-gray-800 text-lg">
                    Hồ sơ đính kèm
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applicant.documents.map((doc, index) => (
                    <div
                      key={index}
                      className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                        doc.uploaded
                          ? "bg-white border-gray-100 hover:border-cyan-200"
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${doc.uploaded ? "bg-green-50 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {doc.uploaded ? (
                            <CheckCircle size={18} />
                          ) : (
                            <XCircle size={18} />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {doc.name}
                        </span>
                      </div>
                      {doc.uploaded && (
                        <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Thông tin cha mẹ */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                  <Users className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-gray-800 text-lg">
                    Thông tin cha mẹ
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cha */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                        <UserRound className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        Cha
                      </span>
                    </div>
                    <InfoItem label="Họ và tên" value={"Nguyễn Minh Cha"} />
                    <InfoItem label="Năm sinh" value={"12/01/1950"} />
                    <InfoItem label="Nghề nghiệp" value={"Nông dân"} />
                    <InfoItem
                      label="Số điện thoại"
                      value={"01234456789"}
                      icon={<Phone className="w-3.5 h-3.5" />}
                    />
                  </div>

                  {/* Mẹ */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center">
                        <UserRound className="w-4 h-4 text-pink-400" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        Mẹ
                      </span>
                    </div>
                    <InfoItem label="Họ và tên" value={"Nguyễn Minh Mẹ"} />
                    <InfoItem label="Năm sinh" value={"15/05/1955"} />
                    <InfoItem label="Nghề nghiệp" value={"Giáo viên"} />
                    <InfoItem
                      label="Số điện thoại"
                      value={"09876543210"}
                      icon={<Phone className="w-3.5 h-3.5" />}
                    />
                  </div>
                </div>
              </section>

              {/* 4. Thông tin sức khỏe */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                  <HeartPulse className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-gray-800 text-lg">
                    Thông tin sức khỏe
                  </h3>
                </div>

                {/* Chỉ số cơ bản */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Chiều cao
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {"168"}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        cm
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Cân nặng
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {"55"}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        kg
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Nhóm máu
                    </p>
                    <p className="text-2xl font-bold text-gray-800">{"—"}</p>
                  </div>
                </div>

                {/* Ghi chú bệnh lý */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Ghi chú bệnh lý / dị ứng
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-sm text-green-700">
                      Không có ghi chú bệnh lý
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSoTuyenSinhOne;
