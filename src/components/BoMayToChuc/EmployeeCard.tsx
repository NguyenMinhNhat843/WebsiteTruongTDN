import type { Employee } from "../../pages/BoMayToChuc";

interface EmployeeCardProps {
  user: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ user }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-stretch overflow-hidden group">
      {/* 1. Avatar hình chữ nhật bên trái */}
      <div className="w-42 h-52 shrink-0 overflow-hidden">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 2. Thông tin chi tiết bên phải */}
      <div className="grow p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-school-blue-700 transition-colors leading-tight">
            {user.fullName}
          </h3>
          <p className="text-xs text-school-blue-600 font-semibold tracking-wide uppercase mb-3">
            {user.position}
          </p>

          <div className="space-y-2 border-t border-gray-50 pt-3">
            <div className="flex items-center text-gray-600 hover:text-school-blue-600 transition-colors">
              <span className="text-sm mr-2 opacity-70">📞</span>
              <a className="text-sm font-medium">{user.phoneNumber}</a>
            </div>
            <div className="flex items-center text-gray-600 hover:text-school-blue-600 transition-colors">
              <span className="text-sm mr-2 opacity-70">✉️</span>
              <a className="text-sm font-medium">{user.email}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
