import { Outlet } from "react-router-dom";
import { LopHocProvider } from "./LopHocProvider";
import { LopHocOneProvider } from "./LopHocOne/LopHocOneProvider";

const LopHocLayout = () => {
  return (
    <LopHocProvider>
      <LopHocOneProvider>
        <Outlet />
      </LopHocOneProvider>
    </LopHocProvider>
  );
};

export default LopHocLayout;
