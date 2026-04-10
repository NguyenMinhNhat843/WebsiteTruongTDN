import {
  BookOpen,
  CheckCircle,
  Download,
  Mail,
  Phone,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { useQuanLyHoSoContext } from "../QuanLyHoSoProvider";
import {
  HoSoTuyenSinhOneProvider,
  useHoSoTuyenSinhOneContext,
} from "./HoSoTuyenSinhOneProvider";
import HeaderPage from "../../../../../components/ui/HeaderPage";
import InfoItem from "../../../../../components/ui/InfoItem";
import InfoItemv2 from "../../../../../components/ui/InfoItemv2";

const HoSoTuyenSinhOne = () => {
  return (
    <HoSoTuyenSinhOneProvider>
      <Inner />
    </HoSoTuyenSinhOneProvider>
  );
};

// Hiển thị timeline nhỏ gọn
const TimelineItem = ({ label, value, active }) => (
  <div className="relative pl-8">
    <div
      className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-sm ${active ? "bg-cyan-500" : "bg-gray-200"}`}
    />
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-700">{value}</p>
  </div>
);

const Inner = () => {
  const { getStatusBadge } = useQuanLyHoSoContext();
  const { applicant } = useHoSoTuyenSinhOneContext();

  if (!applicant) {
    return <div>Không tìm thấy hồ sơ</div>;
  }

  return (
    <div className="flex items-center justify-center pb-6">
      <div className="w-full">
        <HeaderPage
          title={"Hồ sơ tuyển sinh"}
          icon={<BookOpen className="w-10 h-10 text-cyan-600" />}
          sub={`Ứng viên: ${applicant.applicantName} - Đợt: ${applicant.batchLabel}`}
          className="px-6 pt-6"
        />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CỘT TRÁI (Main Content - Chiếm 2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Thông tin cá nhân - Card Trắng hiện đại */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-50">
                  <User className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-gray-800 text-lg">
                    Thông tin cá nhân
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
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
            </div>

            {/* CỘT PHẢI (Sidebar - Chiếm 1/3) */}
            <div className="space-y-6">
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

                <div className="space-y-4 relative">
                  {/* Đường line giả lập timeline */}
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-50" />

                  <TimelineItem
                    label="Ngày nộp hồ sơ"
                    value={new Date(applicant.submitDate).toLocaleDateString(
                      "vi-VN",
                    )}
                    active
                  />
                  {applicant.reviewDate && (
                    <>
                      <TimelineItem
                        label="Ngày xét duyệt"
                        value={new Date(
                          applicant.reviewDate,
                        ).toLocaleDateString("vi-VN")}
                        active
                      />
                      <div className="pl-8">
                        <p className="text-xs text-gray-400">
                          Người thực hiện:
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {applicant.reviewer}
                        </p>
                      </div>
                    </>
                  )}
                </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoSoTuyenSinhOne;
