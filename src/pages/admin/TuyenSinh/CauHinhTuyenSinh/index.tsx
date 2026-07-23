import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Edit2, Trash2, Calendar, FileCheck, X, Loader2, ListPlus } from 'lucide-react'
import { toast } from 'sonner'
import { $api } from '../../../../api/client'
import type { components } from '../../../../api/v1'

export type DocumentConfigDetailDto = components['schemas']['DocumentConfigDetailDto']
export type CreateDocumentConfigDto = components['schemas']['CreateDocumentConfigDto']

// Type cho Form values
type FormValues = {
  name: string
  startDate: string
  items: {
    name: string
    code?: string
    required?: boolean
    sortOrder?: number
  }[]
}

const DocumentConfigManagement = () => {
  // Query & Mutations
  const {
    data: configResponse,
    isLoading: isLoadingConfigDocuments,
    refetch,
  } = $api.useQuery('get', '/document-configs')

  const { mutate: createConfigDocument, isPending: isCreating } = $api.useMutation(
    'post',
    '/document-configs',
  )

  const { mutate: updateConfigDocument, isPending: isUpdating } = $api.useMutation(
    'patch',
    '/document-configs/{id}',
  )

  const { mutate: deleteConfigDocument, isPending: isDeleting } = $api.useMutation(
    'delete',
    '/document-configs/{id}',
  )

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // State tạm cho input item mới trước khi push vào useFieldArray
  const [newItemName, setNewItemName] = useState('')
  const [newItemCode, setNewItemCode] = useState('')
  const [newItemRequired, setNewItemRequired] = useState(true)

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      items: [],
    },
  })

  // Field Array quản lý mảng items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // Mở modal & Reset Form
  const handleOpenModal = (config?: DocumentConfigDetailDto) => {
    if (config) {
      setEditingId(config.id)
      reset({
        name: config.name,
        startDate: config.startDate ? new Date(config.startDate).toISOString().split('T')[0] : '',
        items:
          config.items?.map((item) => ({
            name: item.name,
            code: item.code || '',
            required: item.required ?? true,
            sortOrder: item.sortOrder ?? 0,
          })) || [],
      })
    } else {
      setEditingId(null)
      reset({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        items: [],
      })
    }
    setNewItemName('')
    setNewItemCode('')
    setNewItemRequired(true)
    setIsModalOpen(true)
  }

  // Thêm item mới vào useFieldArray
  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast.error('Vui lòng nhập tên mục giấy tờ')
      return
    }

    append({
      name: newItemName.trim(),
      code: newItemCode.trim() || undefined,
      required: newItemRequired,
      sortOrder: fields.length,
    })

    // Reset input tạm
    setNewItemName('')
    setNewItemCode('')
    setNewItemRequired(true)
  }

  // Submit Handler
  const onSubmit = (data: FormValues) => {
    const payload: CreateDocumentConfigDto = {
      name: data.name.trim(),
      startDate: new Date(data.startDate).toISOString(),
      items: data.items.map((item, index) => ({
        ...item,
        sortOrder: index,
      })),
    }

    if (editingId) {
      updateConfigDocument(
        {
          params: { path: { id: editingId } },
          body: payload,
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật cấu hình hồ sơ thành công!')
            setIsModalOpen(false)
            refetch()
          },
          onError: () => {
            toast.error('Cập nhật thất bại')
          },
        },
      )
    } else {
      createConfigDocument(
        { body: payload },
        {
          onSuccess: () => {
            toast.success('Tạo mới cấu hình hồ sơ thành công!')
            setIsModalOpen(false)
            refetch()
          },
          onError: () => {
            toast.error('Tạo mới thất bại')
          },
        },
      )
    }
  }

  // Delete Config
  const handleDelete = (id: number, configName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa cấu hình "${configName}"?`)) {
      deleteConfigDocument(
        { params: { path: { id } } },
        {
          onSuccess: () => {
            toast.success('Xóa cấu hình thành công!')
            refetch()
          },
          onError: () => {
            toast.error('Xóa cấu hình thất bại')
          },
        },
      )
    }
  }

  const configsList = configResponse || []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Cấu Hình Hồ Sơ Tuyển Sinh</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Quản lý các loại hồ sơ, giấy tờ cần thiết cho quá trình đăng ký xét tuyển
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Thêm cấu hình mới
        </button>
      </div>

      {/* Grid Cards Container */}
      {isLoadingConfigDocuments ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : configsList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <FileCheck className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Chưa có cấu hình hồ sơ nào</p>
          <p className="mt-1 text-xs text-slate-400">
            Nhấn vào nút "Thêm cấu hình mới" ở trên để bắt đầu tạo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {configsList.map((config) => (
            <div
              key={config.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-800">{config.name}</h3>
                      <span className="text-[11px] font-medium text-slate-400">ID: #{config.id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(config)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={() => handleDelete(config.id, config.name)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Ngày áp dụng */}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Áp dụng từ:{' '}
                    <b className="text-slate-700">
                      {config.startDate ? new Date(config.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </b>
                  </span>
                </div>

                {/* List Items */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Danh sách giấy tờ yêu cầu</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                      {config.items?.length || 0} mục
                    </span>
                  </div>

                  <div className="custom-scrollbar max-h-48 space-y-1.5 overflow-y-auto pr-1">
                    {config.items && config.items.length > 0 ? (
                      config.items.map((item) => (
                        <div
                          key={item.id || item.code}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden pr-2">
                            <div
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.required ? 'bg-amber-500' : 'bg-slate-300'}`}
                            />
                            <span className="truncate font-medium text-slate-700">{item.name}</span>
                            {item.code && (
                              <span className="font-mono text-[10px] text-slate-400">({item.code})</span>
                            )}
                          </div>
                          <span
                            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                              item.required
                                ? 'border border-amber-200/60 bg-amber-50 text-amber-700'
                                : 'bg-slate-200/60 text-slate-600'
                            }`}
                          >
                            {item.required ? 'Bắt buộc' : 'Tùy chọn'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="py-2 text-center text-xs text-slate-400 italic">
                        Chưa có mục giấy tờ nào được cấu hình
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL FORM USING REACT HOK FORM                           */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs duration-200">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-800">
                {editingId ? 'Chỉnh Sửa Cấu Hình Hồ Sơ' : 'Thêm Cấu Hình Hồ Sơ Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-5"
            >
              {/* Tên cấu hình */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Tên cấu hình <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Tên cấu hình không được để trống' })}
                  placeholder="VD: Cấu hình hồ sơ Tuyển sinh ĐH 2026"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name.message}</p>}
              </div>

              {/* Ngày áp dụng */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Ngày bắt đầu áp dụng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('startDate', { required: 'Vui lòng chọn ngày bắt đầu' })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                {errors.startDate && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.startDate.message}</p>
                )}
              </div>

              {/* Thêm Items Động */}
              <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <label className="block text-xs font-bold text-slate-700">
                  Danh sách các giấy tờ yêu cầu
                </label>

                {/* Sub-inputs để thêm mục giấy tờ */}
                <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-12">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Tên giấy tờ (VD: Bằng THPT)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Mã (BANG_THPT)"
                      value={newItemCode}
                      onChange={(e) => setNewItemCode(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-indigo-500"
                    />
                  </div>
                  <div className="flex items-center gap-1 py-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="newItemReq"
                      checked={newItemRequired}
                      onChange={(e) => setNewItemRequired(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="newItemReq" className="text-xs font-medium text-slate-600">
                      Bắt buộc
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      <ListPlus className="h-3.5 w-3.5" /> Thêm
                    </button>
                  </div>
                </div>

                {/* Danh sách items từ useFieldArray */}
                <div className="custom-scrollbar mt-3 max-h-36 space-y-1.5 overflow-y-auto">
                  {fields.length === 0 ? (
                    <p className="py-1 text-center text-[11px] text-slate-400">
                      Chưa có giấy tờ nào trong danh sách
                    </p>
                  ) : (
                    fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400">{index + 1}.</span>
                          <span className="font-medium text-slate-700">{field.name}</span>
                          {field.code && (
                            <span className="font-mono text-[10px] text-slate-400">({field.code})</span>
                          )}
                          <span
                            className={`py-0.2 ml-2 rounded px-1.5 text-[10px] ${
                              field.required
                                ? 'border border-amber-200 bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {field.required ? 'Bắt buộc' : 'Không'}
                          </span>
                        </div>

                        {/* Button xóa item trong FieldArray */}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentConfigManagement
