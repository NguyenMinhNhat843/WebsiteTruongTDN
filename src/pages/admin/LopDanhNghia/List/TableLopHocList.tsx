import { useNavigate } from "react-router-dom";
import { useLopHocContext } from "../LopHocProvider";

const TableLopHocList = () => {
  const { LopHocList, isLoadingLopHocList } = useLopHocContext();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-5">Mã Lớp</th>
              <th className="py-4 px-4">Tên Lớp Học</th>
              <th className="py-4 px-4">Ngành Học</th>
              <th className="py-4 px-4">Niên Khóa</th>
              <th className="py-4 px-4">GV Chủ Nhiệm</th>
              <th className="py-4 px-4 text-center">Sĩ Số</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoadingLopHocList ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-slate-400 font-medium"
                >
                  Đang tải dữ liệu lớp học...
                </td>
              </tr>
            ) : !LopHocList || LopHocList.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-slate-400 font-medium"
                >
                  Không có dữ liệu lớp học nào được tìm thấy.
                </td>
              </tr>
            ) : (
              LopHocList.map((lopHoc) => (
                <tr
                  key={lopHoc.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* 1. Mã lớp */}
                  <td className="py-4 px-5 font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-mono">
                      {lopHoc.classCode}
                    </span>
                  </td>

                  {/* 2. Tên lớp */}
                  <td
                    onClick={() =>
                      navigate(`/admin/dao-tao/lop-hoc/${lopHoc.id}`)
                    }
                    className="py-4 px-4 font-medium text-slate-800 cursor-pointer hover:text-blue-600"
                  >
                    {lopHoc.className}
                  </td>

                  {/* 3. Ngành (ID và Name chung 1 ô) */}
                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">
                        {lopHoc.major?.majorName || "Chưa cập nhật"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {lopHoc.majorId}{" "}
                        {lopHoc.major?.majorCode &&
                          `(${lopHoc.major.majorCode})`}
                      </span>
                    </div>
                  </td>

                  {/* 4. Niên khóa (batchCode, startYear + endYear) */}
                  <td className="py-4 px-4 text-slate-600">
                    {lopHoc.batch ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs w-fit">
                          {lopHoc.batch.batchCode}
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          {lopHoc.batch.startYear} - {lopHoc.batch.endYear}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Không có thông tin khóa học
                      </span>
                    )}
                  </td>

                  {/* 5. Giáo viên chủ nhiệm (ID, Name) */}
                  <td className="py-4 px-4 text-slate-600">
                    {lopHoc.formTeacherId ? (
                      <div className="flex flex-col">
                        {/* Giả định object formTeacher có trường fullName hoặc name dựa theo Staff DTO */}
                        <span className="font-medium text-slate-800">
                          {lopHoc.formTeacher?.fullName || "-"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {lopHoc.formTeacherId}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Chưa phân công
                      </span>
                    )}
                  </td>

                  {/* 6. Sĩ số */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-semibold text-slate-900">
                        {lopHoc.studentCount ?? lopHoc.currentSize ?? 0}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Tối đa: {lopHoc.maxStudents}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER TABLE */}
      <div className="bg-slate-50/50 px-5 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Hiển thị <b>{LopHocList?.length || 0}</b> lớp học
        </span>
      </div>
    </div>
  );
};

export default TableLopHocList;
