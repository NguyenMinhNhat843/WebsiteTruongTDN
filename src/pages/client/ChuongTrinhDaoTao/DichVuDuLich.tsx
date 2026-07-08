import ChiTietNganhHoc from "./component/ChuongTrinhDaoTaoDetailWrapper";

const data = {
  tenNganh: "Dịch vụ du lịch & Lữ hành",
  tagline: "Nghề dịch chuyển vững tương lai",
  badge: "Thực tiễn 100%",
  description:
    "Chương trình đào tạo chú trọng phát triển toàn diện năng lực hành nghề thực tế...",
  anh: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
  thongSo: [
    { label: "Mã ngành tuyển sinh", value: "5810103", iconName: "Compass" },
    { label: "Thời gian đào tạo", value: "1.5 - 2 Năm", iconName: "Clock" },
    {
      label: "Cơ hội cọ xát",
      value: "Dẫn tour từ năm nhất",
      iconName: "MapPin",
    },
  ],
  diemNoiBat: [
    "Cam kết 100% học sinh được bố trí thực tập có hưởng lương...",
    "Chương trình học thực tế chiếm 70%...",
  ],
  chuongTrinhHoc: [
    {
      tieuDe: "Học phần 1: Tổng quan du lịch & Nghệ thuật giao tiếp",
      iconName: "HeartHandshake",
      moTa: "Xây dựng tác phong chuyên nghiệp...",
      chiTiet: [
        "Tổng quan du lịch và lữ hành: Tìm hiểu lịch sử...",
        "Địa lý du lịch & Tuyến điểm Việt Nam: Master hệ thống...",
      ],
    },
  ],
  coHoiNgheNghiep: [
    {
      chucDanh: "Hướng dẫn viên du lịch",
      noiLamViec: "Dẫn các tour nội địa hoặc đón khách quốc tế...",
    },
  ],
};

const NganhDuLichPage = () => {
  return <ChiTietNganhHoc data={data} />;
};

export default NganhDuLichPage;
