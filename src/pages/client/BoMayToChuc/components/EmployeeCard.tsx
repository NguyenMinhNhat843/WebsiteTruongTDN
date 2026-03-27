import type { Employee } from "../BoMayToChuc";

interface EmployeeCardProps {
  user: Employee;
}

const EmployeeCard = ({ user }: EmployeeCardProps) => {
  return (
    <div className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row items-stretch overflow-hidden group">
      {/* 1. Avatar: Full width trên mobile, cố định trên desktop */}
      <div className="w-full sm:w-44 h-96 sm:h-52 shrink-0 overflow-hidden bg-gray-50">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-full h-full object-cover sm:object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2. Thông tin chi tiết */}
      <div className="grow p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-school-blue-700 transition-colors leading-tight">
            {user.fullName}
          </h3>
          <p className="text-[10px] sm:text-xs text-school-blue-600 font-semibold tracking-wide uppercase mb-3">
            {user.position}
          </p>

          <div className="space-y-2 border-t border-gray-50 pt-3">
            <div className="flex items-center text-gray-600 hover:text-school-blue-600 transition-colors">
              <span className="text-sm mr-2 opacity-70">📞</span>
              <a
                href={`tel:${user.phoneNumber}`}
                className="text-sm font-medium break-all"
              >
                {user.phoneNumber}
              </a>
            </div>
            <div className="flex items-center text-gray-600 hover:text-school-blue-600 transition-colors">
              <span className="text-sm mr-2 opacity-70">✉️</span>
              <a
                href={`mailto:${user.email}`}
                className="text-sm font-medium break-all"
              >
                {user.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
