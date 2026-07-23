import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { useHocKyContext, type HocKyDto } from './HocKyProvider'
import { useMemo, useState } from 'react'
import { $api } from '../../../api/client'
import { CreateHocKyModal } from './CreateHocKyModal'
import { Calendar, CheckCircle2, Clock, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  hocKyList: HocKyDto[]
  isHocKyListPending: boolean
  columnsAdditional?: ColumnDef<HocKyDto>[]
}

const HocKyTable = ({ hocKyList, isHocKyListPending, columnsAdditional }: Props) => {
  const { deleteHocKy, isDeleteHocKyPending } = useHocKyContext()

  const [semesterId, setSemesterId] = useState<number | null>(null)
  const { data: semesterOne } = $api.useQuery(
    'get',
    '/semesters/{id}',
    {
      params: {
        path: {
          id: semesterId!,
        },
      },
    },
    {
      enabled: semesterId !== null,
    },
  )

  const columns = useMemo<ColumnDef<HocKyDto>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Mã học kỳ',
      },
      {
        accessorKey: 'name',
        header: 'Tên học kỳ',
        cell: (info) => (
          <div
            className="flex cursor-pointer flex-col hover:text-blue-600"
            onClick={() => setSemesterId(info.row.original.id)}
          >
            <span className="font-bold text-gray-800">{info.getValue() as string}</span>
            <span className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {info.row.original.schoolYear}
            </span>
          </div>
        ),
      },
      {
        accessorFn: (row) => `${row.startDate} - ${row.endDate}`,
        id: 'duration',
        header: 'Thời gian',
        cell: (info) => (
          <div className="flex flex-col text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{new Date(info.row.original.startDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Clock size={14} className="text-gray-400" />
              <span>{new Date(info.row.original.endDate).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'isCurrent',
        header: 'Trạng thái',
        cell: (info) => {
          const isCurrent = info.getValue() as boolean
          return isCurrent ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              <CheckCircle2 size={12} /> Hiện tại
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
              Lưu trữ
            </span>
          )
        },
      },
      {
        accessorKey: 'actions',
        header: '', // Thường để trống tiêu đề cho cột thao tác
        cell: (info) => {
          const hocKy = info.row.original

          const handleDelete = async (e: React.MouseEvent) => {
            e.stopPropagation() // Chặn sự kiện click vào hàng (nếu có)

            // Sử dụng window.confirm mặc định
            const isConfirmed = window.confirm(
              `Bạn có chắc chắn muốn xóa học kỳ "${hocKy.name}" không?\nLưu ý: Hành động này không thể hoàn tác.`,
            )

            if (isConfirmed) {
              // Gọi hàm xóa truyền từ props/hook
              deleteHocKy(
                {
                  params: {
                    path: {
                      id: hocKy.id,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    toast.success('Xóa học kỳ thành công!')
                    window.location.reload()
                  },
                  onError: () => {
                    toast.error('Có lỗi xảy ra khi xóa học kỳ. Vui lòng thử lại.')
                  },
                },
              )
            }
          }

          return (
            <div className="flex justify-end pr-2">
              <button
                onClick={handleDelete}
                disabled={isDeleteHocKyPending}
                className={`rounded-lg p-2 transition-all ${
                  isDeleteHocKyPending ? 'cursor-not-allowed opacity-50' : 'group hover:bg-red-50'
                }`}
                title="Xóa học kỳ"
              >
                {isDeleteHocKyPending ? (
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                ) : (
                  <Trash2 size={16} className="text-gray-400 transition-colors group-hover:text-red-500" />
                )}
              </button>
            </div>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: hocKyList || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
  })

  if (isHocKyListPending) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="group transition-colors duration-150 hover:bg-indigo-50/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (columnsAdditional?.length || 0)}
                  className="px-6 py-10 text-center text-gray-400 italic"
                >
                  Không có dữ liệu học kỳ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateHocKyModal
        semester={semesterOne}
        isOpen={semesterId !== null}
        onClose={() => setSemesterId(null)}
      />
    </div>
  )
}

export default HocKyTable
