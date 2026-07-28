import React from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useKhoaDaoTaoContext, type khoaDaoTaoDto } from './KhoaHocProvider'
import { Trash2, Calendar, Fingerprint, Sparkles, GraduationCap, Edit2, FolderOpen } from 'lucide-react'
import { BATCH_STATUS_MAP, type BatchStatusEnum } from '../../../api/enum'

interface KhoaDaoTaoTableProps {
  data: khoaDaoTaoDto[]
  isLoading?: boolean
}

const KhoaDaoTaoTable: React.FC<KhoaDaoTaoTableProps> = ({ data = [], isLoading = false }) => {
  const { deleteBatch, setBatchSelected } = useKhoaDaoTaoContext()

  const handleDelete = (item: khoaDaoTaoDto) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa đào tạo "${item.batchName}" không?`)) {
      deleteBatch(
        { params: { path: { id: item.id } } },
        {
          onSuccess: () => alert('Xóa khóa đào tạo thành công'),
        },
      )
    }
  }

  // Helper render Badge Trạng thái dựa trên Enum & Map
  const renderStatusBadge = (status?: BatchStatusEnum) => {
    if (!status || !BATCH_STATUS_MAP[status]) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-600">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          {status || 'Không xác định'}
        </span>
      )
    }

    const config = BATCH_STATUS_MAP[status]

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${config.colorClass}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {config.label}
      </span>
    )
  }

  // Định nghĩa các cột cho Antd Table
  const columns: ColumnsType<khoaDaoTaoDto> = [
    {
      title: 'Mã khóa',
      dataIndex: 'batchCode',
      key: 'batchCode',
      width: 140,
      render: (batchCode: string) => (
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-transparent bg-slate-100 p-1.5 text-slate-500 shadow-sm transition-colors group-hover:border-slate-100 group-hover:bg-white group-hover:text-blue-600">
            <Fingerprint size={14} className="shrink-0" />
          </div>
          <span className="font-mono font-bold tracking-wide text-slate-700">{batchCode}</span>
        </div>
      ),
    },
    {
      title: 'Tên khóa đào tạo',
      dataIndex: 'batchName',
      key: 'batchName',
      width: 280,
      render: (_, record) => (
        <span
          className="line-clamp-1 cursor-pointer text-[15px] font-extrabold text-slate-800 decoration-blue-500/30 transition-all duration-150 group-hover:text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            setBatchSelected(record)
          }}
          title={record.batchName}
        >
          {record.batchName}
        </span>
      ),
    },
    {
      title: 'Niên khóa',
      key: 'nienKhoa',
      width: 170,
      render: (_, record) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={15} className="shrink-0 text-slate-400" />
          <span className="text-[13.5px] font-semibold tracking-tight">
            {record.startYear} — {record.endYear}
          </span>
        </div>
      ),
    },
    {
      title: 'Ngành học',
      key: 'major',
      width: 210,
      render: (_, record) => (
        <div className="flex max-w-full items-center gap-2">
          <GraduationCap size={16} className="shrink-0 text-blue-500" />
          <span
            className="truncate text-[13.5px] font-semibold text-slate-700"
            title={record.major?.majorName}
          >
            {record.major?.majorName || 'Chưa phân ngành'}
          </span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: BatchStatusEnum) => renderStatusBadge(status),
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => setBatchSelected(record)}
            className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 transition-all hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
            title="Chỉnh sửa thông tin"
          >
            <Edit2 size={14} strokeWidth={2.2} />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-slate-400 transition-all hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 active:scale-95"
            title="Xóa khóa học"
          >
            <Trash2 size={14} strokeWidth={2.2} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <Table<khoaDaoTaoDto>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={isLoading} // Tích hợp prop loading chính chủ của Antd Table
        pagination={false}
        scroll={{ x: 900 }}
        rowClassName="group hover:bg-blue-50/20 transition-all duration-200"
        locale={{
          emptyText: (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <div className="rounded-full bg-slate-50 p-4 text-slate-400">
                <FolderOpen size={36} className="stroke-[1.5]" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-bold text-slate-700">Trống trải quá!</p>
                <p className="mx-auto max-w-[280px] text-xs text-slate-400">
                  Không tìm thấy dữ liệu khóa đào tạo nào trong hệ thống hiện tại.
                </p>
              </div>
            </div>
          ),
        }}
      />

      {/* Footer chân trang */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4 text-xs font-bold tracking-wide text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="animate-pulse text-blue-500" />
          <span>{isLoading ? 'Đang tải dữ liệu...' : `Tổng số: ${data.length} khóa đào tạo`}</span>
        </div>
        <p className="font-normal italic">Dữ liệu cập nhật thời gian thực</p>
      </div>
    </div>
  )
}

export default KhoaDaoTaoTable
