import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { $api } from "../../../../api/client";
import {
  useChuongTrinhKhungContext,
  type CuriculumResponseDto,
} from "../ChuongTrinhKhungProvider";
import {
  FileText,
  Building2,
  Trash2,
  GraduationCap,
  Loader2,
  Copy,
  X,
} from "lucide-react";
import type { components } from "../../../../api/v1";

interface Props {
  data: CuriculumResponseDto[];
}

export type CopyCurrculumDto = components["schemas"]["CopyCurriculumDto"];

const ChuongTrinhKhungList = ({ data }: Props) => {
  const { selectedId, setSelectedId } = useChuongTrinhKhungContext();

  // State quản lý Modal sao chép
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CuriculumResponseDto | null>(null);

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CopyCurrculumDto>();

  // API sao chép chương trình khung
  const { mutate: copyCurriculum, isPending: isCopyCurriculumPending } =
    $api.useMutation("post", "/curriculums/copy");

  // API xóa chương trình khung
  const { mutate: deleteCurriculum, isPending: isDeleteCurriculumPending } =
    $api.useMutation("delete", "/curriculums/{id}");

  // Hàm mở modal sao chép
  const handleOpenCopyModal = (
    e: React.MouseEvent,
    fw: CuriculumResponseDto,
  ) => {
    e.stopPropagation(); // 💡 Ngăn chặn chọn Card khi click nút copy
    setSelectedCurriculum(fw);
    setIsModalOpen(true);
    reset({
      sourceCurriculumId: fw.id,
      curriculumCode: `${fw.curriculumCode}_COPY`,
      curriculumName: `${fw.curriculumName} - Bản sao`,
    });
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCurriculum(null);
    reset();
  };

  // Hàm xử lý submit form sao chép
  const onCopySubmit = (formData: CopyCurrculumDto) => {
    copyCurriculum(
      {
        body: formData,
      },
      {
        onSuccess: () => {
          toast.success("Sao chép chương trình khung thành công!");
          handleCloseModal();
          // Reload để đồng bộ dữ liệu mới
          setTimeout(() => {
            window.location.reload();
          }, 800);
        },
        onError: (err) => {
          toast.error("Có lỗi xảy ra khi sao chép dữ liệu!");
          console.error(err);
        },
      },
    );
  };

  // Hàm xử lý khi nhấn nút xóa
  const handleDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation(); // 💡 Ngăn chặn chọn Card

    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa chương trình khung:\n"${name}" không?`,
    );

    if (isConfirmed) {
      deleteCurriculum(
        {
          params: {
            path: { id },
          },
        },
        {
          onSuccess: () => {
            toast.success("Xóa chương trình khung thành công!");
            if (selectedId === id) {
              setSelectedId(null);
            }
            setTimeout(() => {
              window.location.reload();
            }, 800);
          },
          onError: (err) => {
            toast.error("Có lỗi xảy ra khi xóa dữ liệu!");
            console.error(err);
          },
        },
      );
    }
  };

  const isGlobalPending = isDeleteCurriculumPending || isCopyCurriculumPending;

  return (
    <div className="w-96 shrink-0 space-y-3 p-1 relative min-h-[200px]">
      {/* Lớp phủ Spinner khi đang trong quá trình xóa/sao chép */}
      {isGlobalPending && (
        <div className="absolute inset-0 z-50 bg-slate-100/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-600 tracking-wide">
            {isDeleteCurriculumPending
              ? "Đang xóa dữ liệu..."
              : "Đang sao chép chương trình..."}
          </span>
        </div>
      )}

      {/* Trạng thái danh sách trống */}
      {data.length === 0 && (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium text-sm">
            Không có kết quả phù hợp
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Vui lòng thử lại với bộ lọc khác.
          </p>
        </div>
      )}

      {/* Danh sách Card */}
      {data.map((fw) => {
        const isSel = selectedId === fw.id;
        return (
          <button
            key={fw.id}
            disabled={isGlobalPending}
            onClick={() => setSelectedId(fw.id)}
            className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ease-in-out relative overflow-hidden group
              ${
                isSel
                  ? "border-blue-500 bg-linear-to-r from-blue-50/30 to-white shadow-md ring-1 ring-blue-500/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-px"
              }`}
          >
            {/* Thanh màu highlight nhỏ ở cạnh trái khi được chọn */}
            {isSel && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            )}

            {/* Header: Badge Hệ đào tạo, Code & Nút Hành động */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border
                  ${
                    isSel
                      ? "bg-blue-50 border-blue-200 text-blue-600"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
              >
                <GraduationCap className="w-3 h-3" />
                Hệ đào tạo: Trung cấp nghề
              </span>

              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-medium text-slate-400 bg-slate-100/60 px-1.5 py-0.5 rounded">
                  #{fw.curriculumCode}
                </span>

                {/* Nút Sao chép (Copy) */}
                <button
                  type="button"
                  disabled={isGlobalPending}
                  onClick={(e) => handleOpenCopyModal(e, fw)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                  title="Sao chép chương trình"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Nút xóa tích hợp */}
                <button
                  type="button"
                  disabled={isGlobalPending}
                  onClick={(e) => handleDelete(e, fw.id, fw.curriculumName)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                  title="Xóa chương trình"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Body: Tên chương trình */}
            <h4
              className={`text-sm font-bold leading-snug mb-2 transition-colors pr-4
              ${isSel ? "text-blue-600" : "text-slate-800 group-hover:text-blue-600"}`}
            >
              {fw.curriculumName}
            </h4>

            {/* Footer: Ngành & Tín chỉ */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-1.5 text-slate-500 max-w-[70%] truncate">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  Ngành:{" "}
                  <span className="font-medium text-slate-700">
                    {fw.major?.majorName || "Chưa cập nhật"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-semibold text-[11px]">
                <span>{fw.totalCredits}</span>
                <span className="font-normal opacity-85">tín chỉ</span>
              </div>
            </div>
          </button>
        );
      })}

      {/* ================= MODAL SAO CHÉP CHƯƠNG TRÌNH ================= */}
      {isModalOpen && selectedCurriculum && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Copy className="w-4 h-4 text-blue-500" />
                Sao chép chương trình khung
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onCopySubmit)}
              className="p-5 space-y-4"
            >
              {/* Nguồn ẩn tự động map */}
              <input type="hidden" {...register("sourceCurriculumId")} />

              {/* Tên chương trình gốc (Chỉ đọc) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Chương trình gốc
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-medium">
                  {selectedCurriculum.curriculumName}
                </div>
              </div>

              {/* Mã chương trình mới */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mã chương trình mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.curriculumCode
                      ? "border-rose-500"
                      : "border-slate-200"
                  }`}
                  placeholder="Nhập mã chương trình..."
                  {...register("curriculumCode", {
                    required: "Mã chương trình là bắt buộc",
                  })}
                />
                {errors.curriculumCode && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.curriculumCode.message}
                  </p>
                )}
              </div>

              {/* Tên chương trình mới */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tên chương trình mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    errors.curriculumName
                      ? "border-rose-500"
                      : "border-slate-200"
                  }`}
                  placeholder="Nhập tên chương trình..."
                  {...register("curriculumName", {
                    required: "Tên chương trình là bắt buộc",
                  })}
                />
                {errors.curriculumName && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    {errors.curriculumName.message}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isCopyCurriculumPending}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCopyCurriculumPending}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {isCopyCurriculumPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  Xác nhận Sao chép
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChuongTrinhKhungList;
