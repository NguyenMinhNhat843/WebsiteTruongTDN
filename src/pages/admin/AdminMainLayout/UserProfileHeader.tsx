import { useNavigate } from "react-router-dom";
import { USER_ROLE, type User } from "../../../features/users/types/User.types"; // Giữ nguyên từ file cũ của bạn
import { Bell, Globe, LogOut, GraduationCap } from "lucide-react";
import { useAppContext } from "../../../AppProvider"; // Giữ nguyên từ file cũ của bạn
import ButtonAction from "../../../components/ui/ButtonAction";

const UserProfileHeader = () => {
  const navigate = useNavigate();
  const { currentSemester } = useAppContext();

  // Chuỗi hiển thị tên học kỳ
  const semesterName =
    currentSemester?.name +
    (currentSemester?.isCurrent ? " (Học kỳ hiện tại)" : "");

  // Lấy dữ liệu và ép kiểu an toàn
  const getUserData = (): User | null => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Lỗi parse user data:", error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-between gap-6 p-3 border-b border-slate-200 bg-white shadow-xs">
      {/* 1. KHỐI BÊN TRÁI: Thông tin User & Các nút thao tác nhanh */}
      <div className="flex items-center gap-4">
        {/* Avatar với hiệu ứng Hover Gradient [cite: 315] */}
        <div className="relative group cursor-pointer">
          {" "}
          {/* [cite: 316] */}
          <div
            className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 
          to-purple-600 rounded-full opacity-20 group-hover:opacity-100 transition duration-300"
          ></div>{" "}
          {/* [cite: 317] */}
          <div
            className="relative w-10 h-10 rounded-full bg-white flex items-center 
          justify-center border border-slate-200"
          >
            {" "}
            {/* [cite: 318] */}
            <div
              className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center 
            text-white text-xs font-black"
            >
              {" "}
              {/* [cite: 319] */}
              {user?.name?.charAt(0).toUpperCase()} {/* [cite: 320] */}
            </div>
          </div>
        </div>

        {/* Họ tên & Vai trò */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-slate-800 leading-tight">
            {user.name} {/* [cite: 326] */}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 ${
              user.role === USER_ROLE.ADMIN
                ? "bg-rose-50 text-rose-500"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {user.role} {/* [cite: 335] */}
          </span>
        </div>

        {/* Thanh chia tách nhẹ giữa User và Nút nhanh */}
        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

        {/* Các nút hành động nhanh sử dụng ButtonAction [cite: 177, 338] */}
        <div className="flex items-center gap-1">
          {" "}
          {/* [cite: 339] */}
          <ButtonAction
            variant="outline"
            size="sm"
            icon={<Globe size={16} />}
            title="Ghé thăm website"
            onClick={() =>
              window.open("https://website-truong-tdn.vercel.app/", "_blank")
            }
            className="rounded-full text-slate-400 hover:text-indigo-600 
            hover:bg-indigo-50 border-transparent hover:border-transparent shadow-none"
          />
          <ButtonAction
            variant="outline"
            size="sm"
            icon={<LogOut size={16} />}
            title="Đăng xuất"
            onClick={handleLogout}
            className="rounded-full text-slate-400 hover:text-rose-600 
            hover:bg-rose-50 border-transparent hover:border-transparent shadow-none"
          />
        </div>
      </div>

      {/* 2. KHỐI BÊN PHẢI: Nút thông báo nằm BÊN TRÁI Học kỳ hiện tại */}
      <div className="flex items-center gap-4">
        {/* Nút thông báo di chuyển sang bên trái học kỳ [cite: 358] */}
        <div className="relative">
          <ButtonAction
            variant="outline"
            size="sm"
            icon={<Bell size={18} />}
            className="rounded-full text-slate-400 hover:text-indigo-600 
            hover:bg-indigo-50 border-transparent hover:border-transparent shadow-none"
          />
          {/* Chấm đỏ thông báo [cite: 360] */}
          <div
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full 
          border border-white pointer-events-none"
          ></div>{" "}
          {/* [cite: 360] */}
        </div>

        {/* Học kỳ hiện tại: Làm to hơn, nổi bật hơn với badge cao cấp */}
        {currentSemester && (
          <div
            className="flex items-center gap-2.5 bg-linear-to-r 
          from-blue-50 to-indigo-50 border border-blue-100 px-4 py-2 rounded-xl 
          text-indigo-900 shadow-xs animate-pulse-slow"
          >
            <GraduationCap
              size={18}
              className="text-blue-600 bg-blue-100 p-0.5 rounded-md"
            />
            <span className="text-sm font-bold tracking-wide">
              {semesterName} {/* [cite: 294] */}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
