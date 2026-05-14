import { Outlet } from "react-router-dom";
import { HocPhiProvider } from "./HocPhiProvider";

const HocPhiLayout = () => {
  return (
    <HocPhiProvider>
      <Outlet />
    </HocPhiProvider>
  );
};

export default HocPhiLayout;
