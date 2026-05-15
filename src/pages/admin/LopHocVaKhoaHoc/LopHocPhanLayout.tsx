import { LopHocPhanProvider } from "./LopHocPhanProvider";
import { Outlet } from "react-router-dom";

const LopHocPhanLayout = () => {
  return (
    <LopHocPhanProvider>
      <Outlet />
    </LopHocPhanProvider>
  );
};

export default LopHocPhanLayout;
