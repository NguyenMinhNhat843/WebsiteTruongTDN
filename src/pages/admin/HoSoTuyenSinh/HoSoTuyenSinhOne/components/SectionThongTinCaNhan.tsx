import { Mail, Phone, User } from "lucide-react";
import InfoItem from "../../../../../components/ui/InfoItem";
import { useHoSoTuyenSinhOneContext } from "../HoSoTuyenSinhOneProvider";
import SectionWrapper from "../../../../../components/ui/SectionWrapper";

const SectionThongTinCaNhan = () => {
  const { applicant } = useHoSoTuyenSinhOneContext();
  if (!applicant) {
    return null;
  }
  return (
    <SectionWrapper title="Thông tin cá nhân" Icon={User}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <InfoItem
          label="Ngày sinh"
          value={new Date(applicant?.birthDate).toLocaleDateString("vi-VN")}
        />
        <InfoItem label="Giới tính" value={applicant?.gender} />
        <InfoItem label="Số CMND/CCCD" value={applicant.idCard} />
        <InfoItem label="Địa chỉ" value={applicant.address} span2 />
        <InfoItem
          label="Số điện thoại"
          value={applicant.phone}
          icon={<Phone className="w-3.5 h-3.5" />}
        />
        <InfoItem
          label="Email"
          value={applicant.email}
          icon={<Mail className="w-3.5 h-3.5" />}
        />
      </div>
    </SectionWrapper>
  );
};

export default SectionThongTinCaNhan;
