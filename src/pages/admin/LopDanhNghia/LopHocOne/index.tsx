import { useMemo, useState, useRef, useEffect } from 'react'

import { User, GraduationCap, BookOpen, Users, Plus, ArrowLeft, Calendar, FileText } from 'lucide-react'
import ModelThemHocSinh from './ModelThemHocSinh'
import { useNavigate } from 'react-router-dom'
import TableDanhSachHocSinh from './TabHocSinh'
import Tabs from '../../../../components/ui/Tabs'
import TabMonHoc from './TabMonHoc'
import Breadcrumb from '../../../../components/ui/Breadcrum'
import ButtonAction from '../../../../components/ui/ButtonAction'
import { useLopHocOneContext } from './LopHocOneProvider'
import { downloadFromBlob } from '../../../../util/download'
import { LoadingWrapper } from '../../../../components/ui/LoadingWrapper'
import { $api } from '../../../../api/client'
import { toast } from 'sonner'
import { SelectOption } from '../../../../components/ui/Form/SelectOption'

const LopHocOne = () => {
  return <Inner />
}

const Inner = () => {
  const {
    exportExcel,
    isExportingExcel,
    classSubjects,
    selectedSemesterId,
    LopHocDetail,
    isLoadingLopHocDetail,
    refetchLopHocDetail,
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
    isOpenModalAddStudent,
    setIsOpenModalAddStudent,
    setselectedSemesterId,
    hocKysData,
    exportClassComprehensiveTranscripts,
    isExportingClassComprehensiveTranscripts,
  } = useLopHocOneContext()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'hoc-sinh' | 'mon-hoc'>('mon-hoc')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  const hocKySelected = hocKysData?.find((hk) => hk.id === selectedSemesterId)

  // Xử lý đóng dropdown khi click ra ngoài vùng nút
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Xuất bảng điểm rèn luyện học kỳ
  const { mutate: exportDiemRenLuyen, isPending: isExportingDiemRenLuyen } = $api.useMutation(
    'get',
    '/assessment/export-assessment',
  )
  const handleExportDiemRenLuyen = (classId: number, semesterId: number) => {
    exportDiemRenLuyen(
      {
        parseAs: 'blob',
        params: {
          query: {
            classId,
            semesterId,
          },
        },
      },
      {
        onSuccess: (blob) => {
          downloadFromBlob(
            blob as never,
            `BangDiemRenLuyen_${LopHocDetail?.className}_${hocKySelected?.name}`,
            '.xlsx',
          )
        },
        onError: () => {
          toast.error('Xuất bảng điểm rèn luyện thất bại. Vui lòng thử lại sau.')
        },
      },
    )
  }

  // Lấy danh sách giáo viên
  const { data: teachers, isLoading: isLoadingTeachers } = $api.useQuery('get', '/staffs', {
    params: {
      query: {
        employeeRole: 'TEACHER',
      },
    },
  })

  // Phân bổ giáo viên chủ nhiệm cho lớp
  const { mutate: updateClassFormTeacher, isPending: isLoadingUpdateFormTeacher } = $api.useMutation(
    'patch',
    '/classes/{id}',
  )
  const handleUpdateClassFormTeacher = (formTeacherId: number | null) => {
    if (!LopHocDetail?.id) {
      alert('Không tìm thấy thông tin lớp học. Vui lòng thử lại sau.')
      return
    }

    updateClassFormTeacher(
      {
        body: {
          formTeacherId,
          status: LopHocDetail?.status,
        },
        params: {
          path: {
            id: LopHocDetail?.id,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật giáo viên chủ nhiệm thành công')
          refetchLopHocDetail()
        },
      },
    )
  }

  // Gọi API xuất bảng điểm học kỳ hiện tại đang chọn
  const handleExportSemesterTranscript = () => {
    setShowExportMenu(false)
    exportExcel(
      {
        parseAs: 'blob',
        body: {
          classSubjectIds: classSubjects?.map((cs) => cs.id) || [],
          haveTongKetSheet: true,
        },
      },
      {
        onSuccess: (blob) => {
          downloadFromBlob(
            blob as never,
            `${LopHocDetail?.className} - ${hocKySelected?.name} - BangDiemHocKy`,
            '.xlsx',
          )
        },
      },
    )
  }

  // Gọi API xuất bảng điểm tổng hợp (Tất cả học kỳ & Toàn khóa)
  const handleExportComprehensiveTranscript = () => {
    setShowExportMenu(false)

    if (!LopHocDetail?.id || !LopHocDetail?.batch?.id) {
      toast.error('Không tìm thấy thông tin lớp học hoặc niên khóa. Vui lòng thử lại sau.')
      return
    }

    // Gọi mutation hoặc endpoint API dành cho bảng điểm tổng hợp toàn khóa
    // Giả sử bạn truyền route hoặc body config tương ứng cho API Backend xử lý đa Sheet
    exportClassComprehensiveTranscripts(
      {
        parseAs: 'blob',
        params: {
          query: {
            classId: LopHocDetail?.id,
            batchId: LopHocDetail?.batch?.id,
          },
        },
      },
      {
        onSuccess: (blob) => {
          downloadFromBlob(blob as never, `${LopHocDetail?.className} - BangDiemTongHopToanKhoa`, '.xlsx')
        },
      },
    )
  }

  // 1. Chuẩn hóa dữ liệu thông tin cơ bản
  const dataHienThi = useMemo(
    () => ({
      tenLop: LopHocDetail?.className || 'N/A',
      maLop: LopHocDetail?.classCode || 'N/A',
      nganhHoc: LopHocDetail?.major?.majorName || 'N/A',
      giaoVien: LopHocDetail?.formTeacher?.fullName || 'Chưa phân bổ',
      siSo: studentsInLopHoc?.total || 0,
      maxStudent: LopHocDetail?.maxStudents || 0,
      hocKyBatDau: LopHocDetail?.batch?.startYear,
      hocKyKetThuc: LopHocDetail?.batch?.endYear,
    }),
    [LopHocDetail, studentsInLopHoc],
  )

  return (
    <div className="mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            {
              label: 'Danh sách lớp học',
              link: '/admin/dao-tao/lop-hoc',
            },
            {
              label: `Lớp ${LopHocDetail?.className}`,
            },
          ]}
        />
        <button
          onClick={() => {
            navigate('/admin/dao-tao/lop-hoc')
          }}
          className="group inline-flex items-center gap-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Quay về danh sách</span>
        </button>
      </div>

      <LoadingWrapper isLoading={isLoadingLopHocDetail || isLoadingStudentsInLopHoc}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Phần tiêu đề chính */}
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
              {/* Cụm thông tin bên trái */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{dataHienThi.tenLop}</h1>
                  <p className="text-sm text-gray-500">Mã lớp: {dataHienThi.maLop}</p>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 self-start sm:w-auto sm:self-center">
                <ButtonAction
                  label="Thêm học sinh"
                  onClick={() => {
                    setIsOpenModalAddStudent(true)
                  }}
                  icon={<Plus className="h-4 w-4" />}
                />

                {/* KHỐI DROPDOWN XUẤT BẢNG ĐIỂM */}
                <div className="relative" ref={exportMenuRef}>
                  <ButtonAction
                    variant="export"
                    label="Xuất Excel"
                    icon={<FileText className="h-4 w-4" />}
                    loading={
                      isExportingExcel || isExportingClassComprehensiveTranscripts || isExportingDiemRenLuyen
                    }
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  />

                  {showExportMenu && (
                    <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-60 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl duration-150">
                      <button
                        onClick={handleExportSemesterTranscript}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Xuất bảng điểm học kỳ
                      </button>
                      <button
                        onClick={handleExportComprehensiveTranscript}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-emerald-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Xuất bảng điểm tổng hợp
                      </button>
                      <button
                        onClick={() => handleExportDiemRenLuyen(LopHocDetail!.id!, selectedSemesterId!)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-emerald-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Xuất Bảng điểm rèn luyện Học kỳ
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <SelectOption
                    containerClassName="w-52"
                    value={selectedSemesterId ?? ''}
                    onChange={(e) => setselectedSemesterId(Number(e.target.value))}
                    options={
                      hocKysData?.map((hocKy) => ({
                        value: hocKy.id,
                        label: `${hocKy.name} ${hocKy.isCurrent ? '(Hiện tại)' : ''}`,
                      })) || []
                    }
                  />
                </div>
              </div>
            </div>

            {/* Phần grid thông tin bên dưới giữ nguyên */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {/* 1. Ngành học */}
              <div className="col-span-2 flex items-start gap-3 md:col-span-1">
                <BookOpen className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Ngành học</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">{dataHienThi.nganhHoc}</p>
                </div>
              </div>

              {/* 2. Giáo viên chủ nhiệm (Dropdown Select) */}
              <div className="col-span-2 flex items-start gap-3 md:col-span-1">
                <User className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="mb-1 text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Giáo viên chủ nhiệm
                  </p>
                  {isLoadingTeachers ? (
                    <div className="animate-pulse text-sm text-gray-400 italic">Đang tải danh sách...</div>
                  ) : (
                    <select
                      value={LopHocDetail?.formTeacher?.id || ''}
                      disabled={isLoadingUpdateFormTeacher}
                      onChange={(e) => {
                        const value = e.target.value
                        handleUpdateClassFormTeacher(value ? Number(value) : null)
                      }}
                      className="w-full cursor-pointer border-b border-gray-200 bg-transparent py-0.5 text-sm font-semibold text-gray-700 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Chưa phân bổ</option>
                      {teachers?.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.fullName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* 3. Sĩ số lớp */}
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Sĩ số lớp</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    <span className="font-bold text-blue-600">
                      {dataHienThi.siSo} / {dataHienThi.maxStudent}
                    </span>{' '}
                    học sinh
                  </p>
                </div>
              </div>

              {/* 4. Niên khóa */}
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">Niên khóa</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {dataHienThi.hocKyBatDau ? `HK1 - ${dataHienThi.hocKyBatDau}` : 'N/A'}
                    <span className="mx-1.5 text-gray-300">→</span>
                    {dataHienThi.hocKyKetThuc ? `HK1 - ${dataHienThi.hocKyKetThuc}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PHẦN 2: TABS --- */}
        <Tabs
          tabs={[
            { value: 'mon-hoc', label: 'Môn học' },
            { value: 'hoc-sinh', label: 'Học sinh' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === 'hoc-sinh' ? <TableDanhSachHocSinh /> : activeTab === 'mon-hoc' ? <TabMonHoc /> : null}

        <ModelThemHocSinh isOpen={isOpenModalAddStudent} onClose={() => setIsOpenModalAddStudent(false)} />
      </LoadingWrapper>
    </div>
  )
}

export default LopHocOne
