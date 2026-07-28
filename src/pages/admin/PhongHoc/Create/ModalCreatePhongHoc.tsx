import React, { useState, useEffect } from 'react'
import { $api } from '../../../../api/client'
import type { components } from '../../../../api/v1'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { ROOM_TYPE_MAP, type RoomTypeEnum } from '../../../../api/enum'

export type CreateRoomDto = components['schemas']['CreateRoomDto']

interface Props {
  isOpen: boolean
  onClose: () => void
  roomId?: number | null // Truyền vào id phòng nếu muốn chuyển sang chế độ Update
}

const ModalCreatePhongHoc = ({ isOpen, onClose, roomId }: Props) => {
  const queryClient = useQueryClient()
  const isEditMode = !!roomId

  // Form states
  const [roomCode, setRoomCode] = useState<string>('')
  const [roomName, setRoomName] = useState<string>('')
  const [building, setBuilding] = useState<string>('')
  const [capacity, setCapacity] = useState<number | null>(null)
  const [type, setType] = useState<NonNullable<RoomTypeEnum>>('THEORY')

  // API chi tiết phòng phục vụ tính năng sửa đổi dữ liệu
  const { data: roomDetails, isLoading: isLoadingDetails } = $api.useQuery(
    'get',
    '/rooms/{id}',
    {
      params: { path: { id: roomId ?? 0 } },
    },
    {
      enabled: isOpen && isEditMode && !!roomId,
    },
  )

  // Điền dữ liệu cũ vào form nếu là Edit Mode
  useEffect(() => {
    if (isEditMode && roomDetails) {
      setRoomCode(roomDetails.roomCode || '')
      setRoomName(roomDetails.roomName || '')
      setBuilding(roomDetails.building || '')
      setCapacity(roomDetails.capacity ?? null)
      if (roomDetails.type) setType(roomDetails.type as NonNullable<RoomTypeEnum>)
    } else if (!isEditMode) {
      // Clear data về mặc định nếu là thêm mới
      setRoomCode('')
      setRoomName('')
      setBuilding('')
      setCapacity(null)
      setType('THEORY')
    }
  }, [roomDetails, isEditMode, isOpen])

  // Mutations
  const { mutate: mutationCreateRoom, isPending: isPendingCreateRoom } = $api.useMutation('post', '/rooms')
  const { mutate: mutateUpdateRoom, isPending: isPendingUpdateRoom } = $api.useMutation(
    'patch',
    '/rooms/{id}',
  )

  if (!isOpen) return null

  const isPending = isPendingCreateRoom || isPendingUpdateRoom

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateRoomDto = {
      roomCode,
      roomName: roomName.trim() !== '' ? roomName : null,
      building: building.trim() !== '' ? building : null,
      capacity: capacity ? Number(capacity) : null,
      type,
    }

    if (isEditMode && roomId) {
      // Xử lý CẬP NHẬT PHÒNG HỌC
      mutateUpdateRoom(
        {
          params: { path: { id: roomId } },
          body: payload,
        },
        {
          onSuccess: () => {
            onClose()
            queryClient.invalidateQueries({ queryKey: ['get', '/rooms'] })
          },
          onError: (error) => {
            console.error('Lỗi khi cập nhật phòng học:', error)
            alert('Cập nhật thông tin phòng học thất bại!')
          },
        },
      )
    } else {
      // Xử lý TẠO MỚI PHÒNG HỌC
      mutationCreateRoom(
        { body: payload },
        {
          onSuccess: () => {
            onClose()
            queryClient.invalidateQueries({ queryKey: ['get', '/rooms'] })
          },
          onError: (error) => {
            console.error('Lỗi khi tạo phòng học:', error)
            alert('Tạo phòng học thất bại!')
          },
        },
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl transition-all">
        <h3 className="mb-5 text-lg font-semibold text-gray-900">
          {isEditMode ? 'Cập Nhật Thông Tin Phòng Học' : 'Thêm Phòng Học Mới'}
        </h3>

        {isEditMode && isLoadingDetails ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Đang tải thông tin phòng học...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mã phòng học */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Mã phòng học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Ví dụ: PM402, XUONG01..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Tên phòng học */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Tên phòng học</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Ví dụ: Phòng Thực hành Mạng 1..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Tòa nhà */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Tòa nhà / Khu nhà</label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Ví dụ: Khu A, Tòa nhà Công nghệ..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Sức chứa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Sức chứa (Học sinh/Sinh viên)</label>
              <input
                type="number"
                min={1}
                value={capacity ?? ''}
                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : null)}
                placeholder="Nhập số lượng, ví dụ: 40"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Loại phòng học */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Loại phòng học <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NonNullable<RoomTypeEnum>)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {Object.entries(ROOM_TYPE_MAP).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex min-w-[100px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    Xử lý...
                  </>
                ) : isEditMode ? (
                  'Lưu thay đổi'
                ) : (
                  'Tạo phòng'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ModalCreatePhongHoc
