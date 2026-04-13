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
import PostList from "./pages/admin/QuanLyBaiViet/PostList";
import UserPostDetail from "./pages/client/PostDetail/UserPostDetail";
import LoginPage from "./pages/admin/Login";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { USER_ROLE } from "./features/users/types/User.types";
import Dashboard from "./pages/admin/Home";
import QuanLyNguoiDung from "./pages/admin/QuanLyNguoiDung";
import ChuongTrinhKhung from "./pages/admin/ChuongTrinhKhung/ChuongTrinhKhung";
import ClassManagement from "./pages/admin/LopHocVaKhoaHoc/LopHocVaKhoaHoc";
import TimetablePage from "./pages/admin/ThoiKhoaBieu/ThoiKhoaBieu";
import GradeManagement from "./pages/admin/QuanLyDiem/QuanLyDiemThi";
import PhanQuyenNguoiDung from "./pages/admin/CaiDatHeThong/PhanQuyenNguoiDung/PhanQuyenNguoiDung";
import HoSoHocSinhOne from "./pages/admin/HoSoHocSinh/HoSoHocSinhOne/HoSoHocSinhOne";
import DanhSachHoSoHocSinh from "./pages/admin/HoSoHocSinh/HoSoHocSinhList/HoSoHocSinhList";
import DotTuyenSinhList from "./pages/admin/TuyenSinh/TuyenSinhList/TuyenSinhList";
import TuyenSinh from "./pages/admin/TuyenSinh/TuyenSinh";
import DotTuyenSinhOne from "./pages/admin/TuyenSinh/TuyenSinhOne/TuyenSinhOne";
import XetTotNghiep from "./pages/admin/XetTotNghiep/XetTotNghiep";
import NguonTuyenSinh from "./pages/admin/NguonTuyenSinh/NguonTuyenSinh";
import TuitionFee from "./pages/admin/ThuHocPhi/ThuHocPhi";
import ExemptionManagement from "./pages/admin/MienGiamHocPhi/MienGiamHocPhi";
import AdmissionApplication from "./pages/admin/TuyenSinh/QuanLyHoSo/QuanLyHoSo";
import MediaLibrary from "./pages/admin/QuanLyMedia/QuanLyMedia";
import QuanLyVanBang from "./pages/admin/QuanLyVanBang/QuanLyVanBang";
import PhanCongGiangDay from "./pages/admin/PhanCongGiangDay/PhanCongGiangDay";
import HoSoTuyenSinhOne from "./pages/admin/TuyenSinh/QuanLyHoSo/HoSoTuyenSinhOne/HoSoTuyenSinhOne";
import QuanLyHoSoLayout from "./pages/admin/TuyenSinh/QuanLyHoSo/QuanLyHoSoLayout";
import AdminPostPreview from "./pages/admin/QuanLyBaiViet/AdminPostPreview";

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
          <Route path=":heDaoTaoSlug/:nganhSlug" element={<UserPostDetail />} />
        </Route>
        <Route path="/tin-tuc" element={<NewsList />} />
        <Route element={<PostLayout />}>
          <Route path="tin-tuc/xem-truoc" element={<AdminPostPreview />} />
          <Route path="tuyen-dung/:slug" element={<UserPostDetail />} />
          <Route path="tin-tuc/:slug" element={<UserPostDetail />} />
        </Route>
      </Route>

      {/* ============================= Admin ==================================== */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]}>
            <AdminMainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<Dashboard />} />

        {/* Truyền thông */}
        <Route>
          <Route
            path="truyen-thong-bao-chi/tao-bai-viet"
            element={<CreatePost />}
          />
          <Route path="truyen-thong-bao-chi/bai-viet" element={<PostList />} />

          <Route path="truyen-thong-bao-chi/media" element={<MediaLibrary />} />
        </Route>

        {/* Quản lý đào tạo */}
        <Route>
          <Route
            path="dao-tao/chuong-trinh-khung"
            element={<ChuongTrinhKhung />}
          />
          <Route path="dao-tao/lop-hoc" element={<ClassManagement />} />
          <Route path="dao-tao/thoi-khoa-bieu" element={<TimetablePage />} />
          <Route path="dao-tao/diem-thi" element={<GradeManagement />} />
        </Route>

        {/* Công tác học sinh */}
        <Route>
          <Route path="hoc-sinh/ho-so" element={<DanhSachHoSoHocSinh />} />
          <Route path="hoc-sinh/ho-so/:id" element={<HoSoHocSinhOne />} />
          <Route path="hoc-sinh/tot-nghiep" element={<XetTotNghiep />} />
          <Route path="hoc-sinh/van-bang" element={<QuanLyVanBang />} />
        </Route>

        {/* Tuyển sinh */}
        <Route path="tuyen-sinh" element={<TuyenSinh />}>
          <Route path="dot-tuyen-sinh" element={<DotTuyenSinhList />} />
          <Route path="dot-tuyen-sinh/:id" element={<DotTuyenSinhOne />} />
          <Route path="thong-ke" element={<NguonTuyenSinh />} />
          <Route element={<QuanLyHoSoLayout />}>
            <Route path="ho-so-moi" element={<AdmissionApplication />} />
            <Route path="ho-so-tuyen-sinh/:id" element={<HoSoTuyenSinhOne />} />
          </Route>
        </Route>

        {/* Tài chính */}
        <Route>
          <Route path="tai-chinh/thu-hoc-phi" element={<TuitionFee />} />
          <Route path="tai-chinh/mien-giam" element={<ExemptionManagement />} />
        </Route>

        {/* Xét tốt nghiệp */}
        <Route path="hoc-sinh/tot-nghiep" element={<XetTotNghiep />} />

        {/* Quản trị nhân sự */}
        <Route>
          <Route path="phan-cong-giang-day" element={<PhanCongGiangDay />} />
          <Route path="users" element={<QuanLyNguoiDung />} />
        </Route>

        {/* Cài đặt hệ thống */}
        <Route path="cai-dat/phan-quyen" element={<PhanQuyenNguoiDung />} />
      </Route>

      {/* Route 404 - Luôn để ở cuối cùng */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
