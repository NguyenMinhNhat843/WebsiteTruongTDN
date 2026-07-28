import React, { useState } from 'react'
import { Plus, MapPin, Loader2, X, Save, Compass } from 'lucide-react'
import { $api } from '../../../api/client'
import ProvinceNode from './components/ProvinceNode'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import PageShell from '../../../components/ui/PageShell'
import ButtonAction from '../../../components/ui/ButtonAction'

interface ModalState {
  isOpen: boolean
  type: 'create' | 'update'
  level: 'province' | 'ward' | 'village'
  parentCode?: string
  currentData?: {
    code?: string
    id?: number
    name: string
    fullName?: string
    codeName?: string
  }
}

export default function DiaChiTree() {
  const queryClient = useQueryClient()
  const { data: provinces, isLoading, refetch: refetchProvinces } = $api.useQuery('get', '/provinces')

  const createProvince = $api.useMutation('post', '/provinces')
  const updateProvince = $api.useMutation('patch', '/provinces/{code}')
  const deleteProvince = $api.useMutation('delete', '/provinces/{code}')

  const createWard = $api.useMutation('post', '/wards')
  const updateWard = $api.useMutation('patch', '/wards/{code}')
  const deleteWard = $api.useMutation('delete', '/wards/{code}')

  const createVillage = $api.useMutation('post', '/villages')
  const updateVillage = $api.useMutation('patch', '/villages/{id}')
  const deleteVillage = $api.useMutation('delete', '/villages/{id}')

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'create',
    level: 'province',
  })

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    fullName: '',
    codeName: '',
  })

  // Trạng thái loading khi đang submit form
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async (level: 'province' | 'ward' | 'village', idOrCode: string | number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục này và tất cả các cấp con trực thuộc?')) return

    if (level === 'province') {
      await deleteProvince.mutateAsync({
        params: { path: { code: idOrCode as string } },
      })
      refetchProvinces()
    } else if (level === 'ward') {
      await deleteWard.mutateAsync({
        params: { path: { code: idOrCode as string } },
      })
    } else {
      await deleteVillage.mutateAsync({
        params: { path: { id: idOrCode as number } },
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Guard Clause: Kiểm tra dữ liệu bắt buộc trước khi xử lý
    if (modal.type === 'edit' && !modal.currentData) {
      alert('Không tìm thấy thông tin dữ liệu cần chỉnh sửa!')
      return
    }

    if (
      modal.type === 'create' &&
      (modal.level === 'ward' || modal.level === 'village') &&
      !modal.parentCode
    ) {
      alert('Không tìm thấy mã cấp cha tương ứng!')
      return
    }

    setIsSubmitting(true)

    try {
      if (modal.level === 'province') {
        if (modal.type === 'create') {
          await createProvince.mutateAsync({ body: formData })
        } else {
          // Dùng ! trực tiếp vào currentData vì đã check ở Guard Clause phía trên
          const code = modal.currentData!.code
          if (!code) throw new Error('Mã tỉnh/thành không tồn tại')

          await updateProvince.mutateAsync({
            params: { path: { code } },
            body: {
              name: formData.name,
              fullName: formData.fullName,
              codeName: formData.codeName,
            },
          })
        }
        refetchProvinces()
      } else if (modal.level === 'ward') {
        if (modal.type === 'create') {
          await createWard.mutateAsync({
            body: { ...formData, provinceCode: modal.parentCode! },
          })
        } else {
          const code = modal.currentData!.code
          if (!code) throw new Error('Mã xã/phường không tồn tại')

          await updateWard.mutateAsync({
            params: { path: { code } },
            body: {
              name: formData.name,
              fullName: formData.fullName,
              codeName: formData.codeName,
            },
          })
        }
        queryClient.invalidateQueries({
          queryKey: ['get', '/wards'],
        })
        queryClient.invalidateQueries({
          queryKey: ['get', '/villages'],
        })
      } else if (modal.level === 'village') {
        if (modal.type === 'create') {
          await createVillage.mutateAsync({
            body: { name: formData.name, wardCode: modal.parentCode! },
          })
        } else {
          const id = modal.currentData!.id
          if (id === undefined) throw new Error('ID thôn/bản không tồn tại')

          await updateVillage.mutateAsync({
            params: { path: { id } },
            body: { name: formData.name },
          })
        }

        queryClient.invalidateQueries({
          queryKey: ['get', '/villages'],
        })
      }

      setModal((prev) => ({ ...prev, isOpen: false }))
    } catch (error) {
      console.error('Submit error:', error)
      alert('Đã có lỗi xảy ra khi lưu dữ liệu!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openModal = (
    type: 'create' | 'update',
    level: 'province' | 'ward' | 'village',
    parentCode?: string,
    currentData?: any,
  ) => {
    setModal({ isOpen: true, type, level, parentCode, currentData })
    if (type === 'update' && currentData) {
      setFormData({
        code: currentData.code || '',
        name: currentData.name,
        fullName: currentData.fullName || '',
        codeName: currentData.codeName || '',
      })
    } else {
      setFormData({ code: '', name: '', fullName: '', codeName: '' })
    }
  }

  // UI Skeleton Loading sang chảnh thay vì dòng chữ thô sơ
  if (isLoading)
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-4 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-1/3 rounded bg-slate-200"></div>
          <div className="h-10 w-40 rounded bg-slate-200"></div>
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-14 rounded-lg border border-slate-200/60 bg-slate-100"></div>
        ))}
      </div>
    )

  return (
    <PageShell
      title="Quản Lý Địa Danh Hành Chính"
      sub="Cấu trúc cây dữ liệu Tỉnh / Thành phố • Xã / Phường • Thôn / Xóm"
      icon={Compass}
      renderRight={
        <ButtonAction
          label="Thêm Tỉnh / Thành"
          icon={<Plus size={16} className="stroke-[2.5]" />}
          onClick={() => openModal('create', 'province')}
        />
      }
    >
      <div className="min-h-screen">
        {/* CÂY THƯ MỤC GỐC */}
        <div className="space-y-3">
          {provinces && provinces.length > 0 ? (
            provinces.map((province) => (
              <ProvinceNode
                key={province.code}
                province={province}
                onEdit={(data: any) => openModal('update', 'province', undefined, data)}
                onAddChild={(code: string) => openModal('create', 'ward', code)}
                onDelete={(code: string) => handleDelete('province', code)}
                openModal={openModal}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <MapPin size={32} className="mx-auto mb-2 stroke-[1.5] text-slate-300" />
              <p className="text-sm text-slate-400">Chưa có dữ liệu đơn vị hành chính nào.</p>
            </div>
          )}
        </div>

        {/* MODAL ĐƠN (UPGRADED UI/UX) */}
        {modal.isOpen && (
          <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
            <form
              onSubmit={handleSubmit}
              className="animate-scaleUp relative flex w-full max-w-md flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-xl"
            >
              {/* Nút đóng modal góc phải */}
              <button
                type="button"
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="absolute top-4 right-4 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-800">
                  {modal.type === 'create' ? 'Thêm mới' : 'Cập nhật'}{' '}
                  <span className="text-blue-600">
                    {modal.level === 'province'
                      ? 'Tỉnh/Thành'
                      : modal.level === 'ward'
                        ? 'Xã/Phường'
                        : 'Thôn/Xóm'}
                  </span>
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Vui lòng điền đầy đủ các thông tin bắt buộc dưới đây.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                {/* Trường Code */}
                {modal.type === 'create' && modal.level !== 'village' && (
                  <div>
                    <label className="mb-1 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                      Mã Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: 79, 01,..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>
                )}

                {/* Trường Tên rút gọn */}
                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                    Tên gọi ngắn gọn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ví dụ: Khánh Hòa, Diên Khánh..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Nhóm trường Tỉnh/Xã */}
                {modal.level !== 'village' && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                        Tên đầy đủ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ví dụ: Tỉnh Khánh Hòa..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold tracking-wide text-slate-700 uppercase">
                        Code Name (Slug) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ví dụ: khanh_hoa"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        value={formData.codeName}
                        onChange={(e) => setFormData({ ...formData, codeName: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PageShell>
  )
}
