import React, { useRef, useState } from 'react'
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  Paperclip,
} from 'lucide-react'
import { toast } from 'sonner'
import { $api } from '../../../../../api/client'
import { DOCUMENT_STATUS_MAP, type DocumentStatusEnum } from '../../../../../api/enum'
import type { components } from '../../../../../api/v1'
import { useHoSoTuyenSinhOneContext } from './HoSoTuyenSinhOneProvider'

export type UploadDocumentDto = components['schemas']['CreateAdmissionDocumentDto']

const TabAdmissionDocument = () => {
  const { profileData, handleVerifyDocument, isVerifyingDoc } = useHoSoTuyenSinhOneContext()

  const profileId = profileData?.profile?.id

  // -------------------------------------------------------------
  // BƯỚC 1: Load Cấu hình hồ sơ cần có (Document Config)
  // -------------------------------------------------------------
  const { data: documentConfig, isLoading: isLoadingDocumentConfig } = $api.useQuery(
    'get',
    '/document-configs/latest-before-date',
    {
      params: {
        query: {
          targetDateInput: profileData?.profile?.createdAt || new Date().toISOString(),
        },
      },
    },
  )

  // -------------------------------------------------------------
  // BƯỚC 2: Load các Documents hiện có của bộ hồ sơ này
  // -------------------------------------------------------------
  const {
    data: admissionDocuments,
    isLoading: isLoadingAdmissionDocuments,
    refetch: refetchDocuments,
  } = $api.useQuery(
    'get',
    '/admission-documents/profile/{profileId}',
    {
      params: {
        path: {
          profileId: profileId!,
        },
      },
    },
    {
      enabled: !!profileId,
    },
  )

  // API Mutations
  const { mutate: uploadDocument, isPending: isUploadingDocument } = $api.useMutation(
    'post',
    '/admission-documents',
  )

  const { mutate: deleteDocument, isPending: isDeletingDocument } = $api.useMutation(
    'delete',
    '/admission-documents/{id}',
  )

  // State theo dõi item nào đang được chọn để upload
  const [uploadingItemId, setUploadingItemId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedItemIdForUpload, setSelectedItemIdForUpload] = useState<number | null>(null)

  // Trigger click chọn file
  const handleTriggerUpload = (documentConfigItemId: number) => {
    setSelectedItemIdForUpload(documentConfigItemId)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  // Xử lý khi user chọn xong file -> Giả lập/Gọi upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profileId || !selectedItemIdForUpload) return

    setUploadingItemId(selectedItemIdForUpload)

    try {
      // Khởi tạo FormData để gửi multipart/form-data
      const formData = new FormData()
      formData.append('admissionProfileId', profileId.toString())
      formData.append('documentConfigItemId', selectedItemIdForUpload.toString())
      formData.append('file', file) // Truyền trực tiếp File object

      uploadDocument(
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: formData as any, // Cast sang any để tránh lệch type với OpenAPI client
        },
        {
          onSuccess: () => {
            toast.success(`Đã tải lên giấy tờ: ${file.name}`)
            refetchDocuments()
          },
          onError: () => {
            toast.error('Tải lên giấy tờ thất bại!')
          },
          onSettled: () => {
            setUploadingItemId(null)
            setSelectedItemIdForUpload(null)
          },
        },
      )
    } catch (error) {
      console.log('Error uploading file:', error)
      toast.error('Có lỗi xảy ra trong quá trình xử lý file!')
      setUploadingItemId(null)
      setSelectedItemIdForUpload(null)
    }
  }

  // Xóa tài liệu
  const handleDeleteDoc = (docId: number, fileName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa file "${fileName}"?`)) return

    deleteDocument(
      { params: { path: { id: docId } } },
      {
        onSuccess: () => {
          toast.success('Đã xóa tài liệu thành công!')
          refetchDocuments()
        },
        onError: () => {
          toast.error('Xóa tài liệu thất bại!')
        },
      },
    )
  }

  // Tải hàng loạt tất cả các file của 1 mục giấy tờ
  const handleDownloadAll = (files: typeof admissionDocuments) => {
    if (!files || files.length === 0) return
    files.forEach((doc) => {
      const a = document.createElement('a')
      a.href = doc.fileUrl
      a.download = doc.fileName || 'tai-lieu'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
  }

  const isLoading = isLoadingDocumentConfig || isLoadingAdmissionDocuments

  if (isLoading) {
    return (
      <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-slate-100 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const configItems = documentConfig?.items || []
  const uploadedDocsList = admissionDocuments || []

  return (
    <div className="space-y-6">
      {/* Input File Ẩn Dùng Chung */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Header tổng quan */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <FileText className="h-5 w-5 text-indigo-600" /> Danh Sách Checklist Giấy Tờ Hồ Sơ
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Cấu hình áp dụng: <b className="text-slate-700">{documentConfig?.name || 'Mặc định'}</b>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            Đã nộp: {uploadedDocsList.length} file
          </span>
        </div>
      </div>

      {/* Danh Sách Mục Giấy Tờ Theo Cấu Hình */}
      {configItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="text-xs text-slate-500">Chưa có cấu hình danh mục giấy tờ yêu cầu nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {configItems.map((item) => {
            // Lọc ra danh sách các file ứng với Config Item này
            const itemFiles = uploadedDocsList.filter((doc) => doc.documentConfigItemId === item.id)
            const hasFiles = itemFiles.length > 0
            const isCurrentlyUploading = uploadingItemId === item.id

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs transition-all ${
                  hasFiles ? 'border-slate-200' : 'border-amber-200/70 bg-amber-50/10'
                }`}
              >
                {/* Header Tiêu Đề Của Loại Giấy Tờ */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        hasFiles ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100/60 text-amber-600'
                      }`}
                    >
                      {hasFiles ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                        {item.required ? (
                          <span className="rounded-md border border-rose-200/60 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                            Bắt buộc
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                            Tùy chọn
                          </span>
                        )}
                        {item.code && (
                          <span className="font-mono text-[11px] text-slate-400">({item.code})</span>
                        )}
                      </div>

                      {/* Trạng thái Tổng quan */}
                      <p className="mt-0.5 text-xs text-slate-500">
                        Trạng thái:{' '}
                        {hasFiles ? (
                          <span className="font-semibold text-emerald-600">
                            Đã đính kèm ({itemFiles.length} file)
                          </span>
                        ) : (
                          <span className="font-medium text-amber-600">Chưa có file nào</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Hành động chính ở cấp Danh mục */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Nút Tải hàng loạt nếu có nhiều file */}
                    {hasFiles && (
                      <button
                        onClick={() => handleDownloadAll(itemFiles)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        title="Tải tất cả tệp thuộc mục này"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-500" />
                        Tải hàng loạt
                      </button>
                    )}

                    {/* Nút Thêm file mới */}
                    <button
                      disabled={isCurrentlyUploading || isUploadingDocument}
                      onClick={() => handleTriggerUpload(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isCurrentlyUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Upload className="h-3.5 w-3.5" />
                      )}
                      Thêm tệp
                    </button>
                  </div>
                </div>

                {/* Danh Sách Các File Đã Upload Thuộc Item Này */}
                {hasFiles && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="space-y-2">
                      {itemFiles.map((doc) => {
                        const statusConfig = DOCUMENT_STATUS_MAP[
                          doc.status as NonNullable<DocumentStatusEnum>
                        ] || {
                          label: doc.status,
                          colorClass: 'bg-slate-100 text-slate-600',
                        }

                        return (
                          <div
                            key={doc.id}
                            className="flex flex-col justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:flex-row sm:items-center"
                          >
                            {/* Thông tin File */}
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate text-xs font-semibold text-indigo-600 hover:underline"
                                    title={doc.fileName}
                                  >
                                    {doc.fileName}
                                  </a>
                                  <span
                                    className={`py-0.2 shrink-0 rounded-full border px-2 text-[10px] font-semibold ${statusConfig.colorClass}`}
                                  >
                                    {statusConfig.label}
                                  </span>
                                </div>
                                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
                                  <span>Dung lượng: {(doc.fileSize / 1024).toFixed(1)} KB</span>
                                  <span>•</span>
                                  <span>
                                    Ngày tải: {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                                  </span>
                                  {doc.rejectionReason && (
                                    <span className="font-medium text-rose-500">
                                      (Lý do từ chối: {doc.rejectionReason})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Các Nút Thao Tác Trực Tiếp Trên File */}
                            <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                              {/* Link mở file */}
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                download={doc.fileName}
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
                                title="Tải về / Xem"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>

                              {/* Duyệt Document */}
                              {doc.status !== 'APPROVED' && (
                                <button
                                  onClick={() => handleVerifyDocument(doc.id, 'APPROVED')}
                                  disabled={isVerifyingDoc}
                                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  Duyệt
                                </button>
                              )}

                              {/* Từ chối Document */}
                              {doc.status !== 'REJECTED' && (
                                <button
                                  onClick={() =>
                                    handleVerifyDocument(doc.id, 'REJECTED', 'Giấy tờ không hợp lệ')
                                  }
                                  disabled={isVerifyingDoc}
                                  className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                                >
                                  Từ chối
                                </button>
                              )}

                              {/* Xóa Document */}
                              <button
                                disabled={isDeletingDocument}
                                onClick={() => handleDeleteDoc(doc.id, doc.fileName)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                title="Xóa file này"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TabAdmissionDocument
