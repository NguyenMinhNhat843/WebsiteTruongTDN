import { Navigate, useLocation } from "react-router-dom";
import type { UserRole } from "../../users/types/User.types";
import { getAccessToken } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isPendingRefreshToken, isAppInitialized } = useAppContext();
  const location = useLocation();

  if (isPendingRefreshToken || !isAppInitialized) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-3 bg-gray-50">
        <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Giả sử lấy thông tin user từ localStorage hoặc AuthContext
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const access_token = getAccessToken();

  if (!user || !access_token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
