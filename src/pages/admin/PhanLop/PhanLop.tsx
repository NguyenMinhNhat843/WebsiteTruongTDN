import { Inbox, UserPlus, Users, Wand2, X } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import { usePhanLopContext } from './PhanLopProvider'
import ButtonAction from '../../../components/ui/ButtonAction'
import { SelectOption } from '../../../components/ui/Form/SelectOption'
import { useState } from 'react'
import { toast } from 'sonner'

const PhanLop = () => {
  const {
    isPendingbatches,
    nganhs,
    isPendingNganhs,
    students, // Dữ liệu dạng: { students: [...], total: number }
    isLoadingStudents,
    selectedMajorId,
    setSelectedMajorId,
    allBatch,
    phanLop,
    isPendingPhanLop,
    selectedBatchId,
    setSelectedBatchId,
  } = usePhanLopContext()

  // State kiểm soát việc hiển thị Modal cấu hình số lượng học sinh
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [studentsPerClass, setStudentsPerClass] = useState<string>('40')
  const [errorInput, setErrorInput] = useState<string>('')

  // Chuyển allBatch đã được sort từ lớn đến nhỏ thành mảng Option chuẩn format
  const batchOptions =
    allBatch?.map((b) => ({
      value: b.id!,
      label: `${b.batchCode} (${b.startYear} - ${b.endYear})`,
    })) || []

  // LẤY DANH SÁCH SINH VIÊN TỪ STRUCTURE MỚI
  const studentList = students?.data || []

  // Hàm helper format ngày sinh (DD/MM/YYYY)
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('vi-VN')
  }

  // Xử lý khi nhấn nút Xác nhận trên Modal
  const handleConfirmPhanLop = (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(studentsPerClass)

    if (!studentsPerClass || isNaN(num) || num <= 0) {
      setErrorInput('Vui lòng nhập số học sinh hợp lệ (lớn hơn 0)')
      return
    }

    setErrorInput('')

    // Gọi API phân lớp với tham số động từ Input
    phanLop(
      {
        body: {
          batchId: selectedBatchId!,
          studentsPerClass: num,
        },
      },
      {
        onSuccess: () => {
          toast.success('Phân lớp thành công! Dữ liệu sẽ được cập nhật.')
          setIsOpenModal(false) // Đóng modal sau khi thành công
        },
        onError: () => {
          toast.error('Có lỗi xảy ra, vui lòng thử lại!')
        },
      },
    )
  }

  return (
    <PageShell
      title="Phân lớp tự động cho Sinh viên"
      sub="Quản lý việc phân lớp cho sinh viên dựa trên ngành và khóa đào tạo"
      icon={Users}
      renderRight={
        <ButtonAction
          variant="primary"
          size="md"
          icon={<Wand2 className="h-4 w-4" />}
          loading={isPendingPhanLop}
          disabled={isPendingPhanLop || !selectedBatchId}
          onClick={() => setIsOpenModal(true)}
        >
          Phân lớp
        </ButtonAction>
      }
    >
      <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card: Cấu hình lọc */}
          <div className="flex flex-col items-end gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row lg:col-span-2">
            {/* Select Ngành */}
            <div className="w-full flex-1">
              <SelectOption
                label="Chọn Ngành đào tạo"
                options={[
                  { value: '', label: '-- Chọn Ngành đào tạo --' },
                  ...(nganhs?.map((n) => ({
                    value: n.id,
                    label: n.majorName,
                  })) || []),
                ]}
                value={selectedMajorId || ''}
                onChange={(e) => setSelectedMajorId(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 transition-all outline-none hover:border-blue-400 focus:ring-4 focus:ring-blue-100"
                labelClassName="text-sm font-semibold text-slate-700 ml-1 mb-2 block"
              />
              {isPendingNganhs && (
                <span className="mt-1 ml-1 block animate-pulse text-xs text-blue-500 italic">
                  Đang tải danh sách ngành học...
                </span>
              )}
            </div>

            {/* Select Khóa */}
            <div className="w-full flex-1">
              <SelectOption
                label="Chọn Khóa đào tạo"
                options={batchOptions}
                value={selectedBatchId || ''}
                disabled={isPendingbatches || !selectedMajorId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedBatchId(Number(e.target.value))
                }
                className="w-full rounded-xl border border-slate-200 bg-white p-3 transition-all outline-none hover:border-blue-400 focus:ring-4 focus:ring-blue-100"
                labelClassName="text-sm font-semibold text-slate-700 ml-1 mb-2 block"
              />
              {isPendingbatches && (
                <span className="mt-1 ml-1 block animate-pulse text-xs text-slate-400 italic">
                  Đang tải danh sách khóa học...
                </span>
              )}
            </div>
          </div>

          {/* Card: Thống kê nhanh */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
            <div className="relative z-10">
              <p className="text-sm font-medium tracking-wider text-blue-100 uppercase">
                Tổng sinh viên đủ điều kiện
              </p>
              <h3 className="mt-2 text-5xl font-black">{students?.total ?? studentList.length}</h3>
              <p className="mt-4 text-xs text-blue-200">Dữ liệu được cập nhật theo thời gian thực</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <UserPlus size={120} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Main Content: Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Danh sách sinh viên</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold tracking-widest text-slate-500 uppercase">
                  <th className="w-16 px-6 py-4 text-center">STT</th>
                  <th className="px-6 py-4 text-left">Họ và Tên</th>
                  <th className="px-6 py-4 text-left">Ngày sinh</th>
                  <th className="px-6 py-4 text-left">Khóa học</th>
                  <th className="px-6 py-4 text-left">Ngành học</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingStudents ? (
                  <tr>
                    <td colSpan={5} className="py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <p className="font-medium text-slate-400">Đang tải danh sách sinh viên...</p>
                      </div>
                    </td>
                  </tr>
                ) : studentList.length > 0 ? (
                  studentList.map((st, index) => (
                    <tr key={st.id || index} className="group transition-colors hover:bg-blue-50/50">
                      <td className="px-6 py-4 text-center font-medium text-slate-400">{index + 1}</td>

                      <td className="px-6 py-4 font-semibold text-slate-700">{st.fullName}</td>

                      <td className="px-6 py-4 text-slate-600">{formatDate(st.dob)}</td>

                      <td className="px-6 py-4">
                        {st.batch ? (
                          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors group-hover:bg-blue-100">
                            {`${st.batch.batchCode}`}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {st.major?.majorName || 'Chưa phân ngành'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Inbox className="mb-4 h-16 w-16" strokeWidth={1} />
                        <p className="text-lg font-medium">
                          {selectedMajorId
                            ? 'Không tìm thấy sinh viên nào đủ điều kiện.'
                            : 'Vui lòng chọn ngành để hiển thị dữ liệu.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOX POPUP (MODAL) NHẬP SỐ LƯỢNG HỌC SINH TỐI ĐA */}
      {isOpenModal && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-all">
          <div className="w-full max-w-sm scale-100 transform overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl transition-transform">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
              <h4 className="text-base font-bold text-slate-800">Cấu hình phân lớp</h4>
              <button
                type="button"
                onClick={() => {
                  setIsOpenModal(false)
                  setErrorInput('')
                }}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleConfirmPhanLop} className="space-y-4 p-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Số học sinh tối đa / lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={studentsPerClass}
                  onChange={(e) => setStudentsPerClass(e.target.value)}
                  placeholder="Ví dụ: 40"
                  className={`w-full border ${errorInput ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'} rounded-xl p-3 text-sm transition-all outline-none focus:border-blue-500 focus:ring-4`}
                  autoFocus
                />
                {errorInput && (
                  <p className="ml-1 animate-pulse text-xs font-medium text-red-500">{errorInput}</p>
                )}
              </div>

              {/* Footer Modal */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
                <ButtonAction
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpenModal(false)
                    setErrorInput('')
                  }}
                  disabled={isPendingPhanLop}
                >
                  Hủy bỏ
                </ButtonAction>
                <ButtonAction
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isPendingPhanLop}
                  disabled={isPendingPhanLop}
                >
                  Xác nhận
                </ButtonAction>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  )
}

export default PhanLop
