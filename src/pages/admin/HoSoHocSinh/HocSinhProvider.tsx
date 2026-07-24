import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { createContextProvider } from '../../../util/createContextProvider'
import { $api } from '../../../api/client'
import type { components, paths } from '../../../api/v1'
import { useState } from 'react'

export type HocSinhDto = components['schemas']['StudentDetailDto']
export type StatusHocSinhEnum = HocSinhDto['status']
export type createStudentDto = components['schemas']['CreateStudentDto']
export type SearchStudentDto = paths['/students']['get']['parameters']['query']

export const [HocSinhProvider, useHocSinhContext] = createContextProvider(() => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isOpenModalImport, setIsOpenModalImport] = useState(false)
  const { maSinhVien } = useParams() // Lấy id từ URL nếu có - dùng cho load trang chi tiết học sinh
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)
  const [filters, setFilters] = useState<SearchStudentDto>({
    page: 1,
    limit: 10,
  })

  /**
   * Lấy danh sách học sinh
   */
  const {
    data: studentsResponse,
    isLoading: isLoadingStudents,
    refetch: refetchStudents,
  } = $api.useQuery('get', '/students', {
    params: {
      query: {
        ...filters,
      },
    },
  })
  const students = studentsResponse?.data || []
  const total = studentsResponse?.total || 0

  /**
   * Lấy chi tiết 1 học sinh
   */
  const { data: studentDetail, isLoading: isGettingStudentDetail } = $api.useQuery(
    'get',
    '/students/search-by-code',
    {
      params: {
        query: {
          studentCode: maSinhVien || '',
        },
      },
    },
  )

  /**
   * Xóa học sinh - dành cho development
   * Lên production sẽ bỏ đi
   */
  const { mutate: deleteStudent, isPending: isDeletingStudent } = $api.useMutation(
    'delete',
    '/students/{id}',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get', '/students'] })
      },
    },
  )

  /**
   * Thêm học sinh
   */
  const { mutate: createStudent, isPending: isCreatingStudent } = $api.useMutation('post', '/students', {
    onSuccess: () => {
      refetchStudents()
    },
  })

  /**
   * Import dữ liệu học sinh
   */
  const { mutate: createManyStudents, isPending: isCreatingManyStudents } = $api.useMutation(
    'post',
    '/students/bulk',
    {
      onSuccess: () => {
        refetchStudents()
      },
      /* eslint-disable @typescript-eslint/no-explicit-any */
      onError: (error: any) => {
        alert(error.message || 'Có lỗi xảy ra khi import dữ liệu học sinh')
      },
    },
  )

  /**
   * Lấy danh sách khóa từ ngành đang chọn
   */
  const {
    data: khoaHocList,
    mutate: searchBatches,
    isPending: isSearchingBatches,
  } = $api.useMutation('get', '/batches')

  /**
   * Lấy major
   */
  const { data: majorList } = $api.useQuery('get', '/majors')

  return {
    students: students || [],
    deleteStudent,
    isDeletingStudent,
    isLoadingStudents,
    createStudent,
    isCreatingStudent,
    refetchStudents,
    createManyStudents,
    isCreatingManyStudents,
    khoaHocList: khoaHocList || [],
    searchBatches,
    isSearchingBatches,
    studentDetail,
    isGettingStudentDetail,
    majorList,

    navigate,
    isOpenModalImport,
    setIsOpenModalImport,
    isOpenModalCreate,
    setIsOpenModalCreate,
    filters: filters || {},
    setFilters,
    total,
  }
})
