import { ArrowLeft } from "lucide-react";
import { getStatusBadgeLopHocPhan } from "../../components/getStatusLopHocPhan";
import { useLopHocPhanOneContext } from "../LopHocPhanOneProvider";
import { useNavigate } from "react-router-dom";
import ButtonExport from "../../../../../components/ui/ButtonExport";

const Header = () => {
  const {
    lopHocPhanDetail,
    acceptLopHocPhan,
    lopHocPhanId,
    setIsOpenModalAddStudent,
    exportExcel,
    isExportingExcel,
    setIsOpenModalImportExcel,
  } = useLopHocPhanOneContext();
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-slate-600 shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider px-2 py-0.5 bg-blue-50 rounded">
              Chi tiết học phần
            </span>
            {getStatusBadgeLopHocPhan(lopHocPhanDetail?.status)}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-1">
            {lopHocPhanDetail?.courseCode}
          </h1>
        </div>
      </div>
      <div className="flex gap-2">
        <ButtonExport
          isPending={isExportingExcel}
          onClick={() =>
            exportExcel({
              parseAs: "blob",
              params: {
                path: {
                  id: lopHocPhanId,
                },
              },
            })
          }
        />
        <button
          className="bg-white border border-slate-200 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors text-slate-700 shadow-sm"
          onClick={() => setIsOpenModalAddStudent(true)}
        >
          Thêm học sinh
        </button>
        <button
          className="bg-white border border-slate-200 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors text-slate-700 shadow-sm"
          onClick={() => setIsOpenModalImportExcel(true)}
        >
          Nhập file excel
        </button>
        {lopHocPhanDetail?.status !== "open" && (
          <button
            onClick={() =>
              acceptLopHocPhan(
                {
                  params: {
                    path: {
                      id: lopHocPhanId,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    alert("Đã chấp nhận mở lớp học phần thành công!");
                  },
                  onError: (err) => {
                    alert(
                      "Có lỗi xảy ra khi chấp nhận mở lớp học phần: " +
                        JSON.stringify(err),
                    );
                  },
                },
              )
            }
            className="bg-white border border-slate-200 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors text-slate-700 shadow-sm"
          >
            Chấp nhận mở lớp
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
