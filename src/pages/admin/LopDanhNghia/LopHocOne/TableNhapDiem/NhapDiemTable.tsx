import { useMemo, useState, useEffect } from 'react'
import { type ClassSubjectGrade } from '../LopHocOneProvider'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { RefreshCw, Save, Loader2 } from 'lucide-react'
import ButtonAction from '../../../../../components/ui/ButtonAction'
import ButtonExport from '../../../../../components/ui/ButtonExport'
import { calculateGrades, getStickyClass, handleKeyDown } from './helper'
import { downloadFromBlob } from '../../../../../util/download'
import { useNhapDiemContext } from './NhapDiemProvider'
import { toast } from 'sonner'

// Định nghĩa kiểu dữ liệu chuẩn cho hàng trong bảng
export interface GradeRow {
  stt: number
  studentId: number
  tenHs: string
  maHs: string
  ngaySinh: string
  kttx1: number | null
  kttx2: number | null
  kttx3: number | null
  ktdk1: number | null
  ktdk2: number | null
  ktdk3: number | null
  ktdk4: number | null
  diemKiemTra1: number | null
  diemKiemTra2: number | null
  diemTB: number | null
  diemTongKet1: number | null
  diemTongKet2: number | null
  diemChu: string
  diemHe4: number | null
  diemYThuc: number | null
  diemChuyenMon: number | null
  diemBaoCao: number | null
}

const columnHelper = createColumnHelper<GradeRow>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGradeLetterAndScale4 = (diemTK1: any, diemTK2: any) => {
  const rawGrade = diemTK2 !== null && diemTK2 !== undefined && diemTK2 !== '' ? diemTK2 : diemTK1

  if (rawGrade === null || rawGrade === undefined || rawGrade === '' || rawGrade === '-') {
    return { diemChu: '-', diemHe4: null }
  }

  const targetGrade = parseFloat(rawGrade)

  if (isNaN(targetGrade)) {
    return { diemChu: '-', diemHe4: null }
  }

  if (targetGrade >= 8.5) return { diemChu: 'A', diemHe4: 4.0 }
  if (targetGrade >= 7.0) return { diemChu: 'B', diemHe4: 3.0 }
  if (targetGrade >= 5.5) return { diemChu: 'C', diemHe4: 2.0 }
  if (targetGrade >= 4.0) return { diemChu: 'D', diemHe4: 1.0 }
  return { diemChu: 'F', diemHe4: 0.0 }
}

// Hàm tính toán điểm trung bình riêng cho thực tập
const calculateThucTapGrade = (row: Partial<GradeRow>): number | null => {
  const yThuc = row.diemYThuc ?? 0
  const chuyenMon = row.diemChuyenMon ?? 0
  const baoCao = row.diemBaoCao ?? 0

  // Nếu cả 3 điểm đều chưa nhập thì trả về null
  if (row.diemYThuc === null && row.diemChuyenMon === null && row.diemBaoCao === null) {
    return null
  }

  return parseFloat(((yThuc + chuyenMon + baoCao) / 3).toFixed(2))
}

