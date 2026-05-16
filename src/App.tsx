import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/client/layout/MainLayout";
import NewsList from "./pages/client/NewsList";
import PostLayout from "./pages/client/PostDetail/PostLayout";
import GioiThieuVeTruong from "./pages/client/GioiThieuVeTruong";
import TamNhinSuMang from "./pages/client/TamNhinSuMang";
import SoDoToChuc from "./pages/client/SoDoToChuc";
import HopTacQuocTe from "./pages/client/HopTacQuocTe";
import CreatePost from "./pages/admin/QuanLyBaiViet/CreatePost";
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
import Dashboard from "./pages/admin/Dashboard/Home";
import QuanLyNhanVien from "./pages/admin/QuanLyNhanVien/NhanVienList/QuanLyNhanVienList";
import ChuongTrinhKhung from "./pages/admin/ChuongTrinhKhung/ChuongTrinhKhung";
import TimetablePage from "./pages/admin/ThoiKhoaBieu/ThoiKhoaBieu";
import GradeManagement from "./pages/admin/QuanLyDiem/QuanLyDiemThi";
import PhanQuyenNguoiDung from "./pages/admin/CaiDatHeThong/PhanQuyenNguoiDung/PhanQuyenNguoiDung";
import DanhSachHoSoHocSinh from "./pages/admin/HoSoHocSinh/HoSoHocSinhList/HoSoHocSinhList";
import DotTuyenSinhList from "./pages/admin/TuyenSinh/TuyenSinhList/TuyenSinhList";
import TuyenSinh from "./pages/admin/TuyenSinh/TuyenSinh";
import XetTotNghiep from "./pages/admin/XetTotNghiep/XetTotNghiep";
import NguonTuyenSinh from "./pages/admin/NguonTuyenSinh/NguonTuyenSinh";
import ExemptionManagement from "./pages/admin/MienGiamHocPhi/MienGiamHocPhi";
import MediaLibrary from "./pages/admin/QuanLyMedia/QuanLyMedia";
import QuanLyXetTotNghiep from "./pages/admin/QuanLyVanBang/QuanLyVanBang";
import PhanCongGiangDay from "./pages/admin/PhanCongGiangDay/PhanCongGiangDay";
import AdminPostPreview from "./pages/admin/QuanLyBaiViet/AdminPostPreview";
import TaoChuongTrinhKhung from "./pages/admin/TaoChuongTrinhKhung/TaoChuongTrinhKhung";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KhoaList from "./pages/admin/Khoa/KhoaList";
import KhoaIndex from "./pages/admin/Khoa/KhoaIndex";
import MemberLayout from "./pages/MembersDashboard/MemberSideBar/MemberLayout";
import MemberDashboard from "./pages/MembersDashboard/Home";
import LopHocGiangDay from "./pages/MembersDashboard/LopGiangDay/LopGiangDay";
import ThoiKhoaBieu from "./pages/MembersDashboard/ThoiKhoaBieu/ThoiKhoaBieu";
import MonHocGiangDay from "./pages/MembersDashboard/DeCuongGiangDay/MonHocGiangDay";
import StudentDashboard from "./pages/StudentDashboard/Dashboard/Dashboard";
import StudentLayout from "./pages/StudentDashboard/StudentLayout";
import StudentLopHocPhan from "./pages/StudentDashboard/LopHocPhan/LopHocPhan";
import SystemLogPage from "./pages/admin/NhatKyHeThong/NhatKyHeThong";
import KhoaDaoTao from "./features/khoaHoc/KhoaDaoTaoIndex";
import NganhIndex from "./features/Nganh/NganhIndex";
import MonHocIndex from "./features/MonHoc/MonHocIndex";
import TieuChuanTuyenSinh from "./features/TieuChuanTuyenSinh/TieuChuanTuyenSinh";
import AdmissionDetail from "./features/DotTuyenSinh/DotTuyenSinhOne";
import HocSinhLayout from "./pages/admin/HoSoHocSinh/HocSinhLayout";
import HocKyLayout from "./pages/admin/HocKy/HocKyLayout";
import HocKyList from "./pages/admin/HocKy/HocKyList";
import HocPhiLayout from "./features/HocPhi/HocPhiLayout";
import QuanLyDotHocPhi from "./features/HocPhi/QuanLyDotHocPhi";
import PhanLop from "./pages/admin/PhanLop/PhanLop";
import PhanLopLayout from "./pages/admin/PhanLop/PhanLopLayout";
import NhanVienLayout from "./pages/admin/QuanLyNhanVien/NhanVienLayout";
import TaoLopHocPhan from "./pages/admin/LopHocPhan/LopHocPhan";
import LopHocPhanLayout from "./pages/admin/LopHocVaKhoaHoc/LopHocPhanLayout";
import LopHocPhanList from "./pages/admin/LopHocVaKhoaHoc/LopHocPhanList";
import LopHocPhanOne from "./pages/admin/LopHocVaKhoaHoc/LopHocPhanOne/LopHocPhanOne";
import GradeComponentLayout from "./pages/admin/GradeComponent/GradeComponentLayout";
import GradeComponentList from "./pages/admin/GradeComponent/GradeComponentList";
import { AppProvider } from "./AppProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động load lại khi chuyển tab (tùy chọn)
      retry: 1, // Thử lại 1 lần nếu lỗi
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
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
              <Route
                path=":heDaoTaoSlug"
                element={<ChuongTrinhDaoTaoDetail />}
              />
              <Route
                path=":heDaoTaoSlug/:nganhSlug"
                element={<UserPostDetail />}
              />
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
              <ProtectedRoute>
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
              <Route
                path="truyen-thong-bao-chi/bai-viet"
                element={<PostList />}
              />

              <Route
                path="truyen-thong-bao-chi/media"
                element={<MediaLibrary />}
              />
            </Route>

            {/* Quản lý đào tạo */}
            <Route>
              <Route
                path="dao-tao/chuong-trinh-khung"
                element={<ChuongTrinhKhung />}
              />
              <Route
                path="dao-tao/tao-chuong-trinh-khung"
                element={<TaoChuongTrinhKhung />}
              />

              <Route
                path="dao-tao/tao-lop-hoc-phan"
                element={<TaoLopHocPhan />}
              />
              <Route element={<LopHocPhanLayout />}>
                <Route
                  path="dao-tao/lop-hoc-phan"
                  element={<LopHocPhanList />}
                />
                <Route
                  path="dao-tao/lop-hoc-phan/:id"
                  element={<LopHocPhanOne />}
                />
              </Route>
              <Route
                path="dao-tao/lop-hoc/:slug"
                element={<LopHocPhanList />}
              />
              <Route
                path="dao-tao/thoi-khoa-bieu"
                element={<TimetablePage />}
              />
              <Route path="dao-tao/diem-thi" element={<GradeManagement />} />
            </Route>

            {/* Quản lý điểm */}
            <Route element={<GradeComponentLayout />}>
              <Route path="diem-thanh-phan" element={<GradeComponentList />} />
            </Route>

            <Route element={<PhanLopLayout />}>
              <Route path="hoc-sinh/phan-lop" element={<PhanLop />} />
            </Route>

            {/* Khoa */}
            <Route element={<KhoaIndex />}>
              <Route path="dao-tao/khoa" element={<KhoaList />} />
            </Route>

            {/* Khóa học */}
            <Route path="khoa-dao-tao" element={<KhoaDaoTao />} />

            {/* Ngành học */}
            <Route path="nganh-hoc" element={<NganhIndex />} />

            {/* Môn học */}
            <Route path="mon-hoc" element={<MonHocIndex />} />

            {/* Tiêu chuẩn tuyển sinh */}
            <Route
              path="tieu-chuan-tuyen-sinh"
              element={<TieuChuanTuyenSinh />}
            />

            {/* Công tác học sinh */}
            <Route element={<HocSinhLayout />}>
              <Route path="hoc-sinh/ho-so" element={<DanhSachHoSoHocSinh />} />
              <Route path="hoc-sinh/tot-nghiep" element={<XetTotNghiep />} />
              <Route
                path="hoc-sinh/dot-xet-tot-nghiep"
                element={<QuanLyXetTotNghiep />}
              />
            </Route>

            {/* Học kỳ */}
            <Route element={<HocKyLayout />}>
              <Route path="hoc-ky" element={<HocKyList />} />
            </Route>

            {/* Tuyển sinh */}
            <Route path="tuyen-sinh" element={<TuyenSinh />}>
              <Route path="dot-tuyen-sinh" element={<DotTuyenSinhList />} />
              <Route path="dot-tuyen-sinh/:id" element={<AdmissionDetail />} />
              <Route path="thong-ke" element={<NguonTuyenSinh />} />
              {/* <Route element={<QuanLyHoSoLayout />}>
              <Route path="ho-so-moi" element={<AdmissionApplication />} />
              <Route
                path="ho-so-tuyen-sinh/:id"
                element={<HoSoTuyenSinhOne />}
              />
            </Route> */}
            </Route>

            {/* Tài chính */}
            <Route element={<HocPhiLayout />}>
              <Route
                path="tai-chinh/thu-hoc-phi"
                element={<QuanLyDotHocPhi />}
              />
              <Route
                path="tai-chinh/mien-giam"
                element={<ExemptionManagement />}
              />
            </Route>

            {/* Xét tốt nghiệp */}
            <Route path="hoc-sinh/tot-nghiep" element={<XetTotNghiep />} />

            {/* Quản trị nhân sự */}
            <Route element={<NhanVienLayout />}>
              <Route
                path="phan-cong-giang-day"
                element={<PhanCongGiangDay />}
              />
              <Route path="users" element={<QuanLyNhanVien />} />
            </Route>

            {/* Cài đặt hệ thống */}
            <Route path="cai-dat/phan-quyen" element={<PhanQuyenNguoiDung />} />
            <Route path="nhat-ky-he-thong" element={<SystemLogPage />} />
          </Route>

          {/* ========================= Giáo viên ============================= */}
          <Route path="/teacher/*" element={<MemberLayout />}>
            <Route path="home" element={<MemberDashboard />} />
            <Route path="lop-hoc" element={<LopHocGiangDay />} />
            <Route path="thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
            <Route path="de-cuong-giang-day" element={<MonHocGiangDay />} />
          </Route>

          {/* ========================= Sinh viên ============================= */}
          <Route path="/student/*" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="lop-hoc-phan" element={<StudentLopHocPhan />} />
            <Route path="thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
            <Route path="chuong-trinh-khung" element={<ChuongTrinhKhung />} />
          </Route>

          {/* Route 404 - Luôn để ở cuối cùng */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
