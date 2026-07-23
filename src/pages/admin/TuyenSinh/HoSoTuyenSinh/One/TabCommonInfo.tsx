import { User, Users } from 'lucide-react'
import { useHoSoTuyenSinhOneContext } from './HoSoTuyenSinhOneProvider'

const TabCommonInfo = () => {
  const { profile } = useHoSoTuyenSinhOneContext()
  if (!profile) return null
  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
          <User className="h-4 w-4" /> Thông Tin Thí Sinh
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <span className="text-slate-500">Họ và tên:</span>
            <p className="font-semibold text-slate-800">{profile.fullName}</p>
          </div>
          <div>
            <span className="text-slate-500">CCCD / Định danh:</span>
            <p className="font-semibold text-slate-800">{profile.identityNumber}</p>
          </div>
          <div>
            <span className="text-slate-500">Ngày sinh:</span>
            <p className="font-medium text-slate-800">
              {profile.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Giới tính:</span>
            <p className="font-medium text-slate-800">
              {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Trình độ học vấn:</span>
            <p className="font-medium text-slate-800">{profile.educationLevel}</p>
          </div>
          <div>
            <span className="text-slate-500">Số điện thoại:</span>
            <p className="font-semibold text-slate-800">{profile.phone}</p>
          </div>
          <div>
            <span className="text-slate-500">Email:</span>
            <p className="font-medium text-slate-800">{profile.email || 'Chưa cập nhật'}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500">Địa chỉ chi tiết:</span>
            <p className="font-medium text-slate-800">{profile.addressDetail || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>

      {/* Parents / Guardian Info */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-indigo-600">
          <Users className="h-4 w-4" /> Thông Tin Gia Đình / Người Giám Hộ
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <span className="text-slate-500">Họ tên Cha:</span>
            <p className="font-medium text-slate-800">{profile.fatherName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-500">SĐT Cha:</span>
            <p className="font-medium text-slate-800">{profile.fatherPhone || 'N/A'}</p>
          </div>
          <div className="hidden md:block"></div>
          <div>
            <span className="text-slate-500">Họ tên Mẹ:</span>
            <p className="font-medium text-slate-800">{profile.motherName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-500">SĐT Mẹ:</span>
            <p className="font-medium text-slate-800">{profile.motherPhone || 'N/A'}</p>
          </div>
          <div className="hidden md:block"></div>
          <div>
            <span className="text-slate-500">Người giám hộ:</span>
            <p className="font-medium text-slate-800">{profile.guardianName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-500">SĐT Giám hộ:</span>
            <p className="font-medium text-slate-800">{profile.guardianPhone || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabCommonInfo
