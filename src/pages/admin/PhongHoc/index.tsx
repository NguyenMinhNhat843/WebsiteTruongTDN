import { useState } from 'react'
import { DoorOpen, Plus } from 'lucide-react'
import PageShell from '../../../components/ui/PageShell'
import ModalCreatePhongHoc from './Create/ModalCreatePhongHoc'
import RoomList from './List/RoomList'
import ButtonAction from '../../../components/ui/ButtonAction'

const PhongHocIndex = () => {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false)

  return (
    <PageShell
      title="Quản lý Phòng Học"
      sub="Danh sách, phân loại cấu hình và không gian giảng dạy của trường trung cấp nghề."
      icon={DoorOpen}
      renderRight={
        <ButtonAction
          label="Thêm phòng học"
          icon={<Plus size={18} />}
          onClick={() => setIsOpenCreateModal(true)}
        />
      }
    >
      {/* --- BODY SECTION --- */}
      <div className="py-2">
        <RoomList />
      </div>

      {/* --- MODAL CONTROL --- */}
      <ModalCreatePhongHoc isOpen={isOpenCreateModal} onClose={() => setIsOpenCreateModal(false)} />
    </PageShell>
  )
}

export default PhongHocIndex
