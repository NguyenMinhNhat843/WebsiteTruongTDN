import { forwardRef, useImperativeHandle, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Form, Input, Select, Spin } from 'antd'
import { LayoutGrid, Hash, UserCircle, FileText } from 'lucide-react'
import { $api } from '../../../api/client'
import { useKhoaContext } from './KhoaProvider'
import type { DepartmentDto } from '../../../api/entity'

const { TextArea } = Input

export type CreateKhoaFormData = {
  headOfDepartmentId?: number
  deptCode: string
  deptName: string
  description?: string
}

export interface CreateKhoaFormRef {
  submitForm: () => void
}

interface CreateKhoaFormProps {
  onSuccess?: () => void
  departmentData?: DepartmentDto
  isLoading?: boolean
}

const CreateKhoaForm = forwardRef<CreateKhoaFormRef, CreateKhoaFormProps>((props, ref) => {
  const { onSuccess, departmentData, isLoading } = props
  const { createDepartment } = useKhoaContext()

  // Khai báo mutation cập nhật phòng ban/khoa theo id
  const { mutate: updateDepartment, isPending: isUpdating } = $api.useMutation('patch', '/departments/{id}')

  // Xác định chế độ chỉnh sửa
  const isEditMode = !!departmentData?.id

  // Lấy danh sách Giáo viên từ API
  const { data: teachersData, isLoading: isLoadingTeachers } = $api.useQuery('get', '/staffs', {
    params: {
      query: {
        employeeRole: 'TEACHER',
      },
    },
  })

  const teachersList = Array.isArray(teachersData) ? teachersData : []

  // 1. Khởi tạo React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateKhoaFormData>({
    defaultValues: {
      deptName: '',
      deptCode: '',
      headOfDepartmentId: undefined,
      description: '',
    },
  })

  // 2. Cập nhật giá trị mặc định khi edit
  useEffect(() => {
    if (departmentData) {
      reset({
        deptName: departmentData.deptName || '',
        deptCode: departmentData.deptCode || '',
        headOfDepartmentId: departmentData.headOfDepartmentId ?? undefined,
        description: departmentData.description || '',
      })
    } else {
      reset({
        deptName: '',
        deptCode: '',
        headOfDepartmentId: undefined,
        description: '',
      })
    }
  }, [departmentData, reset])

  // 3. Xử lý submit dữ liệu
  const onSubmit = (data: CreateKhoaFormData) => {
    const payload = {
      deptCode: data.deptCode,
      deptName: data.deptName,
      headOfDepartmentId: data.headOfDepartmentId || null,
      description: data.description || null,
    }

    if (isEditMode) {
      updateDepartment(
        {
          params: {
            path: {
              id: departmentData!.id,
            },
          },
          body: payload,
        },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
    } else {
      createDepartment(
        {
          body: payload,
        },
        {
          onSuccess: () => {
            onSuccess?.()
          },
        },
      )
    }
  }

  // Lộ hàm kích hoạt submit ra ngoài cho Modal
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmit)()
    },
  }))

  const isFormLoading = isLoading || isUpdating

  // Chuyển đổi danh sách giảng viên thành định dạng options cho Antd Select
  const teacherOptions = teachersList.map((teacher) => ({
    value: teacher.id,
    label: teacher.fullName,
    code: teacher.staffCode,
    searchValue: `${teacher.fullName} ${teacher.staffCode || ''} ${teacher.id}`,
  }))

  return (
    <Spin spinning={isFormLoading} tip="Đang xử lý dữ liệu...">
      <Form
        layout="vertical"
        className="space-y-4 pt-1"
        component="form"
        onSubmitCapture={handleSubmit(onSubmit)}
      >
        {/* Phân vùng tiêu đề */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-blue-600" />
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            {isEditMode ? 'Cập nhật thông tin đơn vị đào tạo' : 'Thông tin đơn vị đào tạo'}
          </h3>
        </div>

        {/* CỘT 1: TÊN KHOA & MÃ KHOA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Tên Khoa */}
          <Form.Item
            label={<span className="font-semibold text-slate-700">Tên khoa chuyên môn</span>}
            required
            validateStatus={errors.deptName ? 'error' : ''}
            help={errors.deptName?.message}
            className="!mb-0"
          >
            <Controller
              name="deptName"
              control={control}
              rules={{ required: 'Tên khoa không được để trống' }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="VD: Khoa Công nghệ Ô tô"
                  prefix={<LayoutGrid size={17} className="mr-1 text-slate-400" />}
                  className="rounded-xl !border-slate-200 !bg-slate-50 hover:!border-blue-400 focus:!border-blue-600 focus:!bg-white"
                />
              )}
            />
          </Form.Item>

          {/* Mã Khoa */}
          <Form.Item
            label={<span className="font-semibold text-slate-700">Mã khoa</span>}
            required
            validateStatus={errors.deptCode ? 'error' : ''}
            help={errors.deptCode?.message}
            className="!mb-0"
          >
            <Controller
              name="deptCode"
              control={control}
              rules={{ required: 'Mã khoa là bắt buộc' }}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="VD: KCNOTO"
                  disabled={isEditMode}
                  prefix={<Hash size={17} className="mr-1 text-slate-400" />}
                  className={`rounded-xl ${
                    isEditMode
                      ? '!border-slate-200 !bg-slate-100 !text-slate-500'
                      : '!border-slate-200 !bg-slate-50 hover:!border-blue-400 focus:!border-blue-600 focus:!bg-white'
                  }`}
                />
              )}
            />
          </Form.Item>
        </div>

        {/* CỘT 2: BỔ NHIỆM TRƯỞNG KHOA (Dùng Antd Select có tìm kiếm) */}
        <Form.Item
          label={<span className="font-semibold text-slate-700">Trưởng khoa phụ trách</span>}
          className="!mb-0"
        >
          <Controller
            name="headOfDepartmentId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                showSearch
                allowClear
                loading={isLoadingTeachers}
                placeholder="Chọn trưởng khoa từ danh sách giảng viên..."
                optionFilterProp="searchValue"
                options={teacherOptions}
                optionRender={(option) => (
                  <div className="flex flex-col py-0.5">
                    <span className="font-semibold text-slate-800">{option.data.label}</span>
                    {option.data.code && (
                      <span className="text-xs text-slate-400">Mã cán bộ: {option.data.code}</span>
                    )}
                  </div>
                )}
                suffixIcon={<UserCircle size={18} className="text-slate-400" />}
                className="custom-antd-select w-full"
              />
            )}
          />
        </Form.Item>

        {/* CỘT 3: MÔ TẢ CHỨC NĂNG */}
        <Form.Item
          label={
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <FileText size={16} className="text-slate-400" /> Mô tả chức năng / nhiệm vụ khoa
            </span>
          }
          className="!mb-0"
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={4}
                placeholder="Nhập giới thiệu ngắn gọn hoặc vai trò nghiên cứu của khoa..."
                className="!rounded-xl !border-slate-200 !bg-slate-50 hover:!border-blue-400 focus:!border-blue-600 focus:!bg-white"
              />
            )}
          />
        </Form.Item>
      </Form>
    </Spin>
  )
})

CreateKhoaForm.displayName = 'CreateKhoaForm'

export default CreateKhoaForm
