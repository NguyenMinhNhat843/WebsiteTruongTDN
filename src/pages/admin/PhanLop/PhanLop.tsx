import { Inbox, UserPlus, Users, Wand2, X } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import { usePhanLopContext } from "./PhanLopProvider";
import ButtonAction from "../../../components/ui/ButtonAction";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import { useState } from "react";

const PhanLop = () => {
  const {
    isPendingbatches,
    nganhs,
    isPendingNganhs,
    students,
    isLoadingStudents,
    selectedMajorId,
    setSelectedMajorId,
    allBatch,
    phanLop,
    isPendingPhanLop,
    selectedBatchId,
    setSelectedBatchId,
  } = usePhanLopContext();

  // State kiểm soát việc hiển thị Modal cấu hình số lượng học sinh
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [studentsPerClass, setStudentsPerClass] = useState<string>("40");
  const [errorInput, setErrorInput] = useState<string>("");

  // Chuyển allBatch đã được sort từ lớn đến nhỏ thành mảng Option chuẩn format
  const batchOptions =
    allBatch?.map((b) => ({
      value: b.id!,
      label: `${b.batchCode} (${b.startYear} - ${b.endYear})`,
    })) || [];

  // BIẾN ĐỔI DỮ LIỆU: Phẳng hóa mảng lồng nhau để render Table và tính tổng dễ dàng hơn
  const flattenedStudents = students || [];

  // Xử lý khi nhấn nút Xác nhận trên Modal
  const handleConfirmPhanLop = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(studentsPerClass);

    if (!studentsPerClass || isNaN(num) || num <= 0) {
      setErrorInput("Vui lòng nhập số học sinh hợp lệ (lớn hơn 0)");
      return;
    }

    setErrorInput("");

    // Gọi API phân lớp với tham số động từ Input
    phanLop(
      {
        body: {
          batchId: selectedBatchId!,
          studentsPerClass: num,
        },
      },
      {
        onSuccess: () => {
          alert("Phân lớp thành công! Dữ liệu sẽ được cập nhật.");
          setIsOpenModal(false); // Đóng modal sau khi thành công
        },
      },
    );
  };

  return (
    <PageShell
      title="Phân lớp tự động cho Sinh viên"
      sub="Quản lý việc phân lớp cho sinh viên dựa trên ngành và khóa đào tạo"
      icon={Users}
      renderRight={
        <ButtonAction
          variant="primary"
          size="md"
          icon={<Wand2 className="w-4 h-4" />}
          loading={isPendingPhanLop}
          disabled={isPendingPhanLop || !selectedBatchId}
          onClick={() => setIsOpenModal(true)} // Bấm vào mở Modal thay vì gọi API trực tiếp
        >
          Phân lớp
        </ButtonAction>
      }
    >
      <div className=" bg-gray-50 min-h-screen font-sans text-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Card: Cấu hình lọc */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-end">
            {/* Select Ngành */}
            <div className="flex-1 w-full">
              <SelectOption
                label="Chọn Ngành đào tạo"
                options={[
                  { value: "", label: "-- Chọn Ngành đào tạo --" },
                  ...(nganhs?.map((n) => ({
                    value: n.id,
                    label: n.majorName,
                  })) || []),
                ]}
                value={selectedMajorId || ""}
                onChange={(e) =>
                  setSelectedMajorId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full border border-slate-200 rounded-xl p-3 bg-white hover:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                labelClassName="text-sm font-semibold text-slate-700 ml-1 mb-2 block"
              />
              {isPendingNganhs && (
                <span className="text-xs text-blue-500 animate-pulse italic mt-1 block ml-1">
                  Đang tải danh sách ngành học...
                </span>
              )}
            </div>

            {/* Select Khóa */}
            <div className="flex-1 w-full">
              <SelectOption
                label="Chọn Khóa đào tạo"
                options={batchOptions}
                value={selectedBatchId || ""}
                disabled={isPendingbatches || !selectedMajorId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedBatchId(Number(e.target.value))
                }
                className="w-full border border-slate-200 rounded-xl p-3 bg-white hover:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                labelClassName="text-sm font-semibold text-slate-700 ml-1 mb-2 block"
              />
              {isPendingbatches && (
                <span className="text-xs text-slate-400 animate-pulse italic mt-1 block ml-1">
                  Đang tải danh sách khóa học...
                </span>
              )}
            </div>
          </div>

          {/* Card: Thống kê nhanh */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                Tổng sinh viên đủ điều kiện
              </p>
              <h3 className="text-5xl font-black mt-2">
                {flattenedStudents.length}
              </h3>
              <p className="text-blue-200 text-xs mt-4">
                Dữ liệu được cập nhật theo thời gian thực
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <UserPlus size={120} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main Content: Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">
                Danh sách sinh viên
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-widest font-semibold">
                  <th className="px-6 py-4 text-center w-20">STT</th>
                  <th className="px-6 py-4 text-left">Họ và Tên</th>
                  <th className="px-6 py-4 text-left">Khóa học</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingStudents ? (
                  <tr>
                    <td colSpan={3} className="py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">
                          Đang tải danh sách sinh viên...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : flattenedStudents.length > 0 ? (
                  flattenedStudents.map((st, index) => (
                    <tr
                      key={st.student.id || index}
                      className="group hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {st.student.fullName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-700 bg-blue-50 group-hover:bg-blue-100 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 transition-colors">
                          {`${st.batch.batchCode} - ${st.batch.batchName}`}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Inbox className="w-16 h-16 mb-4" strokeWidth={1} />
                        <p className="text-lg font-medium">
                          {selectedMajorId
                            ? "Không tìm thấy sinh viên nào đủ điều kiện."
                            : "Vui lòng chọn ngành để hiển thị dữ liệu."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOX POPUP (MODAL) NHẬP SỐ LƯỢNG HỌC SINH TỐI ĐA */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden transform scale-100 transition-transform">
            {/* Header Modal */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-bold text-slate-800 text-base">
                Cấu hình phân lớp
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsOpenModal(false);
                  setErrorInput("");
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleConfirmPhanLop} className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Số học sinh tối đa / lớp{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={studentsPerClass}
                  onChange={(e) => setStudentsPerClass(e.target.value)}
                  placeholder="Ví dụ: 40"
                  className={`w-full border ${errorInput ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"} rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-4 transition-all outline-none`}
                  autoFocus
                />
                {errorInput && (
                  <p className="text-xs text-red-500 font-medium ml-1 animate-pulse">
                    {errorInput}
                  </p>
                )}
              </div>

              {/* Footer Modal */}
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <ButtonAction
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpenModal(false);
                    setErrorInput("");
                  }}
                  disabled={isPendingPhanLop}
                >
                  Hủy bỏ
                </ButtonAction>
                <ButtonAction
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isPendingPhanLop}
                  disabled={isPendingPhanLop}
                >
                  Xác nhận
                </ButtonAction>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default PhanLop;
