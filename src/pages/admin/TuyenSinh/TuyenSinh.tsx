import { Outlet } from "react-router-dom";
import { TuyenSinhProvider } from "./TuyenSinhProvider";
import { DotTuyenSinhProvider } from "../../../features/DotTuyenSinh/DotTuyenSinhProvider";

const TuyenSinh = () => {
  return (
    <DotTuyenSinhProvider>
      <TuyenSinhProvider>
        <Outlet />
      </TuyenSinhProvider>
    </DotTuyenSinhProvider>
  );
};

export default TuyenSinh;
