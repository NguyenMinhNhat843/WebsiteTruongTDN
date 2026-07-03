import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import { AppProvider } from "./AppProvider";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { Loader2 } from "lucide-react";
import PhongHocIndex from "./pages/admin/PhongHoc";

// --- LAZY LOADING COMPONENTS ---

// Layouts chung
const MainLayout = lazy(() => import("./pages/client/layout/MainLayout"));
const PostLayout = lazy(() => import("./pages/client/PostDetail/PostLayout"));
const AdminMainLayout = lazy(
  () => import("./pages/admin/AdminMainLayout/AdminMainLayout"),
);
const MemberLayout = lazy(
  () => import("./pages/MembersDashboard/MemberSideBar/MemberLayout"),
);
const StudentLayout = lazy(
  () => import("./pages/StudentDashboard/StudentLayout"),
);

// Client Pages
const Home = lazy(() => import("./pages/client/Home/Home"));
const GioiThieuVeTruong = lazy(
  () => import("./pages/client/GioiThieuVeTruong"),
);
const BoMayToChuc = lazy(
  () => import("./pages/client/BoMayToChuc/BoMayToChuc"),
);
const TamNhinSuMang = lazy(() => import("./pages/client/TamNhinSuMang"));
const SoDoToChuc = lazy(() => import("./pages/client/SoDoToChuc"));
const HopTacQuocTe = lazy(() => import("./pages/client/HopTacQuocTe"));
const LienHe = lazy(() => import("./pages/client/LienHe/LienHe"));
const DangKyTuVan = lazy(
  () => import("./pages/client/DangKyTuVan/DangKyTuVan"),
);
const ChuongTrinhDaoTaoDetail = lazy(
  () => import("./pages/client/ChuongTrinhDaoTaoDetail"),
);
const NewsList = lazy(() => import("./pages/client/NewsList"));
const UserPostDetail = lazy(
  () => import("./pages/client/PostDetail/UserPostDetail"),
);

// Admin Pages
const LoginPage = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard/Home"));
const AdminPostPreview = lazy(
  () => import("./pages/admin/QuanLyBaiViet/AdminPostPreview"),
);
const CreatePost = lazy(
  () => import("./pages/admin/QuanLyBaiViet/create/CreatePost"),
);
const UpdatePost = lazy(
  () => import("./pages/admin/QuanLyBaiViet/create/UpdatePost"),
);
const PostList = lazy(
  () => import("./pages/admin/QuanLyBaiViet/list/PostList"),
);
const MediaLibrary = lazy(
  () => import("./pages/admin/QuanLyMedia/QuanLyMedia"),
);
const ChuongTrinhKhung = lazy(
  () => import("./pages/admin/ChuongTrinhKhung/ChuongTrinhKhungIndex"),
);
const TaoChuongTrinhKhung = lazy(
  () =>
    import("./pages/admin/ChuongTrinhKhung/CreateChuongTrinh/TaoChuongTrinhKhung"),
);
const LopHocLayout = lazy(
  () => import("./pages/admin/LopDanhNghia/LopHocLayout"),
);
const LopHocList = lazy(() => import("./pages/admin/LopDanhNghia/LopHocList"));
const LopHocOne = lazy(
  () => import("./pages/admin/LopDanhNghia/LopHocOne/index"),
);
const NhapDiemPage = lazy(
  () =>
    import("./pages/admin/LopDanhNghia/LopHocOne/TableNhapDiem/NhapDiemPage"),
);
const TienDoDaoTao = lazy(() => import("./pages/admin/TienDoGiangDay"));
const ThoiKhoaBieuWrapper = lazy(
  () => import("./pages/admin/ThoiKhoaBieu/ThoiKhoaBieuWrapper"),
);
const PhanLopLayout = lazy(() => import("./pages/admin/PhanLop/PhanLopLayout"));
const PhanLop = lazy(() => import("./pages/admin/PhanLop/PhanLop"));
const KhoaIndex = lazy(() => import("./pages/admin/Khoa/KhoaIndex"));
const KhoaList = lazy(() => import("./pages/admin/Khoa/KhoaList"));
const KhoaDaoTao = lazy(() => import("./features/khoaHoc/KhoaDaoTaoIndex"));
const NganhIndex = lazy(() => import("./features/Nganh/NganhIndex"));
const MonHocIndex = lazy(() => import("./features/MonHoc/MonHocIndex"));
const HocSinhLayout = lazy(
  () => import("./pages/admin/HoSoHocSinh/HocSinhLayout"),
);
const DanhSachHoSoHocSinh = lazy(
  () => import("./pages/admin/HoSoHocSinh/HoSoHocSinhList/HoSoHocSinhList"),
);
const CreateStudent = lazy(
  () => import("./pages/admin/HoSoHocSinh/CreateHoSoHocSinh/Create"),
);
const HoSoHocSinhOne = lazy(
  () => import("./pages/admin/HoSoHocSinh/HoSoHocSinhOne/HoSoHocSinhOne"),
);
const HocKyLayout = lazy(() => import("./pages/admin/HocKy/HocKyLayout"));
const HocKyList = lazy(() => import("./pages/admin/HocKy/HocKyList"));
const AdmissionDetail = lazy(
  () => import("./features/DotTuyenSinh/DotTuyenSinhOne"),
);
const HocPhiLayout = lazy(() => import("./features/HocPhi/HocPhiLayout"));
const QuanLyDotHocPhi = lazy(() => import("./features/HocPhi/QuanLyDotHocPhi"));
const ExemptionManagement = lazy(
  () => import("./pages/admin/MienGiamHocPhi/MienGiamHocPhi"),
);
const NhanVienLayout = lazy(
  () => import("./pages/admin/QuanLyNhanVien/NhanVienLayout"),
);
const PhanCongGiangDay = lazy(
  () => import("./pages/admin/PhanCongGiangDay/PhanCongGiangDay"),
);
const QuanLyTaiKhoan = lazy(() => import("./pages/admin/QuanLyAccount"));
const QuanLyNhanVien = lazy(
  () => import("./pages/admin/QuanLyNhanVien/NhanVienList/QuanLyNhanVienList"),
);
const NhanVienOne = lazy(
  () => import("./pages/admin/QuanLyNhanVien/NhanVienOne/NhanVienOne"),
);
const PhanQuyenNguoiDung = lazy(
  () =>
    import("./pages/admin/CaiDatHeThong/PhanQuyenNguoiDung/PhanQuyenNguoiDung"),
);
const SystemLogPage = lazy(
  () => import("./pages/admin/NhatKyHeThong/NhatKyHeThong"),
);

