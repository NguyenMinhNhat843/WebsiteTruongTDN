import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";
import type { EnumRoleUser } from "../../../api/enum";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: EnumRoleUser[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser } = useAppContext();
  const location = useLocation();
  const access_token = getAccessToken();

  // 💡 Kiểm tra: Nếu thiếu user thông tin hoặc thiếu hẳn token thì đá về login luôn
  if (!currentUser || !access_token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền truy cập (Role)
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
