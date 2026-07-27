import { useMemo, useState, useEffect } from 'react'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import { Calendar, Hash, Building2, User, Eye, Search, X } from 'lucide-react'
import { useQuanLyNguoiDungContext, type StaffDto } from '../QuanLyNguoiDungContext'
import PageShell from '../../../../components/ui/PageShell'
import CreateNhanVien from './CreateNhanVien'
import { useNavigate } from 'react-router-dom'
import ButtonAction from '../../../../components/ui/ButtonAction'
import { UserRoleViMap, type EnumRoleUser } from '../../../../api/enum'

const columnHelper = createColumnHelper<StaffDto>()

const QuanLyNhanVienList = () => {
  const { staffs, isPendingStaffs, openModalCreate, setOpenModalCreate, search, setSearch, setFilters } =
    useQuanLyNguoiDungContext()
  const navigate = useNavigate()

  // State cục bộ cho ô Input tránh render lại toàn bộ trang khi gõ phím
  const [localSearch, setLocalSearch] = useState(search)

  // Hiệu ứng Debounce: Chờ người dùng gõ xong 350ms mới cập nhật context để gọi API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(localSearch)
      // Reset về trang 1 khi tìm kiếm danh sách mới
      setFilters((prev) => ({ ...prev, page: 1 }))
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [localSearch, setSearch, setFilters])

  // Đồng bộ ngược lại nếu search bị reset từ bên ngoài
  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: () => (
          <span className="flex items-center gap-2">
            <Hash size={14} /> ID
          </span>
        ),
        cell: (info) => <span className="font-medium text-slate-500">#{info.getValue()}</span>,
      }),
      columnHelper.accessor('fullName', {
        header: 'Họ và tên',
        cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span>,
      }),
      columnHelper.accessor('staffCode', {
        header: 'Mã NV',
        cell: (info) => <span className="font-bold text-slate-700">{info.getValue()}</span>,
      }),
      columnHelper.accessor('employeeRole', {
        header: 'Vai trò',
        cell: (info) => {
          const rawRole = info.getValue()?.toLowerCase() as EnumRoleUser

          // Định nghĩa màu sắc tương ứng cho từng vai trò
          const colors: Record<EnumRoleUser, string> = {
            admin: 'bg-amber-50 text-amber-600 border-amber-100',
            teacher: 'bg-blue-50 text-blue-600 border-blue-100',
            staff: 'bg-rose-50 text-rose-600 border-rose-100',
            student: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          }

          const badgeColor = colors[rawRole] || 'bg-slate-50 text-slate-400 border-slate-100'
          const roleLabel = UserRoleViMap[rawRole] || 'Chưa xác định'

          return (
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${badgeColor}`}>
              {roleLabel}
            </span>
          )
        },
      }),
      columnHelper.accessor('department.deptName', {
        header: () => (
          <span className="flex items-center gap-2">
            <Building2 size={14} /> Phòng ban
          </span>
        ),
        cell: (info) => <span className="text-sm font-medium text-slate-600">{info.getValue() || '-'}</span>,
      }),
      columnHelper.accessor('createdAt', {
        header: () => (
          <span className="flex items-center gap-2">
            <Calendar size={14} /> Ngày tạo
          </span>
        ),
        cell: (info) => {
          const dateValue = info.getValue()
          return (
            <span className="text-sm font-medium text-slate-500">
              {dateValue ? new Date(dateValue).toLocaleDateString('vi-VN') : '-'}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="block text-center">Thao tác</span>,
        cell: (info) => (
          <div className="flex justify-center">
            <ButtonAction
              variant="outline"
              title="Xem chi tiết"
              icon={<Eye size={16} className="hover:text-blue-600" />}
              onClick={() => navigate(`/admin/users/${info.row.original.staffCode}`)}
            />
          </div>
        ),
      }),
    ],
    [navigate],
  )

  const table = useReactTable({
    data: staffs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <PageShell
      title="Quản lý nhân viên"
      icon={User}
      renderRight={
        <button
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          onClick={() => setOpenModalCreate(true)}
        >
          + Thêm nhân viên
        </button>
      }
    >
      <div className="flex w-full flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Thanh Tìm Kiếm Đẹp Mắt tông giáo dục */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm theo họ tên, mã nhân viên..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-10 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
              type="button"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Khu vực Bảng */}
        <div className="w-full overflow-hidden rounded-xl border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-slate-200 bg-slate-50/75">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isPendingStaffs ? (
                  /* Skeleton Loading */
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 w-full rounded-lg bg-slate-100"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="group transition-colors hover:bg-blue-50/10">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm text-slate-600">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  /* Không có dữ liệu */
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center font-medium text-slate-400 italic">
                      {localSearch.trim() !== '' ? (
                        <span>
                          Không tìm thấy kết quả khớp với từ khóa "
                          <strong className="text-slate-600 not-italic">{localSearch}</strong>"
                        </span>
                      ) : (
                        'Không có dữ liệu nhân viên nào trong danh sách.'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tổng kết dữ liệu */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-medium text-slate-500">
            <span>
              Hiển thị <strong className="text-slate-800">{staffs?.length || 0}</strong> nhân sự trong hệ
              thống
            </span>
          </div>
        </div>
      </div>

      <CreateNhanVien isOpen={openModalCreate} onClose={() => setOpenModalCreate(false)} />
    </PageShell>
  )
}

export default QuanLyNhanVienList
