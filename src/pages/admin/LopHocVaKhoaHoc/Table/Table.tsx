import Badge from "../../../../components/ui/Badge";
import Pagination from "../../../../components/ui/Pagination";
import ProgressBar from "../../../../components/ui/ProgressBar";
import { HE_BADGE, PAGE_SIZE, STATUS_BADGE } from "../constants";
import { useLopHocVaKhoaHocContext } from "../LopHocVaKhoaHocProvider";
import { HE_DAO_TAO } from "../mockData";

const Table = () => {
  const { pageData, setDetail, setPage, totalPages, page, filtered } =
    useLopHocVaKhoaHocContext();
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 whitespace-nowrap w-28">
                Mã lớp
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                Tên lớp
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 whitespace-nowrap">
                Hệ đào tạo
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 whitespace-nowrap">
                Niên khóa
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                Ngành
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 whitespace-nowrap">
                Sĩ số
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 w-28">
                Lấp đầy
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                Trạng thái
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                GVCN
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r) => (
              <tr
                key={r.ma}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">
                  {r.ma}
                </td>
                <td className="px-4 py-3 max-w-50 truncate font-medium text-gray-800">
                  {r.ten}
                </td>
                <td className="px-4 py-3">
                  <Badge className={HE_BADGE[r.he]}>{HE_DAO_TAO[r.he]}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{r.khoa}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {r.nganh}
                </td>
                <td className="px-4 py-3 tabular-nums text-gray-700">
                  {r.siso}/{r.max}
                </td>
                <td className="px-4 py-3">
                  <ProgressBar value={r.siso} max={r.max} />
                </td>
                <td className="px-4 py-3">
                  <Badge className={STATUS_BADGE[r.status]}>{r.status}</Badge>
                </td>
                <td
                  className="px-4 py-3 text-xs text-gray-400 max-w-27.5 truncate"
                  title={r.gvcn}
                >
                  {r.gvcn}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setDetail(r)}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      Xem
                    </button>
                    <button className="px-2.5 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                      Sửa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-gray-400 text-sm"
                >
                  Không tìm thấy lớp học nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        pageSize={PAGE_SIZE}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={totalPages * PAGE_SIZE}
      />
    </div>
  );
};

export default Table;
