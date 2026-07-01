import InfoItemVertical from "../../components/InffoItemVertical";
import { useHocSinhContext } from "../../HocSinhProvider";

const TabThongTinNguoiGiamHo = () => {
  const { studentDetail } = useHocSinhContext();

  if (!studentDetail) return null;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Khối Cha */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          Thông Tin Cha
        </h2>
        <div className="space-y-3">
          <InfoItemVertical
            label="Họ và tên"
            value={studentDetail.fatherName}
          />
          <InfoItemVertical
            label="Số điện thoại"
            value={studentDetail.fatherPhone}
          />
          <InfoItemVertical label="Số CCCD" value={studentDetail.fatherCCCD} />
          <div className="grid grid-cols-2 gap-2">
            <InfoItemVertical
              label="Năm sinh"
              value={studentDetail.fatherYearOfBirth}
            />
            <InfoItemVertical
              label="Nghề nghiệp"
              value={studentDetail.fatherJob}
            />
          </div>
        </div>
      </div>

      {/* Khối Mẹ */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="h-2 w-2 rounded-full bg-pink-500"></div>
          Thông Tin Mẹ
        </h2>
        <div className="space-y-3">
          <InfoItemVertical
            label="Họ và tên"
            value={studentDetail.motherName}
          />
          <InfoItemVertical
            label="Số điện thoại"
            value={studentDetail.motherPhone}
          />
          <InfoItemVertical label="Số CCCD" value={studentDetail.motherCCCD} />
          <div className="grid grid-cols-2 gap-2">
            <InfoItemVertical
              label="Năm sinh"
              value={studentDetail.motherYearOfBirth}
            />
            <InfoItemVertical
              label="Nghề nghiệp"
              value={studentDetail.motherJob}
            />
          </div>
        </div>
      </div>

      {/* Khối Người giám hộ */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
          <div className="h-2 w-2 rounded-full bg-teal-500"></div>
          Người Giám Hộ{" "}
          {studentDetail.guardianRelationship
            ? `(${studentDetail.guardianRelationship})`
            : ""}
        </h2>
        <div className="space-y-3">
          <InfoItemVertical
            label="Họ và tên"
            value={studentDetail.guardianName}
          />
          <InfoItemVertical
            label="Số điện thoại"
            value={studentDetail.guardianPhone}
          />
          <InfoItemVertical
            label="Số CCCD"
            value={studentDetail.guardianCCCD}
          />
          <div className="grid grid-cols-2 gap-2">
            <InfoItemVertical
              label="Năm sinh"
              value={studentDetail.guardianYearOfBirth}
            />
            <InfoItemVertical
              label="Nghề nghiệp"
              value={studentDetail.guardianJob}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabThongTinNguoiGiamHo;
