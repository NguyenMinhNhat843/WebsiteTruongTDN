import { BookOpen, Upload, User, XCircle } from "lucide-react";
import { admissionBatches, useQuanLyHoSoContext } from "./QuanLyHoSoProvider";
import Input from "../../../components/ui/Form/Input";
import DateInput from "../../../components/ui/Form/DateInput";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import { majors } from "./mockData";

const CreateHoSoTuyenSinh = () => {
  const { handleSubmit, setFormData, setShowRegisterModal, formData } =
    useQuanLyHoSoContext();
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
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

        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Thông tin cá nhân */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
              <User className="w-5 h-5 text-cyan-600" />
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Họ và tên"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập họ và tên"
                containerClassName="col-span-2"
                require
              />
              <DateInput
                label="Ngày sinh"
                type="date"
                required={true}
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    birthDate: e.target.value,
                  })
                }
              />
              <SelectOption
                label="Giới tính"
                options={[
                  { label: "Name", value: "nam" },
                  { label: "Nữ", value: "nu" },
                ]}
                require
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              <Input
                label="CMND/CCCD"
                require
                value={formData.idCard}
                onChange={(e) =>
                  setFormData({ ...formData, idCard: e.target.value })
                }
                placeholder="Nhập số CMND/CCCD"
              />
              <Input
                label="Số điện thoại"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Nhập email"
              />
              <Input
                label="Địa chỉ"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>

          {/* Thông tin đăng ký */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              Thông tin đăng ký
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <SelectOption
                label="Đợt tuyển sinh"
                require
                options={admissionBatches.slice(1)}
                value={formData.batch}
                onChange={(e) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
              />
              <SelectOption
                label="Hệ đào tạo"
                require
                options={[
                  { value: "Trung cấp nghề", label: "Trung cấp nghề" },
                  { value: "Sơ cấp nghề", label: "Sơ cấp nghề" },
                  { value: "Đại học liên kết", label: "Đại học liên kết" },
                  { value: "Hệ 9+", label: "Hệ 9+" },
                ]}
                value={formData.system}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    system: e.target.value,
                    major: "",
                  })
                }
              />
              <SelectOption
                label="Ngành đăng ký"
                require
                value={formData.major}
                onChange={(e) =>
                  setFormData({ ...formData, major: e.target.value })
                }
                options={majors[formData.system as keyof typeof majors]?.map(
                  (major) => ({ value: major, label: major }),
                )}
              />
              <Input
                label="Trường đã học"
                value={formData.previousSchool}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    previousSchool: e.target.value,
                  })
                }
                placeholder="Tên trường"
              />
              <Input
                label="Năm tốt nghiệp"
                value={formData.graduationYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    graduationYear: e.target.value,
                  })
                }
                placeholder="VD: 2023"
              />
              <Input
                label="Điểm GPA"
                value={formData.gpa}
                onChange={(e) =>
                  setFormData({ ...formData, gpa: e.target.value })
                }
                placeholder="VD: 7.5"
              />
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
        </div>
        {/* Nút thao tác */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowRegisterModal(false)}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
          >
            Tiếp nhận hồ sơ
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateHoSoTuyenSinh;
