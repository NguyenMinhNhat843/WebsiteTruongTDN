import React, { useState, useMemo } from "react";

// ==========================================
// 1. TYPES & INTERFACES (Khu vực định nghĩa Type)
// ==========================================

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  // Cho phép custom render nếu cần (ví dụ format ngày tháng, tiền tệ, hình ảnh)
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  // Có thể truyền thêm class tùy chọn cho table wrapper
  className?: string;
}

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

// ==========================================
// 2. PAGINATION COMPONENT (Module phân trang)
// ==========================================

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Tính toán số hiển thị (VD: Hiển thị 1 - 8 trong tổng số 20)
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 bg-white gap-4">
      <div className="flex items-center text-sm text-gray-500">
        <span>
          Đang xem{" "}
          <span className="font-semibold text-gray-900">
            {totalItems === 0 ? 0 : startItem}
          </span>{" "}
          đến <span className="font-semibold text-gray-900">{endItem}</span>{" "}
          trong tổng số{" "}
          <span className="font-semibold text-gray-900">{totalItems}</span> mục
        </span>

        <div className="ml-4 flex items-center">
          <label htmlFor="perPage" className="mr-2">
            Hiển thị:
          </label>
          <select
            id="perPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5 outline-none"
          >
            {[8, 12, 16].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalItems === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trước
        </button>
        <span className="text-sm text-gray-700 font-medium">
          Trang {totalPages === 0 ? 0 : currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN DATA TABLE COMPONENT (Module Bảng)
// ==========================================

// Sử dụng <T extends Record<string, any>> để đảm bảo T là một Object
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className = "",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Reset về trang 1 nếu thay đổi số lượng items/trang
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Tính toán data cho trang hiện tại
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  return (
    <div
      className={`relative overflow-hidden bg-white shadow-md sm:rounded-lg border border-gray-200 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={String(col.accessorKey) + index}
                  scope="col"
                  className="px-6 py-4 font-semibold"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={String(col.accessorKey) + colIndex}
                      className="px-6 py-4"
                    >
                      {col.render
                        ? col.render(row[col.accessorKey], row)
                        : String(row[col.accessorKey])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}

// ==========================================
// 4. VÍ DỤ CÁCH SỬ DỤNG (Example Usage)
// ==========================================

/* // 1. Định nghĩa Type cho Dữ liệu của bạn
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

// 2. Tạo Mock Data
const MOCK_DATA: User[] = Array.from({ length: 45 }).map((_, i) => ({
  id: i + 1,
  name: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : 'User',
  status: i % 5 === 0 ? 'Inactive' : 'Active',
}));

// 3. Sử dụng Component
export default function App() {
  // Định nghĩa cột (Có typesafe dựa trên interface User)
  const columns: Column<User>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Họ và tên', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { 
      header: 'Trạng thái', 
      accessorKey: 'status',
      // Ví dụ cách dùng custom render
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý người dùng</h1>
      <DataTable<User> data={MOCK_DATA} columns={columns} />
    </div>
  );
}
*/
