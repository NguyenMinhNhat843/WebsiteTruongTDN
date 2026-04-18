import { QuanLyHoSoProvider } from "./QuanLyHoSoProvider";
import { Outlet } from "react-router-dom";

const QuanLyHoSoLayout = () => {
  return (
    <QuanLyHoSoProvider>
      <Outlet />
    </QuanLyHoSoProvider>
  );
};

export default QuanLyHoSoLayout;