const NhapDiem = () => {
  const {
    exportExcel,
    isExportingExcel,
    isPendingSaveGradeTable,
    saveGradeTable,
    classSubject,
    isClassSubjectLoading,
    refetchClassSubject,
    baseClass,
  } = useNhapDiemContext()

  // Xác định xem đây có phải là lớp thực tập hay không
  // (Bạn có thể lấy từ lopHocDetail hoặc classSubject tùy thuộc vào schema của bạn)
  const isThucTap = classSubject?.subject?.isThucTap || false

  // State quản lý danh sách điểm cục bộ
  const [tableData, setTableData] = useState<GradeRow[]>([])

  // Đồng bộ hóa dữ liệu từ Context vào State
  useEffect(() => {
    if (classSubject?.gradeStudents) {
      const initialData = classSubject.gradeStudents.map((regis: ClassSubjectGrade, index: number) => {
        const baseRow = {
          stt: index + 1,
          studentId: regis.studentId || regis.student?.id || 0,
          tenHs: regis.student?.fullName ?? 'N/A',
          maHs: regis.student?.studentCode ?? 'N/A',
          ngaySinh: regis.student?.dob ? new Date(regis.student.dob).toLocaleDateString('vi-VN') : '-',
          kttx1: regis.kttx1 ?? null,
          kttx2: regis.kttx2 ?? null,
          kttx3: regis.kttx3 ?? null,
          ktdk1: regis.ktdk1 ?? null,
          ktdk2: regis.ktdk2 ?? null,
          ktdk3: regis.ktdk3 ?? null,
          ktdk4: regis.ktdk4 ?? null,
          diemKiemTra1: regis.diemKiemTra1 ?? null,
          diemKiemTra2: regis.diemKiemTra2 ?? null,
          diemYThuc: regis.diemYThuc ?? null,
          diemChuyenMon: regis.diemChuyenMon ?? null,
          diemBaoCao: regis.diemBaoCao ?? null,
        }

        let finalRow = { ...baseRow } as GradeRow

        if (isThucTap) {
          // Logic tính điểm cho thực tập
          finalRow.diemTB = calculateThucTapGrade(baseRow)
          // Có thể gán điểm tổng kết bằng điểm TB nếu cần xét điểm chữ/hệ 4
          finalRow.diemTongKet1 = finalRow.diemTB
          finalRow.diemTongKet2 = null
        } else {
          // Logic tính điểm thông thường
          const calculated = calculateGrades(baseRow)
          finalRow = { ...finalRow, ...calculated }
        }

        // Tính toán thêm Điểm chữ & Điểm hệ 4 dựa trên điểm tổng kết vừa tính được
        const gradeScale = getGradeLetterAndScale4(
          finalRow.diemTongKet1 ?? null,
          finalRow.diemTongKet2 ?? null,
        )

        return { ...finalRow, ...gradeScale } as GradeRow
      })
      setTableData(initialData)
    }
  }, [classSubject, isThucTap])

  // Hàm xử lý khi người dùng thay đổi điểm số trong các ô input
  const handleCellChange = (rowIndex: number, columnId: keyof GradeRow, value: string) => {
    setTableData((oldData) =>
      oldData.map((row, index) => {
        if (index !== rowIndex) return row

        let updatedValue: number | null = null

        if (value !== '') {
          const parsed = parseFloat(value)
          if (isNaN(parsed) || parsed < 0 || parsed > 10) return row
          updatedValue = parsed
        }

        const updatedRow = { ...row, [columnId]: updatedValue }
        let finalRow = { ...updatedRow }

        if (isThucTap) {
          // Tính lại điểm TB thực tập khi thay đổi ô nhập
          finalRow.diemTB = calculateThucTapGrade(updatedRow)
          finalRow.diemTongKet1 = finalRow.diemTB
        } else {
          // Tính lại điểm thường
          const calculated = calculateGrades(updatedRow)
          finalRow = { ...finalRow, ...calculated }
        }

        // Tính lại Điểm chữ và Hệ 4 sau khi có điểm tổng kết mới
        const gradeScale = getGradeLetterAndScale4(
          finalRow.diemTongKet1 ?? null,
          finalRow.diemTongKet2 ?? null,
        )

        return { ...finalRow, ...gradeScale }
      }),
    )
  }

  const renderInputCell = (rowIndex: number, columnId: keyof GradeRow, value: number | null) => {
    return (
      <input
        type="number"
        value={value ?? ''}
        min={0}
        max={10}
        onChange={(e) => handleCellChange(rowIndex, columnId, e.target.value)}
        className="h-full min-h-[38px] w-full [appearance:textfield] border-0 bg-transparent px-2 text-center font-medium text-slate-800 transition-all focus:bg-blue-50/30 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="-"
      />
    )
  }

  // Định nghĩa cấu trúc cột động dựa trên điều kiện `isThucTap`
  const columns = useMemo(() => {
    // Các cột chung luôn xuất hiện
    const baseColumns = [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: (info) => <span className="font-medium text-slate-500">{info.getValue()}</span>,
      }),
      columnHelper.accessor('tenHs', {
        header: 'Họ và Tên',
        cell: (info) => (
          <div className="px-2 py-2 text-left">
            <div className="font-semibold text-slate-900">{info.getValue()}</div>
            <div className="font-mono text-xs text-slate-400">{info.row.original.maHs}</div>
          </div>
        ),
      }),
      columnHelper.accessor('ngaySinh', {
        header: 'Ngày sinh',
        cell: (info) => <span className="font-mono text-slate-600">{info.getValue()}</span>,
      }),
    ]

    if (isThucTap) {
      // Cột dành riêng cho giao diện Thực Tập
      return [
        ...baseColumns,
        columnHelper.accessor('diemYThuc', {
          header: 'Điểm Ý Thức',
          cell: (info) => renderInputCell(info.row.index, 'diemYThuc', info.getValue()),
        }),
        columnHelper.accessor('diemChuyenMon', {
          header: 'Điểm Chuyên Môn',
          cell: (info) => renderInputCell(info.row.index, 'diemChuyenMon', info.getValue()),
        }),
        columnHelper.accessor('diemBaoCao', {
          header: 'Điểm Báo Cáo',
          cell: (info) => renderInputCell(info.row.index, 'diemBaoCao', info.getValue()),
        }),
        columnHelper.accessor('diemTongKet1', {
          header: 'Điểm Tổng kết',
          cell: (info) => (
            <span className="block min-w-11.25 rounded-md bg-blue-50 px-2 py-1 text-center font-bold text-blue-600">
              {info.getValue() !== null ? info.getValue()?.toFixed(1) : '-'}
            </span>
          ),
        }),
      ]
    }

    // Các cột cũ dành cho môn học bình thường
    return [
      ...baseColumns,
      columnHelper.group({
        id: 'kiemTraThuongXuyen',
        header: 'Kiểm tra thường xuyên',
        columns: (['kttx1', 'kttx2', 'kttx3'] as const).map((id, idx) =>
          columnHelper.accessor(id, {
            header: `Lần ${idx + 1}`,
            cell: (info) => renderInputCell(info.row.index, id, info.getValue()),
          }),
        ),
      }),
      columnHelper.group({
        id: 'kiemTraDinhKy',
        header: 'Kiểm tra định kỳ',
        columns: (['ktdk1', 'ktdk2', 'ktdk3', 'ktdk4'] as const).map((id, idx) =>
          columnHelper.accessor(id, {
            header: `Lần ${idx + 1}`,
            cell: (info) => renderInputCell(info.row.index, id, info.getValue()),
          }),
        ),
      }),
      columnHelper.accessor('diemTB', {
        header: 'Điểm TB',
        cell: (info) => (
          <span className="block min-w-11.25 rounded-md bg-blue-50 px-2 py-1 text-center font-bold text-blue-600">
            {info.getValue() !== null ? info.getValue()?.toFixed(1) : '-'}
          </span>
        ),
      }),
      columnHelper.group({
        id: 'diemKiemTraGroup',
        header: 'Điểm Kiểm tra',
        columns: [
          columnHelper.accessor('diemKiemTra1', {
            header: 'Lần 1',
            cell: (info) => renderInputCell(info.row.index, 'diemKiemTra1', info.getValue()),
          }),
          columnHelper.accessor('diemKiemTra2', {
            header: 'Lần 2',
            cell: (info) => renderInputCell(info.row.index, 'diemKiemTra2', info.getValue()),
          }),
        ],
      }),
      columnHelper.group({
        id: 'diemTongKetGroup',
        header: 'Điểm Tổng kết',
        columns: [
          columnHelper.accessor('diemTongKet1', {
            header: 'Lần 1',
            cell: (info) => (
              <span className="block min-w-11.25 rounded-md bg-emerald-50 px-2 py-1 text-center font-bold text-emerald-600">
                {info.getValue() !== null ? info.getValue()?.toFixed(1) : '-'}
              </span>
            ),
          }),
          columnHelper.accessor('diemTongKet2', {
            header: 'Lần 2',
            cell: (info) => (
              <span className="block min-w-11.25 rounded-md bg-amber-50 px-2 py-1 text-center font-bold text-amber-600">
                {info.getValue() !== null ? info.getValue()?.toFixed(1) : '-'}
              </span>
            ),
          }),
        ],
      }),
      columnHelper.accessor('diemChu', {
        header: 'Điểm chữ',
        cell: (info) => {
          const val = info.getValue()
          let colorClass = 'text-slate-500 bg-slate-50'
          if (val === 'A') colorClass = 'text-red-600 bg-red-50 font-extrabold'
          else if (val === 'B') colorClass = 'text-orange-600 bg-orange-50'
          else if (val === 'C') colorClass = 'text-yellow-600 bg-yellow-50'
          else if (val === 'D') colorClass = 'text-blue-600 bg-blue-50'
          else if (val === 'F') colorClass = 'text-rose-700 bg-rose-100 font-bold'

          return (
            <span className={`block min-w-[50px] rounded-md px-2 py-1 text-center font-bold ${colorClass}`}>
              {val}
            </span>
          )
        },
      }),
      columnHelper.accessor('diemHe4', {
        header: 'Hệ 4',
        cell: (info) => {
          const val = info.getValue()
          return (
            <span className="block min-w-[50px] rounded-md bg-slate-100 px-2 py-1 text-center font-semibold text-slate-700">
              {val !== null ? val.toFixed(1) : '-'}
            </span>
          )
        },
      }),
    ]
  }, [isThucTap])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSaveGrades = async () => {
    saveGradeTable(
      {
        body: {
          classSubjectId: classSubject!.id!,
          grades: tableData.map((row) => ({
            studentId: row.studentId,
            // Gửi dữ liệu tùy thuộc vào loại bảng điểm
            ...(isThucTap
              ? {
                  diemYThuc: row.diemYThuc ?? undefined,
                  diemChuyenMon: row.diemChuyenMon ?? undefined,
                  diemBaoCao: row.diemBaoCao ?? undefined,
                  diemTongKet1: row.diemTongKet1 ?? undefined,
                }
              : {
                  kttx1: row.kttx1 ?? undefined,
                  kttx2: row.kttx2 ?? undefined,
                  kttx3: row.kttx3 ?? undefined,
                  ktdk1: row.ktdk1 ?? undefined,
                  ktdk2: row.ktdk2 ?? undefined,
                  ktdk3: row.ktdk3 ?? undefined,
                  ktdk4: row.ktdk4 ?? undefined,
                  diemKiemTra1: row.diemKiemTra1 ?? undefined,
                  diemKiemTra2: row.diemKiemTra2 ?? undefined,
                  diemTB: row.diemTB ?? undefined,
                  diemTongKet1: row.diemTongKet1 ?? undefined,
                  diemTongKet2: row.diemTongKet2 ?? undefined,
                }),
          })),
        },
      },
      {
        onSuccess: () => {
          refetchClassSubject()
          toast.success('Lưu bảng điểm thành công!')
        },
        onError: () => {
          toast.error('Đã có lỗi xảy ra khi lưu bảng điểm. Vui lòng thử lại.')
        },
      },
    )
  }

  const getStickyCellClass = (columnId: string) => {
    if (columnId === 'stt') {
      return 'sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center'
    }
    if (columnId === 'tenHs') {
      return 'sticky left-[60px] z-10 bg-white group-hover:bg-slate-50/90 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.15)] font-semibold'
    }
    return ''
  }

  if (isClassSubjectLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">Đang tải bảng điểm lớp học...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen rounded-xl bg-slate-50 p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 pt-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bảng Nhập Điểm {isThucTap && '(Thực Tập)'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {'Môn học: ' + (classSubject?.subject?.subjectName || 'N/A')}
          </p>
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <ButtonAction
            icon={<RefreshCw className="h-4 w-4" />}
            label="Làm mới"
            onClick={() => refetchClassSubject()}
            variant="outline"
          />
          <ButtonExport
            onClick={() => {
              return exportExcel(
                {
                  parseAs: 'blob',
                  body: {
                    classSubjectIds: [classSubject!.id!],
                  },
                },
                {
                  onSuccess: (blob) => {
                    downloadFromBlob(
                      blob as never,
                      `${baseClass?.className} - ${classSubject?.subject?.subjectName}`,
                      '.xlsx',
                    )
                  },
                },
              )
            }}
            isPending={isExportingExcel}
          />
          <ButtonAction
            icon={<Save className="h-4 w-4" />}
            label="Lưu bảng điểm"
            onClick={handleSaveGrades}
            loading={isPendingSaveGradeTable}
          />
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup, groupIndex) => (
                <tr
                  key={headerGroup.id}
                  className={
                    groupIndex === 0
                      ? 'border-b border-slate-200 bg-slate-100'
                      : 'border-b border-slate-200 bg-slate-50'
                  }
                >
                  {headerGroup.headers.map((header) => {
                    const isGroup = header.subHeaders && header.subHeaders.length > 0

                    const isSubHeader = groupIndex > 0

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        // Nếu là thực tập (không có nhóm cột) thì luôn chiếm full 2 tầng header row
                        rowSpan={isThucTap ? 2 : isGroup ? 1 : 2}
                        className={`relative border-r border-slate-200 px-3 py-2.5 text-center text-xs font-bold tracking-wider transition-colors select-none last:border-0 ${
                          isGroup
                            ? 'bg-blue-50 font-extrabold text-blue-800 uppercase'
                            : isSubHeader
                              ? 'bg-slate-50 font-medium text-slate-500 normal-case'
                              : 'bg-slate-100 font-bold text-slate-700 uppercase'
                        } ${getStickyClass(header.id, groupIndex, header.placeholderId)}`}
                        style={{
                          borderRightWidth: isGroup || !isSubHeader ? '2px' : '1px',
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100" onKeyDown={(e) => handleKeyDown(e, table)}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="group transition-colors hover:bg-slate-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      data-row-index={row.index}
                      data-col-index={cell.column.id}
                      className={`border-r border-slate-100 text-center align-middle whitespace-nowrap transition-colors duration-150 last:border-0 ${getStickyCellClass(cell.column.id)}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NhapDiem