// Teacher (Member) Pages
const MemberDashboard = lazy(() => import("./pages/MembersDashboard/Home"));
const LopHocGiangDay = lazy(
  () => import("./pages/MembersDashboard/LopGiangDay/LopGiangDay"),
);
const BangDiem = lazy(
  () => import("./pages/MembersDashboard/NhapDiem/BangDiem"),
);
const ThoiKhoaBieu = lazy(
  () => import("./pages/MembersDashboard/ThoiKhoaBieu/ThoiKhoaBieu"),
);

// Student Pages
const StudentDashboard = lazy(
  () => import("./pages/StudentDashboard/Dashboard/Dashboard"),
);
const StudentLopHocPhan = lazy(
  () => import("./pages/StudentDashboard/LopHocPhan/LopHocPhan"),
);

// --- CONFIGURATION ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component hiển thị khi đang tải trang (Loading Fallback)
const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-gray-50">
      {/* Icon xoay mượt mà */}
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />

      {/* Chữ hiển thị phía dưới */}
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        Đang tải trang...
      </p>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Route cho trang chủ và các trang thông tin chung */}
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
                <Route
                  path="tin-tuc/xem-truoc"
                  element={<AdminPostPreview />}
                />
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
                  path="truyen-thong-bao-chi/:id/edit"
                  element={<UpdatePost />}
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
                <Route element={<LopHocLayout />}>
                  <Route path="dao-tao/lop-hoc" element={<LopHocList />} />
                  <Route
                    path="dao-tao/lop-hoc/:idLopHoc"
                    element={<LopHocOne />}
                  />
                  <Route
                    path="dao-tao/lop-hoc/:idLopHoc/:idClassSubject"
                    element={<NhapDiemPage />}
                  />
                </Route>
                <Route
                  path="dao-tao/tien-do-dao-tao"
                  element={<TienDoDaoTao />}
                />
                <Route
                  path="dao-tao/thoi-khoa-bieu"
                  element={<ThoiKhoaBieuWrapper />}
                />
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
              <Route path="phong-hoc" element={<PhongHocIndex />} />

              {/* Công tác học sinh */}
              <Route element={<HocSinhLayout />}>
                <Route
                  path="hoc-sinh/ho-so"
                  element={<DanhSachHoSoHocSinh />}
                />
                <Route
                  path="hoc-sinh/ho-so/create"
                  element={<CreateStudent />}
                />
                <Route
                  path="hoc-sinh/ho-so/:maSinhVien"
                  element={<HoSoHocSinhOne />}
                />
              </Route>

              {/* Học kỳ */}
              <Route element={<HocKyLayout />}>
                <Route path="hoc-ky" element={<HocKyList />} />
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

              {/* Quản trị nhân sự */}
              <Route element={<NhanVienLayout />}>
                <Route
                  path="phan-cong-giang-day"
                  element={<PhanCongGiangDay />}
                />
                <Route path="account" element={<QuanLyTaiKhoan />} />
                <Route path="users" element={<QuanLyNhanVien />} />
                <Route path="users/:staffCode" element={<NhanVienOne />} />
              </Route>

              {/* Cài đặt hệ thống */}
              <Route
                path="cai-dat/phan-quyen"
                element={<PhanQuyenNguoiDung />}
              />
              <Route path="nhat-ky-he-thong" element={<SystemLogPage />} />
            </Route>

            {/* ========================= Giáo viên ============================= */}
            <Route
              path="/teacher/*"
              element={
                <ProtectedRoute>
                  <MemberLayout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<MemberDashboard />} />
              <Route path="lop-hoc" element={<LopHocGiangDay />} />
              <Route path="nhap-diem" element={<BangDiem />} />
              <Route path="thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
            </Route>

            {/* ========================= Sinh viên ============================= */}
            <Route path="/student/*" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="lop-hoc-phan" element={<StudentLopHocPhan />} />
              <Route path="thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
              <Route path="chuong-trinh-khung" element={<ChuongTrinhKhung />} />
            </Route>

            {/* Route 404 */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Suspense>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
