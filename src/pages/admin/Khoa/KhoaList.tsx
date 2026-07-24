import { Plus, User, Users, GraduationCap, BookOpen, Trash2, Edit2, Building2 } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import { useKhoaContext } from './KhoaProvider'
import CreateKhoaForm, { type CreateKhoaFormRef } from './CreateKhoaForm'
import ButtonAction from '../../../components/ui/ButtonAction'
import Modal from '../../../components/ui/Modal'
import { useRef, useState } from 'react'
import { LoadingWrapper } from '../../../components/ui/LoadingWrapper'
import type { components } from '../../../api/v1'

export type ResponseDepartmentDto = components['schemas']['ResponseDepartmentDto']

const KhoaList = () => {
  const {
    openModalCreateKhoa,
    setOpenModalCreateKhoa,
    departments,
    deleteDepartment,
    isLoadingDepartment,
    refetchDepartments,
  } = useKhoaContext()

  const departmentList = departments as ResponseDepartmentDto[] | undefined
  const [editingDepartment, setEditingDepartment] = useState<ResponseDepartmentDto | null>(null)
  const formRef = useRef<CreateKhoaFormRef>(null)

  const handleConfirmSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm()
    }
  }

  const handleOpenCreateModal = () => {
    setEditingDepartment(null)
    setOpenModalCreateKhoa(true)
  }

  const handleOpenEditModal = (dept: ResponseDepartmentDto) => {
    setEditingDepartment(dept)
    setOpenModalCreateKhoa(true)
  }

  const handleCloseModal = () => {
    setOpenModalCreateKhoa(false)
    setEditingDepartment(null)
    refetchDepartments()
  }

  return (
    <PageShell
      title="Danh mục Khoa / Ban"
      sub="Quản lý cấu trúc các đơn vị đào tạo và chuyên môn"
      renderRight={
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          Thêm khoa mới
        </button>
      }
    >
      <LoadingWrapper isLoading={isLoadingDepartment} message="Đang tải dữ liệu khoa...">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {departmentList?.map((dept) => {
            const headName = dept.headOfDepartmentName || 'Chưa bổ nhiệm'

            return (
              <div
                key={dept.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Header Card: Mã khoa + Nút chức năng */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wide text-slate-700 uppercase">
                      {dept.deptCode}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(dept)}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa khoa ${dept.deptName}?`)) {
                            deleteDepartment({
                              params: { path: { id: dept.id } },
                            })
                          }
                        }}
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Xóa khoa"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Tên Khoa */}
                  <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {dept.deptName}
                  </h3>

                  {/* Mô tả ngắn */}
                  <p className="mt-1.5 line-clamp-2 min-h-[40px] text-xs leading-relaxed text-slate-500">
                    {dept.description || 'Chưa có mô tả chi tiết cho đơn vị này.'}
                  </p>

                  {/* Trưởng khoa */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <User size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                      Trưởng khoa: <span className="font-semibold text-slate-800">{headName}</span>
                    </span>
                  </div>
                </div>

                {/* Chỉ số Thống kê */}
                <div className="mt-5 grid grid-cols-3 gap-1 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5 text-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <BookOpen size={13} />
                      <span className="text-[11px] font-medium text-slate-500">Nghề</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{dept.totalMajors || 0}</span>
                  </div>

                  <div className="space-y-0.5 border-x border-slate-200">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <Users size={13} />
                      <span className="text-[11px] font-medium text-slate-500">Giảng viên</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{dept.totalStaffs || 0}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <GraduationCap size={13} />
                      <span className="text-[11px] font-medium text-slate-500">Sinh viên</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{dept.totalStudents || 0}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Card "Thêm khoa mới" */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-slate-500 transition-all hover:border-indigo-400 hover:bg-indigo-50/20 hover:text-indigo-600"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform group-hover:scale-110 group-hover:border-indigo-200">
              <Plus size={20} className="text-slate-600 group-hover:text-indigo-600" />
            </div>
            <span className="text-sm font-semibold">Tạo thêm khoa mới</span>
            <span className="mt-1 text-xs text-slate-400">Thêm đơn vị đào tạo vào hệ thống</span>
          </button>
        </div>

        {/* Modal Tạo/Sửa */}
        {openModalCreateKhoa && (
          <Modal
            isOpen={openModalCreateKhoa}
            onClose={handleCloseModal}
            title={editingDepartment ? 'Cập nhật thông tin Khoa' : 'Thêm Khoa đào tạo mới'}
            subTitle="Quản lý thông tin và phân công nhân sự quản lý đơn vị"
            icon={Building2}
            maxWidth="2xl"
            footer={
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <ButtonAction
                  label={editingDepartment ? 'Lưu thay đổi' : 'Tạo mới'}
                  onClick={handleConfirmSubmit}
                />
              </div>
            }
          >
            <CreateKhoaForm
              ref={formRef}
              departmentData={editingDepartment || undefined}
              onSuccess={handleCloseModal}
            />
          </Modal>
        )}
      </LoadingWrapper>
    </PageShell>
  )
}

export default KhoaList
