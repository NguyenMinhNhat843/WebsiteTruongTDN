import React, { useState, useMemo } from 'react'
import { Search, X, Check, Loader2 } from 'lucide-react'
import { $api } from '../../../../api/client'
import type { SubjectDto } from '../../MonHoc/MonHocList'

interface ModalAddSubjectProps {
  open: boolean
  onClose: () => void
  currentSubjects?: SubjectDto[]
  onSubmit: (selectedSubjects: SubjectDto[]) => void
}

const ModalAddSubject: React.FC<ModalAddSubjectProps> = ({
  open,
  onClose,
  currentSubjects = [],
  onSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedList, setSelectedList] = useState<SubjectDto[]>([])

  // API lấy danh sách môn học
  const { data: subjects, isLoading: isSubjectsFetching } = $api.useQuery('get', '/subjects')

  // Lọc danh sách: Bỏ các môn đã có trong `currentSubjects` + lọc theo từ khóa tìm kiếm
  const availableSubjects = useMemo(() => {
    if (!subjects) return []

    const currentIds = new Set(currentSubjects.map((s) => s.id))

    return subjects.filter((subject) => {
      const isAlreadyAdded = currentIds.has(subject.id)
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        subject.subjectName.toLowerCase().includes(searchLower) ||
        subject.subjectCode.toLowerCase().includes(searchLower)

      return !isAlreadyAdded && matchesSearch
    })
  }, [subjects, currentSubjects, searchTerm])

  // Xử lý chọn/bỏ chọn
  const handleToggleSelect = (subject: SubjectDto) => {
    const exists = selectedList.some((s) => s.id === subject.id)
    if (exists) {
      setSelectedList(selectedList.filter((s) => s.id !== subject.id))
    } else {
      setSelectedList([...selectedList, subject])
    }
  }

  // Bỏ 1 môn ra khỏi danh sách tạm đã chọn
  const handleRemoveFromSelected = (subjectId: number) => {
    setSelectedList(selectedList.filter((s) => s.id !== subjectId))
  }

  // Xác nhận
  const handleOk = () => {
    onSubmit(selectedList)
    handleCancel()
  }

  // Đóng & Reset state
  const handleCancel = () => {
    setSearchTerm('')
    setSelectedList([])
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal Container */}
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Thêm môn học</h3>
          <button
            onClick={handleCancel}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
          {/* Input Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-8 pl-9 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Danh sách môn ĐÃ CHỌN ĐỂ THÊM (Chíp Tag) */}
          {selectedList.length > 0 && (
            <div className="rounded-md bg-blue-50 p-3">
              <span className="mb-2 block text-xs font-medium text-blue-700">
                Đã chọn ({selectedList.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedList.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                  >
                    <span>
                      <strong className="font-semibold">{item.subjectCode}</strong> - {item.subjectName} (
                      {item.credits} TC)
                    </span>
                    <button
                      onClick={() => handleRemoveFromSelected(item.id)}
                      className="rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <X className="h-3 w-3 text-blue-600" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Danh sách môn học có sẵn */}
          <div className="max-h-72 flex-1 overflow-y-auto rounded-md border border-gray-200">
            {isSubjectsFetching ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Đang tải dữ liệu...</span>
              </div>
            ) : availableSubjects.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">Không tìm thấy môn học phù hợp</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {availableSubjects.map((subject) => {
                  const isChecked = selectedList.some((s) => s.id === subject.id)
                  return (
                    <div
                      key={subject.id}
                      onClick={() => handleToggleSelect(subject)}
                      className={`flex cursor-pointer items-center justify-between p-3.5 transition-colors ${
                        isChecked ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Custom Checkbox */}
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isChecked ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>

                        {/* Thông tin môn */}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <span className="mr-2 font-semibold text-blue-600">[{subject.subjectCode}]</span>
                            {subject.subjectName}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500">
                            Số tín chỉ: {subject.credits} TC | LT: {subject.theoryHours}h - TH:{' '}
                            {subject.practiceHours}h
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Hủy
          </button>
          <button
            onClick={handleOk}
            disabled={selectedList.length === 0}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Thêm {selectedList.length > 0 && `(${selectedList.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalAddSubject
