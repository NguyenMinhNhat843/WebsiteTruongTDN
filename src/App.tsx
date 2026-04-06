import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/client/layout/MainLayout";
import NewsList from "./pages/client/NewsList";
import PostLayout from "./pages/client/PostDetail/PostLayout";
import GioiThieuVeTruong from "./pages/client/GioiThieuVeTruong";
import TamNhinSuMang from "./pages/client/TamNhinSuMang";
import SoDoToChuc from "./pages/client/SoDoToChuc";
import HopTacQuocTe from "./pages/client/HopTacQuocTe";
import CreatePost from "./pages/admin/CreatePost";
import BoMayToChuc from "./pages/client/BoMayToChuc/BoMayToChuc";
import LienHe from "./pages/client/LienHe/LienHe";
import DangKyTuVan from "./pages/client/DangKyTuVan/DangKyTuVan";
import ChuongTrinhDaoTaoDetail from "./pages/client/ChuongTrinhDaoTaoDetail";
import Home from "./pages/client/Home/Home";
import AdminMainLayout from "./pages/admin/AdminMainLayout/AdminMainLayout";
import PostList from "./pages/admin/PostList";
import PostDetail from "./pages/client/PostDetail/PostDetail";
import LoginPage from "./pages/admin/Login";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { USER_ROLE } from "./features/users/types/User.types";
import Dashboard from "./pages/admin/Dashboard";
import QuanLyNguoiDung from "./pages/admin/QuanLyNguoiDung";
import ChuongTrinhKhung from "./pages/admin/ChuongTrinhKhung/ChuongTrinhKhung";
import ClassManagement from "./pages/admin/LopHocVaKhoaHoc/LopHocVaKhoaHoc";
import TimetablePage from "./pages/admin/ThoiKhoaBieu/ThoiKhoaBieu";
import GradeManagement from "./pages/admin/QuanLyDiem/QuanLyDiemThi";
import HoSoHocSinh from "./pages/admin/HoSoHocSinh/HoSoHocSinh";
import PhanQuyenNguoiDung from "./pages/admin/CaiDatHeThong/PhanQuyenNguoiDung/PhanQuyenNguoiDung";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gioi-thieu-chung" element={<GioiThieuVeTruong />} />
        <Route path="/bo-may-to-chuc" element={<BoMayToChuc />} />
        <Route
          path="/tam-nhin-su-mang-gia-tri-cot-loi"
          element={<TamNhinSuMang />}
        />
        <Route path="/so-do-to-chuc" element={<SoDoToChuc />} />
        <Route path="/hop-tac-quoc-te" element={<HopTacQuocTe />} />
        <Route path="/lien-he-cong-tac" element={<LienHe />} />
        <Route path="/dang-ky-tuyen-sinh" element={<DangKyTuVan />} />
        <Route path="/chuong-trinh-dao-tao">
          <Route path=":heDaoTaoSlug" element={<ChuongTrinhDaoTaoDetail />} />
          <Route path=":heDaoTaoSlug/:nganhSlug" element={<PostDetail />} />
        </Route>
        <Route path="/tin-tuc" element={<NewsList />} />
        <Route element={<PostLayout />}>
          <Route path="tin-tuc/:slug" element={<PostDetail />} />
          <Route path="tuyen-dung/:slug" element={<PostDetail />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]}>
            <AdminMainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="truyen-thong-bao-chi/tao-bai-viet"
          element={<CreatePost />}
        />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="truyen-thong-bao-chi/bai-viet" element={<PostList />} />
        <Route path="users" element={<QuanLyNguoiDung />} />
        <Route
          path="dao-tao/chuong-trinh-khung"
          element={<ChuongTrinhKhung />}
        />
        <Route path="dao-tao/lop-hoc" element={<ClassManagement />} />
        <Route path="dao-tao/thoi-khoa-bieu" element={<TimetablePage />} />
        <Route path="dao-tao/diem-thi" element={<GradeManagement />} />

        {/* Công tác học sinh */}
        <Route path="hoc-sinh/ho-so" element={<HoSoHocSinh />} />

        {/* Cài đặt hệ thống */}
        <Route path="cai-dat/phan-quyen" element={<PhanQuyenNguoiDung />} />
      </Route>

      {/* Route 404 - Luôn để ở cuối cùng */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
