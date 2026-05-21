import { Outlet } from "react-router-dom";
import { LopHocPhanProvider } from "./LopHocPhanProvider";

const LopHocPhanLayout = () => {
  return (
    <LopHocPhanProvider>
      <Outlet />
    </LopHocPhanProvider>
  );
};

export default LopHocPhanLayout;
