import { Outlet } from "react-router-dom";
import { TuyenSinhProvider } from "./TuyenSinhProvider";

const TuyenSinh = () => {
  return (
    <TuyenSinhProvider>
      <Outlet />
    </TuyenSinhProvider>
  );
};

export default TuyenSinh;
