import {
  FileCheck,
  User,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Plus,
  Upload,
} from "lucide-react";
import {
  admissionBatches,
  QuanLyHoSoProvider,
  useQuanLyHoSoContext,
} from "./QuanLyHoSoProvider";
import HeaderPage from "../../../../components/ui/HeaderPage";
import BatchStatCard from "./components/BatchStatCard";
import OverviewStat from "./components/OverviewStat";
import FilterSection from "./components/FilterSection";
import SystemStatCard from "./components/SystemStatCard";
import TableQuanLyHoSo from "./TableQuanLyHoSo/TableQuanLyHoSo";

const majors = {
  "Trung cấp nghề": [
    "Công nghệ kỹ thuật ô tô",
    "Kỹ thuật hàn",
    "Điện công nghiệp",
    "Cơ khí chế tạo",
    "Kỹ thuật xây dựng",
  ],
  "Sơ cấp nghề": [
    "May công nghiệp",
    "Nấu ăn",
    "Điện dân dụng",
    "Sửa chữa điện tử",
    "Làm vườn",
  ],
  "Đại học liên kết": [
    "Quản trị kinh doanh",
    "Kế toán",
    "Công nghệ thông tin",
    "Marketing",
  ],
  "Hệ 9+": ["Điện tử công nghiệp", "Cơ khí ô tô", "Tin học ứng dụng"],
};

const AdmissionApplication = () => {
  return (
    <QuanLyHoSoProvider>
      <Inner />
    </QuanLyHoSoProvider>
  );
};

function Inner() {
  const {
    batchStats,
    handleSubmit,
    selectedApplication,
    setFormData,
    setSelectedApplication,
    setShowRegisterModal,
    setShowReviewModal,
    showRegisterModal,
    showReviewModal,
    systemStats,
    formData,
  } = useQuanLyHoSoContext();

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50">
      <div className="max-w-400 mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <HeaderPage
            title="Quản lý hồ sơ tuyển sinh"
            sub="Xem, xét duyệt và thống kê hồ sơ đăng ký tuyển sinh"
            renderLeft={
              <div className="p-3 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
            }
          />
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            Tiếp nhận hồ sơ mới
          </button>
        </div>

        {/* Thống kê tổng quan */}
        <OverviewStat />

        {/* Thống kê theo đợt và hệ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Thống kê theo đợt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Thống kê theo đợt tuyển sinh
            </h3>
            <div className="space-y-3">
              {batchStats.slice(0, 3).map((stat, index) => (
                <BatchStatCard key={index} stat={stat} />
              ))}
            </div>
          </div>

          {/* Thống kê theo hệ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              Thống kê theo hệ đào tạo
            </h3>
            <div className="space-y-3">
              {systemStats.map((stat, index) => (
                <SystemStatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <FilterSection />

        {/* Bảng danh sách hồ sơ */}
        <TableQuanLyHoSo />

        {/* Modal tiếp nhận hồ sơ mới */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-linear-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Tiếp Nhận Hồ Sơ Mới</h2>
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Thông tin cá nhân */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <User className="w-5 h-5 text-cyan-600" />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nhập họ và tên"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CMND/CCCD <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.idCard}
                        onChange={(e) =>
                          setFormData({ ...formData, idCard: e.target.value })
                        }
                        placeholder="Nhập số CMND/CCCD"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Nhập email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Nhập địa chỉ"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin đăng ký */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <BookOpen className="w-5 h-5 text-cyan-600" />
                    Thông tin đăng ký
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đợt tuyển sinh <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.batch}
                        onChange={(e) =>
                          setFormData({ ...formData, batch: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        {admissionBatches.slice(1).map((batch) => (
                          <option key={batch.value} value={batch.value}>
                            {batch.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hệ đào tạo <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.system}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            system: e.target.value,
                            major: "",
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="Trung cấp nghề">Trung cấp nghề</option>
                        <option value="Sơ cấp nghề">Sơ cấp nghề</option>
                        <option value="Đại học liên kết">
                          Đại học liên kết
                        </option>
                        <option value="Hệ 9+">Hệ 9+</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngành đăng ký <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.major}
                        onChange={(e) =>
                          setFormData({ ...formData, major: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Chọn ngành</option>
                        {majors[formData.system as keyof typeof majors]?.map(
                          (major) => (
                            <option key={major} value={major}>
                              {major}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trường đã học
                      </label>
                      <input
                        type="text"
                        value={formData.previousSchool}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            previousSchool: e.target.value,
                          })
                        }
                        placeholder="Tên trường"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Năm tốt nghiệp
                      </label>
                      <input
                        type="text"
                        value={formData.graduationYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            graduationYear: e.target.value,
                          })
                        }
                        placeholder="VD: 2023"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm GPA
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.gpa}
                        onChange={(e) =>
                          setFormData({ ...formData, gpa: e.target.value })
                        }
                        placeholder="VD: 7.5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload hồ sơ */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <Upload className="w-5 h-5 text-cyan-600" />
                    Tải lên hồ sơ
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Kéo thả file hoặc click để chọn
                    </p>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ: PDF, JPG, PNG (Tối đa 10MB/file)
                    </p>
                    <div className="mt-4 text-xs text-gray-600 text-left max-w-md mx-auto">
                      <p className="font-semibold mb-2">Hồ sơ cần thiết:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Bằng tốt nghiệp (bản sao công chứng)</li>
                        <li>Học bạ (bản sao công chứng)</li>
                        <li>Giấy khai sinh (bản sao)</li>
                        <li>CMND/CCCD (bản sao)</li>
                        <li>Ảnh 3x4 (6 ảnh)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                  >
                    Tiếp nhận hồ sơ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xét duyệt */}
        {showReviewModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Xét Duyệt Hồ Sơ</h2>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedApplication(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-cyan-100">
                  Mã hồ sơ: {selectedApplication.id}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">Thí sinh:</span>{" "}
                      <span className="font-medium">
                        {selectedApplication.applicantName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngành:</span>{" "}
                      <span className="font-medium">
                        {selectedApplication.major}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">GPA:</span>{" "}
                      <span className="font-bold text-cyan-600">
                        {selectedApplication.gpa.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú xét duyệt
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập ghi chú..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      alert(`Từ chối hồ sơ ${selectedApplication.id}`);
                      setShowReviewModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Không đạt
                  </button>
                  <button
                    onClick={() => {
                      alert(`Phê duyệt hồ sơ ${selectedApplication.id}`);
                      setShowReviewModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Đạt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdmissionApplication;
