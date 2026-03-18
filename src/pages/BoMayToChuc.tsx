import EmployeeCard from "../components/BoMayToChuc/EmployeeCard";

type Role =
  | "Lãnh đạo nhà trường"
  | "Phòng Tài chính - Kế toán"
  | "Phòng Đào tạo - Quản sinh"
  | "Phòng Hành chính - Nhân sự";

export interface Employee {
  fullName: string;
  gender: boolean;
  category: Role;
  position: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
}

const employeeData: Employee[] = [
  {
    fullName: "Hồ Minh Châu",
    gender: true,
    category: "Lãnh đạo nhà trường",
    position: "Chủ tịch HĐQT",
    phoneNumber: "0905.959595",
    email: "asia96hmc@gmail.com",
    avatar: "/BoMayToChuc/ho_minh_chau.jpg",
  },
  {
    fullName: "Hoàng Ngọc Dũng",
    gender: true,
    category: "Lãnh đạo nhà trường",
    position: "Hiệu trưởng",
    phoneNumber: "0935.568.668",
    email: "hoangngocdung.vn@gmail.com",
    avatar: "/BoMayToChuc/hoang_ngoc_dung.jpg",
  },
  {
    fullName: "Nguyễn Văn Nhân",
    gender: true,
    category: "Lãnh đạo nhà trường",
    position: "Phó hiệu trưởng",
    phoneNumber: "0903.375.433",
    email: "hieupho@asiaschool.edu.vn",
    avatar: "/BoMayToChuc/nguyen_van_nhan.jpg",
  },
  {
    fullName: "Hồ Thị Hậu",
    gender: false,
    category: "Phòng Tài chính - Kế toán",
    position: "Kế toán trưởng",
    phoneNumber: "0976.352.567",
    email: "hohau352567@gmail.com",
    avatar: "/BoMayToChuc/ho_thi_hau.jpg",
  },
  {
    fullName: "Nguyễn Thị Phương Loan",
    gender: false,
    category: "Phòng Đào tạo - Quản sinh",
    position: "Phụ trách phòng",
    phoneNumber: "0962.646.951",
    email: "phuongloannt95@gmail.com",
    avatar: "/BoMayToChuc/nguyen_thi_phuong_loan.jpg",
  },
  {
    fullName: "Hồ Đăng Bảo Ngọc",
    gender: false,
    category: "Phòng Hành chính - Nhân sự",
    position: "Phụ trách phòng",
    phoneNumber: "0989.241.097",
    email: "phodangbaongoc.241097@gmail.com",
    avatar: "/BoMayToChuc/ho_dang_bao_ngoc.jpg",
  },
];

const BoMayToChuc = () => {
  // Nhóm dữ liệu theo category
  const groupedData = employeeData.reduce(
    (acc, employee) => {
      const key = employee.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(employee);
      return acc;
    },
    {} as Record<Role, Employee[]>,
  );

  // Danh sách các phòng ban để render theo thứ tự mong muốn
  const roles: Role[] = [
    "Lãnh đạo nhà trường",
    "Phòng Tài chính - Kế toán",
    "Phòng Đào tạo - Quản sinh",
    "Phòng Hành chính - Nhân sự",
  ];

  return (
    <div className="bg-gray-50">
      <div className="p-8 min-h-screen max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-school-blue-800 uppercase tracking-wider">
          Bộ Máy Tổ Chức
        </h1>

        {roles.map((role) => (
          <div key={role} className="mb-12">
            {/* Tiêu đề phòng ban */}
            <div className="flex items-center mb-6 pb-2 border-b-2 border-school-blue-100">
              <h2 className="text-xl font-semibold uppercase tracking-wide text-school-blue-800">
                {role}
              </h2>
              <span className="ml-4 bg-blue-100 text-school-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                {groupedData[role]?.length || 0} NHÂN SỰ
              </span>
            </div>

            {/* Grid hiển thị card nhân sự (Dạng ngang) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {groupedData[role]?.map((employee) => (
                <EmployeeCard key={employee.phoneNumber} user={employee} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoMayToChuc;
