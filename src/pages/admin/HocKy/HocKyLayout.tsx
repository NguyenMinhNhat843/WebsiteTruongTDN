import { Outlet } from "react-router-dom";
import { HocKyProvider } from "./HocKyProvider";

const HocKyLayout = () => {
  return (
    <HocKyProvider>
      <Outlet />
    </HocKyProvider>
  );
};

export default HocKyLayout;
