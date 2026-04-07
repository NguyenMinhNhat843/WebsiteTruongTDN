import { Calendar, CreditCard, Mail, MapPin, Phone, User } from "lucide-react";
import InfoRow from "../../../../../components/ui/InfoRow";
import SectionCard from "../../../../../components/ui/SectionCard";
import type { HocSinh } from "../../mockType";

const TabThongTin = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    <SectionCard title="Thông tin cơ bản">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Họ và tên"
          value={hs.hoTen}
          icon={<User size={11} />}
          span
        />
        <InfoRow
          label="Ngày sinh"
          value={new Date(hs.ngaySinh).toLocaleDateString("vi-VN")}
          icon={<Calendar size={11} />}
        />
        <InfoRow label="Giới tính" value={hs.gioiTinh} />
        <InfoRow label="Dân tộc" value={hs.danToc} />
        <InfoRow label="Tôn giáo" value={hs.tonGiao} />
      </dl>
    </SectionCard>

    <SectionCard title="CCCD / CMND">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Số CCCD"
          value={hs.cccd}
          icon={<CreditCard size={11} />}
        />
        <InfoRow
          label="Ngày cấp"
          value={new Date(hs.ngayCap).toLocaleDateString("vi-VN")}
        />
        <InfoRow label="Nơi cấp" value={hs.noiCap} span />
      </dl>
    </SectionCard>

    <SectionCard title="Liên lạc & Địa chỉ">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Số điện thoại"
          value={hs.soDienThoai}
          icon={<Phone size={11} />}
        />
        <InfoRow label="Email" value={hs.email} icon={<Mail size={11} />} />
        <InfoRow
          label="Địa chỉ thường trú"
          value={hs.diaChiThuongTru}
          icon={<MapPin size={11} />}
          span
        />
        <InfoRow
          label="Địa chỉ tạm trú"
          value={hs.diaChiTamTru}
          icon={<MapPin size={11} />}
          span
        />
      </dl>
    </SectionCard>
  </div>
);

export default TabThongTin;
