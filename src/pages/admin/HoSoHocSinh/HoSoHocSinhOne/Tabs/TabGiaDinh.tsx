import { Phone, User, Users } from "lucide-react";
import SectionCard from "../../../../../components/ui/SectionCard";
import type { HocSinh } from "../../mockType";
import InfoRow from "../../../../../components/ui/InfoRow";

const TabGiaDinh = ({ hs }: { hs: HocSinh }) => (
  <div className="space-y-4">
    {[
      {
        title: "Thông tin cha",
        ten: hs.hoTenCha,
        sdt: hs.sdtCha,
        ngheNghiep: hs.ngheNghiepCha,
      },
      {
        title: "Thông tin mẹ",
        ten: hs.hoTenMe,
        sdt: hs.sdtMe,
        ngheNghiep: hs.ngheNghiepMe,
      },
    ].map((p) => (
      <SectionCard key={p.title} title={p.title}>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
          <InfoRow label="Họ và tên" value={p.ten} icon={<User size={11} />} />
          <InfoRow
            label="Số điện thoại"
            value={p.sdt}
            icon={<Phone size={11} />}
          />
          <InfoRow label="Nghề nghiệp" value={p.ngheNghiep} />
        </dl>
      </SectionCard>
    ))}

    <SectionCard title="Người liên hệ khác">
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        <InfoRow
          label="Họ tên / Quan hệ"
          value={hs.nguoiLienHeKhac}
          icon={<Users size={11} />}
        />
        <InfoRow
          label="Số điện thoại"
          value={hs.sdtLienHe}
          icon={<Phone size={11} />}
        />
      </dl>
    </SectionCard>
  </div>
);

export default TabGiaDinh;
