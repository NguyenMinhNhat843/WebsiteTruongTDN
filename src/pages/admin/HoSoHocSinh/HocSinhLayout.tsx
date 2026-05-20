import { Outlet } from "react-router-dom";
import { HocSinhProvider } from "./HocSinhProvider";

const HocSinhLayout = () => {
  return (
    <HocSinhProvider>
      <Outlet />
    </HocSinhProvider>
  );
};

export default HocSinhLayout;
