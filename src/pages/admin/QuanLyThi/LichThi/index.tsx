import { useState } from 'react'
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  RotateCcw,
  BookOpen,
  Eye,
  CalendarDays,
  DoorClosed,
  Search,
} from 'lucide-react'
import { Table, Select, DatePicker, Button, Tag, Tooltip, ConfigProvider, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { $api } from '../../../../api/client'
import type { components } from '../../../../api/v1'
import ModalCreateDotThi from './CreateDotThi'
import ModalDotThiDetail from './One/DotThiDetail'
import PageShell from '../../../../components/ui/PageShell'
import type { ExamScheduleDetailDto } from '../../../../api/entity'

export type CreateExamScheduleDto = components['schemas']['CreateExamScheduleDto']

const LichThiIndex = () => {
  // --- States mở Modal Tạo đợt thi ---
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // --- States mở Modal Chi tiết đợt thi ---
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)

  // --- States bộ lọc ---
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>(undefined)
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined)
  const [examDate, setExamDate] = useState<string>('')
  const [shift, setShift] = useState<string>('')
  const [examTurn, setExamTurn] = useState<number | undefined>(undefined)

  // --- States phân trang ---
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)

  // --- Fetch API ---
  const { data: semesters, isLoading: isLoadingSemesters } = $api.useQuery('get', '/semesters')
  const { data: rooms, isLoading: isLoadingRooms } = $api.useQuery('get', '/rooms')

  // Lấy danh sách đợt thi
  const {
    data: examSchedulesData,
    isLoading: isLoadingExamSchedules,
    refetch: refetchExamSchedules,
  } = $api.useQuery('get', '/exam-schedules', {
    params: {
      query: {
        limit,
        page,
        examDate: examDate || undefined,
        examTurn: examTurn ? Number(examTurn) : undefined,
        shift: shift || undefined,
        roomId: selectedRoomId,
      },
    },
  })

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSelectedSemesterId(undefined)
    setSelectedRoomId(undefined)
    setExamDate('')
    setShift('')
    setExamTurn(undefined)
    setPage(1)
  }

  // Hàm mở modal chi tiết
  const handleOpenDetail = (id: number) => {
    setSelectedDetailId(id)
    setIsDetailOpen(true)
  }

  // Cấu hình các cột cho Bảng Antd
  const columns: ColumnsType<ExamScheduleDetailDto> = [
    {
      title: 'Môn / Lớp học phần',
      key: 'subject',
      render: (_, record) => (
        <div className="flex flex-col py-0.5">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>{record.classSubject?.subject?.subjectName || 'N/A'}</span>
          </div>
          <span className="mt-1 pl-9 text-xs font-medium text-slate-500">
            Lớp HP:{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
              {record.classSubject?.baseClass?.classCode || `#${record.classSubjectId}`}
            </code>
          </span>
        </div>
      ),
    },
    {
      title: 'Ngày thi',
      dataIndex: 'examDate',
      key: 'examDate',
      width: 150,
      render: (date: string) => (
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{dayjs(date).format('DD/MM/YYYY')}</span>
        </div>
      ),
    },
    {
      title: 'Thời gian & Ca',
      key: 'time',
      width: 170,
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {record.startTime && record.endTime ? `${record.startTime} - ${record.endTime}` : 'Chưa xếp'}
            </span>
          </div>
          {record.shift && (
            <span className="mt-1 text-xs text-slate-500">
              Ca thi: <span className="font-medium text-slate-700">{record.shift}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Phòng thi',
      key: 'room',
      width: 200,
      render: (_, record) => {
        if (!record.room) {
          return <span className="text-xs text-slate-400 italic">Chưa xếp phòng</span>
        }

        // Mapping màu sắc theo từng loại phòng thi
        const roomTypeColorMap: Record<string, string> = {
          THEORY: 'emerald', // Lý thuyết (Xanh lá)
          PRACTICE: 'blue', // Thực hành (Xanh dương)
          COMPUTER_LAB: 'purple', // Phòng máy tính (Tím)
          WORKSHOP: 'amber', // Xưởng / Thực tập (Cam)
          FUNCTIONAL: 'cyan', // Phòng chức năng (Xanh lam)
        }

        // Mặc định là 'emerald' nếu type không thuộc các loại trên
        const tagColor = roomTypeColorMap[record.room.type] || 'emerald'

        return (
          <Tag
            color={tagColor}
            className="flex max-w-full items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
          >
            <span className="truncate">
              {record.room.roomCode} ({record.room.building || 'N/A'})
            </span>
          </Tag>
        )
      },
    },
    {
      title: 'Đợt / Lần',
      dataIndex: 'examTurn',
      key: 'examTurn',
      align: 'center',
      width: 110,
      render: (turn: number) => (
        <Tag color="blue" className="rounded-full px-3 py-0.5 font-semibold">
          Lần {turn}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết đợt thi">
          <Button
            type="text"
            shape="circle"
            icon={<Eye className="h-4 w-4 text-slate-600 transition-colors hover:text-indigo-600" />}
            onClick={() => handleOpenDetail(record.id)}
            className="hover:bg-indigo-50"
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          colorBorder: '#cbd5e1',
          fontSize: 14,
          fontFamily: 'inherit',
        },
        components: {
          Select: { controlHeight: 40 },
          DatePicker: { controlHeight: 40 },
          InputNumber: { controlHeight: 40 },
          Button: { controlHeight: 40 },
        },
      }}
    >
      <PageShell
        title="Quản lý Lịch thi & Đợt thi"
        sub="Lập kế hoạch đợt thi và tự động gán sinh viên đủ điều kiện dự thi"
        icon={CalendarDays}
        renderRight={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Tạo đợt thi mới
          </button>
        }
      >
        <div className="space-y-6">
          {/* --- BỘ LỌC (FILTERS CARD) --- */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            {/* Header Card */}
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
                  <Filter className="h-4 w-4" />
                </div>
                <span className="text-base font-bold tracking-tight text-slate-800">Bộ lọc tìm kiếm</span>
              </div>

              <Button
                type="text"
                size="small"
                onClick={handleResetFilters}
                icon={<RotateCcw className="h-3.5 w-3.5" />}
                className="flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600"
              >
                Xóa bộ lọc
              </Button>
            </div>

            {/* Grid 4 Cột Filter Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1. Học kỳ */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                  Học kỳ
                </label>
                <Select
                  allowClear
                  placeholder="-- Tất cả học kỳ --"
                  loading={isLoadingSemesters}
                  value={selectedSemesterId}
                  onChange={(val) => {
                    setSelectedSemesterId(val)
                    setPage(1)
                  }}
                  options={semesters?.map((sem) => {
                    let statusTag = null
                    const statusUpper = sem.status?.toUpperCase()

                    if (statusUpper === 'ACTIVE') {
                      statusTag = (
                        <Tag color="success" className="m-0 rounded-md border-none px-2 py-0.5 font-medium">
                          Đang hoạt động
                        </Tag>
                      )
                    } else if (statusUpper === 'UPCOMING') {
                      statusTag = (
                        <Tag
                          color="processing"
                          className="m-0 rounded-md border-none px-2 py-0.5 font-medium"
                        >
                          Sắp tới
                        </Tag>
                      )
                    } else {
                      statusTag = (
                        <Tag
                          color="default"
                          className="m-0 rounded-md border-none bg-slate-100 px-2 py-0.5 font-medium text-slate-500"
                        >
                          Đã kết thúc
                        </Tag>
                      )
                    }

                    return {
                      value: sem.id,
                      label: (
                        <div className="flex items-center justify-between font-medium text-slate-800">
                          <span className="truncate">{sem.name}</span>
                          {statusTag}
                        </div>
                      ),
                      searchValue: sem.name,
                    }
                  })}
                  optionFilterProp="searchValue"
                  className="custom-enhanced-input w-full"
                  popupClassName="rounded-xl shadow-lg border border-slate-100"
                  showSearch
                />
              </div>

              {/* 2. Phòng thi */}
              <div className="flex flex-col gap-1.5">
                {/* Phòng thi - High Contrast UI */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                    <DoorClosed className="h-3.5 w-3.5 text-indigo-600" />
                    Phòng thi
                  </label>

                  <Select
                    allowClear
                    placeholder="-- Tất cả phòng thi --"
                    loading={isLoadingRooms}
                    value={selectedRoomId}
                    onChange={(val) => {
                      setSelectedRoomId(val)
                      setPage(1)
                    }}
                    options={rooms?.map((room) => ({
                      value: room.id,
                      label: (
                        <span className="font-semibold text-slate-900">
                          {room.roomCode}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            ({room.building || 'N/A'})
                          </span>
                        </span>
                      ),
                      searchValue: `${room.roomCode} ${room.building}`,
                    }))}
                    className="custom-prominent-input w-full"
                    popupClassName="rounded-xl shadow-xl border border-slate-200 p-1"
                    showSearch
                    optionFilterProp="searchValue"
                    suffixIcon={<Search className="h-4 w-4 text-slate-400" />}
                  />
                </div>
              </div>

              {/* 3. Ngày thi */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                  Ngày thi
                </label>
                <DatePicker
                  placeholder="Chọn ngày thi"
                  format="DD/MM/YYYY"
                  value={examDate ? dayjs(examDate) : null}
                  onChange={(date) => {
                    setExamDate(date ? date.format('YYYY-MM-DD') : '')
                    setPage(1)
                  }}
                  className="custom-enhanced-input h-[38px] w-full rounded-lg border-slate-300 bg-slate-50/70 font-medium text-slate-800 hover:border-indigo-400 hover:bg-white focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* 4. Ca thi */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" />
                  Ca thi
                </label>
                <Select
                  allowClear
                  placeholder="-- Tất cả ca --"
                  value={shift || undefined}
                  onChange={(val) => {
                    setShift(val || '')
                    setPage(1)
                  }}
                  options={[
                    { value: 'Sáng', label: '☀️ Ca Sáng' },
                    { value: 'Chiều', label: '🌤️ Ca Chiều' },
                    { value: 'Tối', label: '🌙 Ca Tối' },
                  ]}
                  className="custom-enhanced-input w-full"
                  popupClassName="rounded-xl shadow-lg border border-slate-100"
                />
              </div>
            </div>
          </div>

          {/* --- DANH SÁCH ĐỢT THI (TABLE CARD) --- */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <Table
              columns={columns}
              dataSource={examSchedulesData?.data || []}
              rowKey="id"
              loading={isLoadingExamSchedules}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className="text-sm font-medium text-slate-500">
                        Không tìm thấy lịch thi nào phù hợp.
                      </span>
                    }
                  />
                ),
              }}
              pagination={{
                current: page,
                pageSize: limit,
                total: examSchedulesData?.total || 0,
                onChange: (p, pSize) => {
                  setPage(p)
                  setLimit(pSize)
                },
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => (
                  <span className="text-xs font-medium text-slate-500">
                    Hiển thị{' '}
                    <span className="font-semibold text-slate-800">
                      {range[0]}-{range[1]}
                    </span>{' '}
                    / <span className="font-semibold text-slate-800">{total}</span> đợt thi
                  </span>
                ),
                className: '!px-5 !py-3 !m-0 !border-t !border-slate-100 !bg-slate-50/50',
              }}
            />
          </div>

          {/* --- MODALS --- */}
          <ModalCreateDotThi
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            semesterId={selectedSemesterId}
            onSuccess={() => {
              refetchExamSchedules()
            }}
          />

          <ModalDotThiDetail
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false)
              setSelectedDetailId(null)
            }}
            examScheduleId={selectedDetailId}
          />
        </div>
      </PageShell>
    </ConfigProvider>
  )
}

export default LichThiIndex
