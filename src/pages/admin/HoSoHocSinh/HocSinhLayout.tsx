import { HocSinhProvider } from "../../../features/HocSinh/HocSInhProvider";
import { Outlet } from "react-router-dom";

const HocSinhLayout = () => {
  return (
    <HocSinhProvider>
      <Outlet />
    </HocSinhProvider>
  );
};

export default HocSinhLayout;
