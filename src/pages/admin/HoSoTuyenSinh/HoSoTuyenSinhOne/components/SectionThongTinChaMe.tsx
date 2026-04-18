import { Phone, UserRound, Users } from "lucide-react";
import InfoItem from "../../../../../components/ui/InfoItem";
import { useHoSoTuyenSinhOneContext } from "../HoSoTuyenSinhOneProvider";
import SectionWrapper from "../../../../../components/ui/SectionWrapper";

const SectionThongTinChaMe = () => {
  const { applicant } = useHoSoTuyenSinhOneContext();
  if (!applicant) {
    return null;
  }
  return (
    <SectionWrapper title="Thông tin cha mẹ" Icon={Users}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cha */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
              <UserRound className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Cha</span>
          </div>
          <InfoItem label="Họ và tên" value={"Nguyễn Minh Cha"} />
          <InfoItem label="Năm sinh" value={"12/01/1950"} />
          <InfoItem label="Nghề nghiệp" value={"Nông dân"} />
          <InfoItem
            label="Số điện thoại"
            value={"01234456789"}
            icon={<Phone className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Mẹ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center">
              <UserRound className="w-4 h-4 text-pink-400" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">Mẹ</span>
          </div>
          <InfoItem label="Họ và tên" value={"Nguyễn Minh Mẹ"} />
          <InfoItem label="Năm sinh" value={"15/05/1955"} />
          <InfoItem label="Nghề nghiệp" value={"Giáo viên"} />
          <InfoItem
            label="Số điện thoại"
            value={"09876543210"}
            icon={<Phone className="w-3.5 h-3.5" />}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SectionThongTinChaMe;
