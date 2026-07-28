import { useState } from 'react'
import { createContextProvider } from '../../../util/createContextProvider'
import type { components } from '../../../api/v1'
import { $api } from '../../../api/client'
import { useAppContext } from '../../../AppProvider'

export type CuriculumResponseDto = components['schemas']['CurriculumResponseDtoWithRelation']
export type CurriCulumSubjectDto = components['schemas']['CurriculumSubjectResponseDtoWithRelation']

export const [ChuongTrinhKhungProvider, useChuongTrinhKhungContext] = createContextProvider(() => {
  const { majors, isMajorsLoading } = useAppContext()

  // state
  const [selectedId, setSelectedId] = useState<string | null | number>(null)
  const [majorIdSelected, setMajorIdSelected] = useState<number | null>(null)

  // get chương trình khung
  const { data: curriculums, isFetching: isCurriculumsFetching } = $api.useQuery('get', '/curriculums')

  // get chi tiết
  const { data: curriculumOne, isFetching: isCurriculumOneFetching } = $api.useQuery(
    'get',
    '/curriculums/{id}',
    {
      params: {
        path: {
          id: selectedId as number,
        },
      },
    },
    {
      enabled: typeof selectedId === 'number' && selectedId !== null && !isNaN(selectedId),
    },
  )

  return {
    curriculums,
    isCurriculumsFetching,
    curriculumOne,
    isCurriculumOneFetching,
    majors,
    isMajorsLoading,

    selectedId,
    setSelectedId,
    majorIdSelected,
    setMajorIdSelected,
  }
})
