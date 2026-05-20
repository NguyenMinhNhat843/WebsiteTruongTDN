import { Outlet } from "react-router-dom";
import { TuyenSinhProvider } from "./TuyenSinhProvider";
import { DotTuyenSinhProvider } from "../../../features/DotTuyenSinh/DotTuyenSinhProvider";
import { HoSoTuyenSinhProvider } from "../../../features/DotTuyenSinh/HoSoTuyenSinhProvider";

const TuyenSinh = () => {
  return (
    <DotTuyenSinhProvider>
      <HoSoTuyenSinhProvider>
        <TuyenSinhProvider>
          <Outlet />
        </TuyenSinhProvider>
      </HoSoTuyenSinhProvider>
    </DotTuyenSinhProvider>
  );
};

export default TuyenSinh;
