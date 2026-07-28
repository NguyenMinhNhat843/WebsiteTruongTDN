import { useRef, useState } from 'react'
import { Plus, User, Users, GraduationCap, BookOpen, Trash2, Edit2, Building2 } from 'lucide-react'
import { Empty, Popconfirm, Tooltip, Typography } from 'antd'
import PageShell from '../../../components/ui/PageShell'
import { useKhoaContext } from './KhoaProvider'
import CreateKhoaForm, { type CreateKhoaFormRef } from './CreateKhoaForm'
import ButtonAction from '../../../components/ui/ButtonAction'
import Modal from '../../../components/ui/Modal'
import { LoadingWrapper } from '../../../components/ui/LoadingWrapper'
import type { components } from '../../../api/v1'

const { Text, Paragraph } = Typography

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
      icon={Building2}
      renderRight={
        <ButtonAction
          label="Thêm khoa mới"
          icon={<Plus size={16} />}
          onClick={handleOpenCreateModal}
          variant="primary"
        />
      }
    >
      <LoadingWrapper isLoading={isLoadingDepartment} message="Đang tải dữ liệu khoa...">
        {/* Danh sách thẻ Khoa */}
        {!departmentList || departmentList.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-16 shadow-sm">
            <Empty
              description={
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Chưa có dữ liệu khoa / ban</p>
                  <p className="text-xs text-slate-400">
                    Bấm &quot;Thêm khoa mới&quot; để tạo đơn vị đào tạo đầu tiên trong hệ thống.
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {departmentList.map((dept) => {
              const headName = dept.headOfDepartmentName || 'Chưa bổ nhiệm'

              return (
                <div
                  key={dept.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    {/* Header Card: Mã khoa + Nút chức năng */}
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold tracking-wide text-blue-700 uppercase">
                        {dept.deptCode}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <Tooltip title="Chỉnh sửa">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(dept)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit2 size={15} strokeWidth={2} />
                          </button>
                        </Tooltip>

                        <Popconfirm
                          title="Xóa khoa đào tạo"
                          description={`Bạn có chắc chắn muốn xóa khoa ${dept.deptName}?`}
                          onConfirm={() =>
                            deleteDepartment({
                              params: { path: { id: dept.id } },
                            })
                          }
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                        >
                          <Tooltip title="Xóa khoa">
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    </div>

                    {/* Tên Khoa */}
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                      {dept.deptName}
                    </h3>

                    {/* Mô tả ngắn */}
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      className="!mt-1.5 !mb-0 !min-h-[40px] !text-xs !leading-relaxed !text-slate-500"
                      title={dept.description || ''}
                    >
                      {dept.description || 'Chưa có thông tin mô tả chi tiết cho đơn vị này.'}
                    </Paragraph>

                    {/* Trưởng khoa */}
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-50 bg-blue-50/40 px-3 py-2 text-xs text-slate-600">
                      <User size={15} className="shrink-0 text-blue-500" />
                      <span className="truncate">
                        Trưởng khoa: <Text className="!font-semibold !text-slate-800">{headName}</Text>
                      </span>
                    </div>
                  </div>

                  {/* Chỉ số Thống kê */}
                  <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-blue-500">
                        <BookOpen size={13} />
                        <span className="text-[11px] font-medium text-slate-500">Ngành</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{dept.totalMajors || 0}</span>
                    </div>

                    <div className="space-y-0.5 border-x border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-blue-500">
                        <Users size={13} />
                        <span className="text-[11px] font-medium text-slate-500">Giảng viên</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{dept.totalStaffs || 0}</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-blue-500">
                        <GraduationCap size={13} />
                        <span className="text-[11px] font-medium text-slate-500">Sinh viên</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{dept.totalStudents || 0}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <ButtonAction
                  variant="primary"
                  className="rounded-xl border-none bg-blue-600 font-medium text-white hover:bg-blue-700 active:bg-blue-800"
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
