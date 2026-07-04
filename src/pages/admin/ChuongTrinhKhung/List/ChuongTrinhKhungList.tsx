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
} from "lucide-react";

interface Props {
  data: CuriculumResponseDto[];
}

const ChuongTrinhKhungList = ({ data }: Props) => {
  const { selectedId, setSelectedId } = useChuongTrinhKhungContext();

  // API đột biến dùng để xóa chương trình khung
  const { mutate: deleteCurriculum, isPending: isDeleteCurriculumPending } =
    $api.useMutation("delete", "/curriculums/{id}");

  // Hàm xử lý khi nhấn nút xóa
  const handleDelete = (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation(); // 💡 Ngăn chặn sự kiện nổi bọt

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
            // Đợi toast hiển thị một chút rồi reload lại trang để đồng bộ dữ liệu mới
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

  return (
    // Thêm class `relative` để làm gốc tọa độ cho lớp phủ Spinner hoạt động chính xác
    <div className="w-96 shrink-0 space-y-3 p-1 relative min-h-[200px]">
      {/* Lớp phủ Spinner khi đang trong quá trình xóa dữ liệu */}
      {isDeleteCurriculumPending && (
        <div className="absolute inset-0 z-50 bg-slate-100/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-600 tracking-wide">
            Đang xóa dữ liệu...
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
            disabled={isDeleteCurriculumPending}
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

            {/* Header: Badge Hệ đào tạo, Code & Nút Xóa */}
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

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-medium text-slate-400 bg-slate-100/60 px-1.5 py-0.5 rounded">
                  #{fw.curriculumCode}
                </span>

                {/* Nút xóa tích hợp */}
                <button
                  type="button"
                  disabled={isDeleteCurriculumPending}
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
    </div>
  );
};

export default ChuongTrinhKhungList;
