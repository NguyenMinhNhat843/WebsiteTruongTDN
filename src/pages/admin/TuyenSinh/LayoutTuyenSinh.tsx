import { Outlet } from "react-router-dom";
import { DotTuyenSinhProvider } from "../../../features/DotTuyenSinh/DotTuyenSinhProvider";
import { HoSoTuyenSinhProvider } from "../../../features/DotTuyenSinh/HoSoTuyenSinhProvider";

const TuyenSinh = () => {
  return (
    <DotTuyenSinhProvider>
      <HoSoTuyenSinhProvider>
        <Outlet />
      </HoSoTuyenSinhProvider>
    </DotTuyenSinhProvider>
  );
};

export default TuyenSinh;
