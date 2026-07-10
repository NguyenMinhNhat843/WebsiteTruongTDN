import { useState } from "react";
import { $api } from "../../../api/client";
import type { components, paths } from "../../../api/v1";
import { Trash2, Search, Loader2, Filter, Layers } from "lucide-react";
import CreateMonHocModal from "./CreateMonHoc";

export type SubjectDto = components["schemas"]["SubjectDto"];
export type QuerySubject = paths["/subjects"]["get"]["parameters"]["query"];

const MonHocList = () => {
  // State quản lý bộ lọc
  const [filters, setFilters] = useState({
    keyword: "",
    departmentId: "" as string | number,
  });

  // 2. Chuyển state lưu ID thành lưu toàn bộ object Subject được chọn để Update
  const [subjectSelected, setSubjectSelected] = useState<SubjectDto | null>(
    null,
  );
  // State quản lý trạng thái đóng/mở modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gọi API lấy danh sách phòng ban để đổ vào Bộ lọc
  const { data: departments, isLoading: isLoadingDepartments } = $api.useQuery(
    "get",
    "/departments",
  );

  // Fetch data môn học kèm điều kiện lọc
  const queryParams: QuerySubject = {
    keyword: filters.keyword || undefined,
    departmentId: filters.departmentId
      ? Number(filters.departmentId)
      : undefined,
  };

  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    refetch,
  } = $api.useQuery("get", "/subjects", {
    params: {
      query: queryParams,
    },
  });

  // API Xóa môn học
  const { mutate: deleteSubject, isPending: isDeletingSubject } =
    $api.useMutation("delete", "/subjects/{id}", {
      onSuccess: () => {
        alert("Xóa môn học thành công!");
        refetch();
      },
      onError: (error) => {
        alert("Có lỗi xảy ra khi xóa!");
        console.error(error);
      },
    });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa môn học "${name}" không?`)) {
      deleteSubject({
        params: {
          path: { id },
        },
      });
    }
  };

  const getDepartmentName = (id: number | null | undefined) => {
    if (!id || !departments) return "---";
    const dept = departments.find((d: any) => d.id === id);
    return dept ? dept.deptName : "Không xác định";
  };

  const renderSubjectType = (type: string | undefined) => {
    if (!type) return <span className="text-gray-400">---</span>;

    switch (type.toUpperCase()) {
      case "GENERAL":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Đại cương
          </span>
        );
      case "BASE_MAJOR":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            Cơ sở ngành
          </span>
        );
      case "SPECIALIZED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
            Chuyên ngành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
            {type}
          </span>
        );
    }
  };

  // 3. Hàm kích hoạt mở modal để Cập nhật
  const handleOpenEditModal = (subject: SubjectDto) => {
    setSubjectSelected(subject);
    setIsModalOpen(true);
  };

  // 4. Hàm đóng modal và dọn dẹp state sạch sẽ
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubjectSelected(null);
  };

  return (
    <div className="space-y-6 font-sans bg-[#f4f6f9] min-h-screen rounded-2xl text-base p-1">
      {/* --- Bộ Lọc --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 font-bold text-gray-700 border-b pb-3 border-gray-100">
          <Filter className="w-5 h-5 text-indigo-600" />
          <span>Điều kiện tìm kiếm</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nhập mã, tên môn học cần tìm..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, keyword: e.target.value }))
              }
              className="pl-10 pr-4 py-2.5 w-full text-base border border-gray-300 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={filters.departmentId}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  departmentId: e.target.value,
                }))
              }
              disabled={isLoadingDepartments}
              className="px-4 py-2.5 w-full text-base border border-gray-300 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-700 disabled:opacity-60 appearance-none cursor-pointer"
            >
              <option value="">-- Tất cả phòng ban --</option>
              {departments?.map((dept: any) => (
                <option key={dept.id} value={dept.id}>
                  {dept.deptName}
                </option>
              ))}
            </select>
            {isLoadingDepartments && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* --- Bảng Danh Sách Dữ Liệu --- */}
      <div className="overflow-hidden border border-gray-100 rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1150px] w-full table-fixed divide-y divide-gray-100 text-left text-base">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-sm border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold w-30">Mã môn học</th>
                <th className="px-6 py-4 font-bold w-[220px]">Tên môn học</th>
                <th className="px-6 py-4 font-bold text-center w-28">
                  Tín chỉ
                </th>
                <th className="px-6 py-4 font-bold text-center w-36">
                  Loại môn học
                </th>
                <th className="px-6 py-4 font-bold text-center w-24">
                  Lý thuyết
                </th>
                <th className="px-6 py-4 font-bold text-center w-24">
                  Thực hành
                </th>
                <th className="px-6 py-4 font-bold text-center w-24">Thi</th>
                <th className="px-6 py-4 font-bold min-w-[180px]">
                  Đơn vị quản lý
                </th>
                <th className="px-6 py-4 text-center w-28 font-bold">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {isLoadingSubjects ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                      <span className="text-base font-medium text-gray-500">
                        Đang tải danh sách môn học...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : !subjects || subjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center text-gray-500 text-base"
                  >
                    Không tìm thấy bản ghi nào hợp lệ.
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-indigo-50/40 transition-colors group"
                  >
                    <td className="px-6 py-4.5 font-mono text-sm font-bold text-gray-800">
                      {subject.subjectCode}
                    </td>
                    <td className="px-6 py-4.5">
                      {/* 5. Sự kiện Click truyền nguyên object sang hàm xử lý mở Modal */}
                      <button
                        onClick={() => handleOpenEditModal(subject)}
                        className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline text-left transition-colors cursor-pointer text-base focus:outline-none"
                      >
                        {subject.subjectName}
                      </button>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {subject.credits} TC
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      {renderSubjectType(subject.knowledgeBlock)}
                    </td>
                    <td className="px-6 py-4.5 text-center font-medium text-gray-900">
                      {subject.theoryHours}h
                    </td>
                    <td className="px-6 py-4.5 text-center font-medium text-gray-900">
                      {subject.practiceHours}h
                    </td>
                    <td className="px-6 py-4.5 text-center font-medium text-gray-950">
                      {subject.testHours}h
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span>{getDepartmentName(subject.departmentId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <button
                        disabled={isDeletingSubject}
                        onClick={() =>
                          handleDelete(subject.id, subject.subjectName)
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all inline-flex items-center disabled:opacity-40 group-hover:scale-105 cursor-pointer"
                        title="Xóa dòng này"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 6. Gọi Modal đồng bộ Tạo mới / Cập nhật --- */}
      <CreateMonHocModal
        isOpen={isModalOpen}
        initialData={subjectSelected} // Truyền dữ liệu sang (null = Create, object = Update)
        onClose={handleCloseModal}
        isPending={false} // Hoặc logic loading thêm mới từ Provider nếu cần
        onSubmit={(data, cleanResetForm) => {
          // Logic xử lý tạo mới gốc từ cha (nếu có)
          // Ví dụ: createMonHocApi(data)
          cleanResetForm();
          handleCloseModal();
          refetch();
        }}
      />
    </div>
  );
};

export default MonHocList;
