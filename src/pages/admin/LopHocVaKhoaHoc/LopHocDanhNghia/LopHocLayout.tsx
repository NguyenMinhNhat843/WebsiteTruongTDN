import { Outlet } from "react-router-dom";
import { LopHocProvider } from "./LopHocProvider";

const LopHocLayout = () => {
  return (
    <LopHocProvider>
      <Outlet />
    </LopHocProvider>
  );
};

export default LopHocLayout;
