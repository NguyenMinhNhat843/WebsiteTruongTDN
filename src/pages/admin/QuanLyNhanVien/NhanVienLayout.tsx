import { Outlet } from "react-router-dom";
import { QuanLyNguoiDungProvider } from "./QuanLyNguoiDungContext";

const NhanVienLayout = () => {
  return (
    <QuanLyNguoiDungProvider>
      <Outlet />
    </QuanLyNguoiDungProvider>
  );
};

export default NhanVienLayout;
