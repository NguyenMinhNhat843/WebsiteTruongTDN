import { useLopHocContext } from "./LopHocProvider";
import {
  BookOpen,
  AlertCircle,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAppContext } from "../../../AppProvider";
import ButtonAction from "../../../components/ui/ButtonAction";
import SelectSearchInput from "../../../components/ui/Form/SelectInput";

interface ModalCreateClassSubjectProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateClassSubject = ({
  isOpen,
  onClose,
}: ModalCreateClassSubjectProps) => {
  const { currentSemester } = useAppContext();
  const {
    generateLopHocPhan,
    isGeneratingLopHocPhan,
    idLopHocNumber,
    subjectsData,
    isLoadingSubjectData,
    semesterIdSelected,
    setSemesterIdSelected,
  } = useLopHocContext();

  const { hocKysData, isHocKysLoading } = useAppContext();
  const hocKyOptions = hocKysData.map((hocKy) => ({
    value: hocKy.id,
    label: hocKy.name,
  }));

  if (!isOpen) return null;

  const handleGenLopHocPhan = () => {
    const targetSemesterId = semesterIdSelected || currentSemester?.id;
    if (!targetSemesterId) {
      alert("Vui lòng chọn hoặc xác định học kỳ hiện tại!");
      return;
    }

    generateLopHocPhan(
      {
        params: {
          query: {
            semesterId: targetSemesterId,
            classId: idLopHocNumber,
          },
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (res: any) => {
          alert(res.message || "Sinh dữ liệu môn học thành công!");
          onClose();
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          alert(error.message || "Đã có lỗi xảy ra khi sinh dữ liệu môn học.");
        },
      },
    );
  };

  // Tính toán số lượng lớp thực tế sẽ được khởi tạo mới (bỏ qua các lớp đã tồn tại)
  const NewCoursesToCreateCount =
    subjectsData?.filter((item) => !item.isExisted).length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ phía sau */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={!isGeneratingLopHocPhan ? onClose : undefined}
      />

      {/* Nội dung Modal chính */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border 
      border-slate-100 flex flex-col max-h-[85vh] transform transition-all overflow-hidden 
      animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header của Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Sinh Dữ liệu môn học theo chương trình khung đào tạo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kiểm tra danh sách các lớp học phần dự kiến trước khi lưu vào hệ
              thống.
            </p>
          </div>
          <button
            disabled={isGeneratingLopHocPhan}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 
            transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Nội dung chính bên trong Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Badge thông tin học kỳ áp dụng */}
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Học kỳ áp dụng:
            </span>
            <SelectSearchInput
              options={hocKyOptions}
              value={semesterIdSelected ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setSemesterIdSelected(val !== "" ? Number(val) : null);
              }}
              isLoading={isHocKysLoading}
              className="w-48"
              error={undefined}
            />
          </div>

          {/* Tiêu đề danh sách môn */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen size={16} className="text-indigo-500" />
              Cấu trúc lớp học phần dự kiến ({subjectsData?.length || 0})
            </span>
            {subjectsData && subjectsData.length > 0 && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                Sẽ tạo mới: {NewCoursesToCreateCount} lớp
              </span>
            )}
          </div>

          {/* Khối hiển thị danh sách môn học hoặc trạng thái loading */}
          {isLoadingSubjectData ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-[76px] bg-slate-100 rounded-xl animate-pulse w-full"
                />
              ))}
            </div>
          ) : !subjectsData || subjectsData.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 px-4 text-center 
            border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50"
            >
              <AlertCircle size={32} className="text-amber-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Không tìm thấy môn học nào
              </p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Vui lòng cấu hình khung chương trình đào tạo cho học kỳ này
                trước khi thực hiện xem trước.
              </p>
            </div>
          ) : (
            <div
              className="border border-slate-200/80 rounded-xl overflow-hidden 
            shadow-2xs divide-y divide-slate-100 max-h-85 overflow-y-auto"
            >
              {subjectsData.map((item) => (
                <div
                  key={item.subjectId}
                  className={`flex flex-col md:flex-row md:items-center justify-between 
                    p-3.5 gap-2 transition-colors ${
                      item.isExisted
                        ? "bg-slate-50/60 opacity-75"
                        : "bg-white hover:bg-slate-50/40"
                    }`}
                >
                  {/* Cột trái: Tên môn & Cấu trúc lớp học phần sẽ sinh */}
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800">
                        {item.subjectName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 uppercase">
                        {item.subjectCode}
                      </span>
                    </div>
                  </div>

                  {/* Cột phải: Trạng thái Tín chỉ & Check trùng lớp */}
                  <div className="flex md:flex-col justify-between md:justify-center items-end gap-2 min-w-30">
                    <div
                      className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-md border 
                    border-slate-200 shadow-3xs"
                    >
                      {item.credits} Tín chỉ
                    </div>

                    {item.isExisted ? (
                      <span
                        className="flex items-center gap-1 text-[11px] font-bold 
                      text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full select-none"
                      >
                        <AlertTriangle size={12} />
                        Đã có (Bỏ qua)
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 
                      bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full select-none"
                      >
                        <CheckCircle2 size={12} />
                        Hợp lệ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thanh thao tác dưới chân Modal */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <ButtonAction
            variant="outline"
            label="Hủy bỏ"
            disabled={isGeneratingLopHocPhan}
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border-slate-200 hover:bg-white"
          />

          <ButtonAction
            variant="primary"
            label={
              NewCoursesToCreateCount === 0
                ? "Không có lớp mới"
                : "Sinh dữ liệu"
            }
            icon={<Cpu size={16} />}
            loading={isGeneratingLopHocPhan}
            disabled={
              isLoadingSubjectData ||
              !subjectsData ||
              subjectsData.length === 0 ||
              NewCoursesToCreateCount === 0
            }
            onClick={handleGenLopHocPhan}
            className="px-5 py-2 text-sm font-bold shadow-sm shadow-indigo-100"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalCreateClassSubject;
