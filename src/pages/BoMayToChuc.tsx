import EmployeeCard from "../components/BoMayToChuc/EmployeeCard";
import type { Employee, Role } from "../types/api.type";

const employeeData: Employee[] = [
  {
    id: "NV001",
    fullName: "Nguyễn Thế Anh",
    position: "Lãnh đạo nhà trường",
    phoneNumber: "0901234567",
    email: "theanh.ld@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv001",
  },
  {
    id: "NV002",
    fullName: "Trần Thị Mai Phương",
    position: "Phòng Tài chính - Kế toán",
    phoneNumber: "0912345678",
    email: "maiphuong.tc@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv002",
  },
  {
    id: "NV003",
    fullName: "Lê Văn Nam",
    position: "Phòng Đào tạo - Quản sinh",
    phoneNumber: "0987654321",
    email: "vannam.dt@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv003",
  },
  {
    id: "NV004",
    fullName: "Phạm Hoàng Yến",
    position: "Phòng Hành chính - Nhân sự",
    phoneNumber: "0977112233",
    email: "hoangyen.hc@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv004",
  },
  {
    id: "NV005",
    fullName: "Đỗ Minh Đức",
    position: "Phòng Đào tạo - Quản sinh",
    phoneNumber: "0334455667",
    email: "minhduc.dt@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv005",
  },
  {
    id: "NV006",
    fullName: "Vũ Khánh Linh",
    position: "Phòng Tài chính - Kế toán",
    phoneNumber: "0944556677",
    email: "khanhlinh.tc@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv006",
  },
  {
    id: "NV007",
    fullName: "Hoàng Văn Thái",
    position: "Phòng Hành chính - Nhân sự",
    phoneNumber: "0911223344",
    email: "vanthai.hc@truonghoc.edu.vn",
    avatar: "https://i.pravatar.cc/150?u=nv007",
  },
];

const BoMayToChuc = () => {
  // Nhóm dữ liệu theo position
  const groupedData = employeeData.reduce(
    (acc, employee) => {
      const key = employee.position;
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
    <div className="p-8 bg-gray-50 min-h-screen max-w-5xl mx-auto">
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
              <EmployeeCard key={employee.id} user={employee} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoMayToChuc;
