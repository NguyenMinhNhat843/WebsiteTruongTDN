import React, { useState, useMemo, useEffect } from 'react'
import { useHocSinhContext } from '../../HocSinhProvider'
import { $api } from '../../../../../api/client'
import {
  Filter,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Users,
  Loader2,
  AlertCircle,
  X,
  ChevronDown,
  IdCard,
} from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */
const Filters = () => {
  // Call APIs lấy dữ liệu Ngành, Khóa học và Lớp học
  const { data: majorList } = $api.useQuery('get', '/majors')
  const { data: rawKhoaHocList, isLoading: isLoadingKhoaHocs } = $api.useQuery('get', '/batches')
  const { data: rawClassList, isLoading: isLoadingClasses } = $api.useQuery('get', '/classes')

  const { setFilters, filters } = useHocSinhContext()

  // State cục bộ riêng cho mã sinh viên để debounce gõ phím
  const [studentCodeInput, setStudentCodeInput] = useState(filters?.studentCode || '')

  // 1. Debounce cho ô Mã sinh viên (400ms mới setFilters)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        studentCode: studentCodeInput.trim() || undefined,
        page: 1, // Reset về trang 1 khi tìm kiếm mã mới
      }))
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [studentCodeInput, setFilters])

  // Đồng bộ lại ô input nếu bộ lọc bị xóa từ bên ngoài
  useEffect(() => {
    setStudentCodeInput(filters?.studentCode || '')
  }, [filters?.studentCode])

  // Chuẩn hóa danh sách Ngành học
  const majorOptions = useMemo(() => {
    return (majorList || []).map((major: any) => ({
      value: Number(major.id),
      label: major.name || major.majorName || `Ngành ${major.id}`,
    }))
  }, [majorList])

  // Destructure lấy các thuộc tính cần dùng ra ngoài
  const majorId = filters?.majorId
  const batchId = filters?.batchId

  // Lọc Khóa học dựa trên majorId đang chọn
  const filteredBatchesOptions = useMemo(() => {
    if (!majorId) return []
    const selectedMajorId = Number(majorId)

    return (rawKhoaHocList || [])
      .filter((batch: any) => Number(batch.majorId) === selectedMajorId)
      .map((batch: any) => ({
        value: Number(batch.id),
        label: batch.name || batch.batchName || `Khóa ${batch.id}`,
      }))
  }, [majorId, rawKhoaHocList])

  // Lọc Lớp học dựa trên batchId đang chọn
  const filteredClassOptions = useMemo(() => {
    if (!batchId) return []
    const selectedBatchId = Number(batchId)

    return (rawClassList || [])
      .filter((cls: any) => Number(cls.batchId) === selectedBatchId)
      .map((cls: any) => ({
        value: Number(cls.id),
        label: cls.className || cls.classCode || `Lớp ${cls.id}`,
      }))
  }, [batchId, rawClassList])

  // Handler: Thay đổi ngành học
  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilters((prev) => ({
      ...prev,
      majorId: value ? Number(value) : undefined,
      batchId: undefined, // Reset Khóa học
      classId: undefined, // Reset Lớp học
      page: 1,
    }))
  }

  // Handler: Thay đổi khóa học
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilters((prev) => ({
      ...prev,
      batchId: value ? Number(value) : undefined,
      classId: undefined, // Reset Lớp học
      page: 1,
    }))
  }

  // Handler: Thay đổi lớp học
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilters((prev) => ({
      ...prev,
      classId: value ? Number(value) : undefined,
      page: 1,
    }))
  }

  // Handler: Nút đặt lại bộ lọc
  const handleClearFilters = () => {
    setStudentCodeInput('')
    setFilters((prev) => ({
      ...prev,
      studentCode: undefined,
      majorId: undefined,
      batchId: undefined,
      classId: undefined,
      page: 1,
    }))
  }

  // Kiểm tra xem đang có bộ lọc nâng cao nào active không
  const hasActiveFilters = Boolean(
    filters?.studentCode || filters?.majorId || filters?.batchId || filters?.classId,
  )

  return (
    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* HEADER BỘ LỌC */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Filter className="h-4 w-4" />
          </div>
          <span>Bộ lọc tìm kiếm</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400 transition-transform duration-300 group-hover:-rotate-90 group-hover:text-rose-500" />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>

      {/* GRID CÁC TRƯỜNG LỌC */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Ô TÌM KIẾM THEO MÃ SINH VIÊN */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Mã sinh viên</label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-slate-400">
              <IdCard className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Nhập mã sinh viên..."
              value={studentCodeInput}
              onChange={(e) => setStudentCodeInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            />
            {studentCodeInput && (
              <button
                type="button"
                onClick={() => setStudentCodeInput('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Ô CHỌN NGÀNH HỌC */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Ngành học</label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-slate-400">
              <BookOpen className="h-4 w-4" />
            </span>
            <select
              value={filters?.majorId || ''}
              onChange={handleMajorChange}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-700 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            >
              <option value="">-- Tất cả ngành học --</option>
              {majorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* 3. Ô CHỌN KHÓA HỌC */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Khóa học</label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-slate-400">
              {isLoadingKhoaHocs ? (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              ) : !filters?.majorId ? (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              ) : (
                <GraduationCap className="h-4 w-4" />
              )}
            </span>
            <select
              value={filters?.batchId || ''}
              onChange={handleBatchChange}
              disabled={!filters?.majorId || isLoadingKhoaHocs}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-700 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
            >
              {!filters?.majorId ? (
                <option value="">⚠️ Chọn ngành học trước</option>
              ) : (
                <>
                  <option value="">-- Tất cả khóa học --</option>
                  {filteredBatchesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* 4. Ô CHỌN LỚP HỌC */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Lớp học</label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-slate-400">
              {isLoadingClasses ? (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              ) : !filters?.batchId ? (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              ) : (
                <Users className="h-4 w-4" />
              )}
            </span>
            <select
              value={filters?.classId || ''}
              onChange={handleClassChange}
              disabled={!filters?.batchId || isLoadingClasses}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-8 pl-9 text-xs font-medium text-slate-700 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
            >
              {!filters?.batchId ? (
                <option value="">⚠️ Chọn khóa học trước</option>
              ) : (
                <>
                  <option value="">-- Tất cả lớp học --</option>
                  {filteredClassOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filters
