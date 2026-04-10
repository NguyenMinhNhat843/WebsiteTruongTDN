import { AlertCircle, CheckCircle, Eye, FileCheck } from "lucide-react";
import { useQuanLyHoSoContext } from "../QuanLyHoSoProvider";
import { useNavigate } from "react-router-dom";

const TableQuanLyHoSo = () => {
  const {
    filteredApplications,
    getSystemColor,
    getStatusBadge,
    setSelectedApplication,
    setShowDetailModal,
    setShowReviewModal,
  } = useQuanLyHoSoContext();
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-cyan-600 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Mã HS
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Họ và tên
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Giới tính
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">SĐT</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Đợt tuyển sinh
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Hệ/Ngành
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                GPA
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Hồ sơ
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredApplications.map((application, index) => {
              const uploadedDocs = application.documents.filter(
                (d) => d.uploaded,
              ).length;
              const totalDocs = application.documents.length;
              const isComplete = uploadedDocs === totalDocs;

              return (
                <tr
                  key={application.id}
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {application.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {application.applicantName.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicantName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700">
                    {application.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {application.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {application.batchLabel}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm font-medium ${getSystemColor(application.system)}`}
                    >
                      {application.system}
                    </div>
                    <div className="text-xs text-gray-500">
                      {application.major}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        application.gpa >= 8
                          ? "bg-green-100 text-green-700"
                          : application.gpa >= 6.5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {application.gpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isComplete ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${isComplete ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {uploadedDocs}/{totalDocs}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          // setSelectedApplication(application);
                          // setShowDetailModal(true);
                          navigate(
                            `/admin/tuyen-sinh/ho-so-tuyen-sinh/${application.id}`,
                          );
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(application.status === "submitted" ||
                        application.status === "reviewing") && (
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowReviewModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Xét duyệt"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Không tìm thấy hồ sơ nào</p>
        </div>
      )}
    </div>
  );
};

export default TableQuanLyHoSo;
