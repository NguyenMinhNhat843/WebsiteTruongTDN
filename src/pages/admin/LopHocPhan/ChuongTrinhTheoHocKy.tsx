import ReusableTable from "../../../components/ui/Table";

const MOCK_CURRICULUM_SUBJECTS = [
  { id: "m1", name: "An toàn điện", credits: 2, type: "Lý thuyết" },
  {
    id: "m2",
    name: "Lắp đặt mạng điện nội thất",
    credits: 4,
    type: "Thực hành",
  },
  {
    id: "m3",
    name: "Sửa chữa thiết bị gia dụng",
    credits: 3,
    type: "Thực hành",
  },
  { id: "m4", name: "Khởi nghiệp", credits: 2, type: "Lý thuyết" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const ChuongTrinhTheoHocKy = () => {
  const columns = [
    {
      key: "name",
      label: "Tên học phần",
    },
    {
      key: "credits",
      label: "Số tín chỉ/ĐVHT",
      render: (item: any) => `${item.credits} tín chỉ`,
    },
    {
      key: "type",
      label: "Loại học phần",
      render: (item: any) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs border border-slate-200">
          {item.type}
        </span>
      ),
    },
  ];
  return (
    <div>
      <ReusableTable
        data={MOCK_CURRICULUM_SUBJECTS}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default ChuongTrinhTheoHocKy;
