import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'sonner'
import './App.css'

import { AppProvider } from './AppProvider'
import ProtectedRoute from './features/auth/components/ProtectedRoute'

// --- LAZY LOADING: LAYOUTS ---
const MainLayout = lazy(() => import('./pages/client/layout/MainLayout'))
const PostLayout = lazy(() => import('./pages/client/PostDetail/PostLayout'))
const AdminMainLayout = lazy(() => import('./pages/admin/AdminMainLayout/AdminMainLayout'))
const MemberLayout = lazy(() => import('./pages/MembersDashboard/MemberSideBar/MemberLayout'))
const StudentMainLayout = lazy(() => import('./pages/student/Layout/StudentMainLayout'))

// Layout sub-modules Admin
const LopHocLayout = lazy(() => import('./pages/admin/LopDanhNghia/LopHocLayout'))
const PhanLopLayout = lazy(() => import('./pages/admin/PhanLop/PhanLopLayout'))
const KhoaIndex = lazy(() => import('./pages/admin/Khoa/KhoaIndex'))
const HocSinhLayout = lazy(() => import('./pages/admin/HoSoHocSinh/HocSinhLayout'))
const HocKyLayout = lazy(() => import('./pages/admin/HocKy/HocKyLayout'))
const NhanVienLayout = lazy(() => import('./pages/admin/QuanLyNhanVien/NhanVienLayout'))

// --- LAZY LOADING: CLIENT PAGES ---
const Home = lazy(() => import('./pages/client/Home/Home'))
const GioiThieuVeTruong = lazy(() => import('./pages/client/GioiThieuVeTruong'))
const BoMayToChuc = lazy(() => import('./pages/client/BoMayToChuc/BoMayToChuc'))
const TamNhinSuMang = lazy(() => import('./pages/client/TamNhinSuMang'))
const SoDoToChuc = lazy(() => import('./pages/client/SoDoToChuc'))
const LienHe = lazy(() => import('./pages/client/LienHe/LienHe'))
const DangKyTuVan = lazy(() => import('./pages/client/DangKyTuVan/DangKyTuVan'))
const NewsList = lazy(() => import('./pages/client/NewsList'))
const UserPostDetail = lazy(() => import('./pages/client/PostDetail/UserPostDetail'))
const CoSoVatChat = lazy(() => import('./pages/client/CoSoVatChat'))
const DoiTacTuyenDung = lazy(() => import('./pages/client/DoiTacDaoTaoVaTuyenDung'))
const TinHocUngDung = lazy(() => import('./pages/client/ChuongTrinhDaoTao/TinHocUngDung'))
const DichVuDuLichChiTiet = lazy(() => import('./pages/client/ChuongTrinhDaoTao/DichVuDuLich'))
const TiengAnhChiTiet = lazy(() => import('./pages/client/ChuongTrinhDaoTao/TiengAnhChiTiet'))

// --- LAZY LOADING: ADMIN PAGES ---
const LoginPage = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard/Home'))
const AdminPostPreview = lazy(() => import('./pages/admin/QuanLyBaiViet/AdminPostPreview'))
const CreatePost = lazy(() => import('./pages/admin/QuanLyBaiViet/create/CreatePost'))
const UpdatePost = lazy(() => import('./pages/admin/QuanLyBaiViet/create/UpdatePost'))
const PostList = lazy(() => import('./pages/admin/QuanLyBaiViet/list/PostList'))
const ChuongTrinhKhung = lazy(() => import('./pages/admin/ChuongTrinhKhung/ChuongTrinhKhungIndex'))
const TaoChuongTrinhKhung = lazy(() => import('./pages/admin/ChuongTrinhKhung/Create/TaoChuongTrinhKhung'))
const LopHocList = lazy(() => import('./pages/admin/LopDanhNghia/LopHocList'))
const LopHocOne = lazy(() => import('./pages/admin/LopDanhNghia/LopHocOne/index'))
const NhapDiemPage = lazy(() => import('./pages/admin/LopDanhNghia/LopHocOne/TableNhapDiem/NhapDiemPage'))
const TienDoDaoTao = lazy(() => import('./pages/admin/TienDoGiangDay'))
const ThoiKhoaBieuWrapper = lazy(() => import('./pages/admin/ThoiKhoaBieu/ThoiKhoaBieuWrapper'))
const PhanLop = lazy(() => import('./pages/admin/PhanLop/PhanLop'))
const KhoaList = lazy(() => import('./pages/admin/Khoa/KhoaList'))
const KhoaDaoTao = lazy(() => import('./pages/admin/khoaHoc/KhoaDaoTaoIndex'))
const NganhIndex = lazy(() => import('./pages/admin/Nganh/NganhIndex'))
const MonHocIndex = lazy(() => import('./pages/admin/MonHoc/MonHocIndex'))
const PhongHocIndex = lazy(() => import('./pages/admin/PhongHoc'))
const DanhSachHoSoHocSinh = lazy(() => import('./pages/admin/HoSoHocSinh/HoSoHocSinhList/HoSoHocSinhList'))
const CreateStudent = lazy(() => import('./pages/admin/HoSoHocSinh/Create/Create'))
const HocKyList = lazy(() => import('./pages/admin/HocKy/HocKyList'))
const NamHocHome = lazy(() => import('./pages/admin/NamHoc'))
const QuanLyTaiKhoan = lazy(() => import('./pages/admin/QuanLyAccount'))
const QuanLyNhanVien = lazy(() => import('./pages/admin/QuanLyNhanVien/NhanVienList/QuanLyNhanVienList'))
const NhanVienOne = lazy(() => import('./pages/admin/QuanLyNhanVien/NhanVienOne/NhanVienOne'))
const QuanLyDiem = lazy(() => import('./pages/admin/QuanLyDiem'))
const DiemRenLuyenIndex = lazy(() => import('./pages/admin/DiemRenLuyen'))
const DiemRenLuyen_TieuChiDanhGiaIndex = lazy(() => import('./pages/admin/DiemRenLuyen_TieuChiDanhGia'))
const DotHocPhiIndex = lazy(() => import('./pages/admin/HocPhi'))
const DotHocPhiOne = lazy(() => import('./pages/admin/HocPhi/One/DotHocPhiOne'))
const TuitionDashboard = lazy(() => import('./pages/admin/HocPhi/TongQuan'))
const DiaChiTree = lazy(() => import('./pages/admin/DiaChi'))
const DotTuyenSinhHome = lazy(() => import('./pages/admin/TuyenSinh/DotTuyenSinh'))
const AdmissionCampaignDetail = lazy(
  () => import('./pages/admin/TuyenSinh/DotTuyenSinh/One/DotTuyenSinhDetail'),
)
const ToHopMonHome = lazy(() => import('./pages/admin/TuyenSinh/ToHopMon'))
const HoSoTuyenSinhHome = lazy(() => import('./pages/admin/TuyenSinh/HoSoTuyenSinh'))
const TaoHoSoTuyenSinh = lazy(
  () => import('./pages/admin/TuyenSinh/HoSoTuyenSinh/Create/CreateHoSoTuyenSinh'),
)
const CauHinhTuyenSinhHome = lazy(() => import('./pages/admin/TuyenSinh/CauHinhTuyenSinh'))
const LichThiIndex = lazy(() => import('./pages/admin/QuanLyThi/LichThi'))
const CauHinhChung = lazy(() => import('./pages/admin/CauHinhHeThong'))
const HuongDanSuDung = lazy(() => import('./pages/HuongDanSuDung'))
import { DiemDanhSheet } from './pages/admin/DiemDanh'

// --- LAZY LOADING: TEACHER PAGES ---
const MemberDashboard = lazy(() => import('./pages/MembersDashboard/Home'))
const LopHocGiangDay = lazy(() => import('./pages/MembersDashboard/LopGiangDay/LopGiangDay'))
const LopHocOneTeacher = lazy(() => import('./pages/MembersDashboard/LopGiangDay/LopHocOneTeacher'))
const ThoiKhoaBieu = lazy(() => import('./pages/MembersDashboard/ThoiKhoaBieu/ThoiKhoaBieu'))

// --- LAZY LOADING: STUDENT PAGES ---
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const StudentChuongTrinhKhung = lazy(() => import('./pages/student/ChuongTrinhKhung'))
const WeeklySchedule = lazy(() => import('./pages/student/ThoiKhoaBieu'))
const StudentbangDiem = lazy(() => import('./pages/student/BangDiem'))
const StudentTuition = lazy(() => import('./pages/student/HocPhi'))
const PhieuDiemRenLuyenIndex = lazy(() => import('./pages/student/PhieuDiemRenLuyen'))

// --- QUERY CLIENT SETUP ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// --- LOADING FALLBACK ---
const LoadingSpinner = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-gray-50">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
    <p className="animate-pulse text-sm font-medium text-gray-500 dark:text-gray-400">Đang tải trang...</p>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* ========================================================= */}
            {/* 1. PUBLIC / CLIENT ROUTES                                 */}
            {/* ========================================================= */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/gioi-thieu-chung" element={<GioiThieuVeTruong />} />
              <Route path="/bo-may-to-chuc" element={<BoMayToChuc />} />
              <Route path="/tam-nhin-su-mang-gia-tri-cot-loi" element={<TamNhinSuMang />} />
              <Route path="/so-do-to-chuc" element={<SoDoToChuc />} />
              <Route path="/lien-he-cong-tac" element={<LienHe />} />
              <Route path="/dang-ky-tuyen-sinh" element={<DangKyTuVan />} />
              <Route path="/co-so-vat-chat" element={<CoSoVatChat />} />
              <Route path="/doi-tac-dao-tao-va-tuyen-dung" element={<DoiTacTuyenDung />} />
              <Route path="/chuong-trinh-dao-tao/tin-hoc-ung-dung" element={<TinHocUngDung />} />
              <Route path="/chuong-trinh-dao-tao/huong-dan-du-lich" element={<DichVuDuLichChiTiet />} />
              <Route path="/chuong-trinh-dao-tao/tieng-anh" element={<TiengAnhChiTiet />} />
              <Route path="/tuyen-dung" element={<NewsList />} />
              <Route path="/tin-tuc" element={<NewsList />} />

              {/* Xem chi tiết bài viết */}
              <Route element={<PostLayout />}>
                <Route path="tin-tuc/xem-truoc" element={<AdminPostPreview />} />
                <Route path="tin-tuc/:slug" element={<UserPostDetail />} />
              </Route>
            </Route>

            {/* ========================================================= */}
            {/* 2. ADMIN ROUTES                                           */}
            {/* ========================================================= */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminMainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/home" replace />} />
              <Route path="home" element={<Dashboard />} />

              {/* Truyền thông & Bài viết */}
              <Route path="truyen-thong-bao-chi/tao-bai-viet" element={<CreatePost />} />
              <Route path="truyen-thong-bao-chi/:id/edit" element={<UpdatePost />} />
              <Route path="truyen-thong-bao-chi/bai-viet" element={<PostList />} />

              {/* Quản lý Đào tạo & Lớp học */}
              <Route path="dao-tao/chuong-trinh-khung" element={<ChuongTrinhKhung />} />
              <Route path="dao-tao/tao-chuong-trinh-khung" element={<TaoChuongTrinhKhung />} />
              <Route path="dao-tao/tien-do-dao-tao" element={<TienDoDaoTao />} />
              <Route path="dao-tao/thoi-khoa-bieu" element={<ThoiKhoaBieuWrapper />} />
              <Route element={<LopHocLayout />}>
                <Route path="dao-tao/lop-hoc" element={<LopHocList />} />
                <Route path="dao-tao/lop-hoc/:idLopHoc" element={<LopHocOne />} />
                <Route path="dao-tao/lop-hoc/:idLopHoc/:idClassSubject" element={<NhapDiemPage />} />
              </Route>

              {/* Quản lý Điểm & Điểm danh */}
              <Route path="quan-ly-diem" element={<QuanLyDiem />} />
              <Route path="quan-ly-diem/nhap-diem/:idClassSubject" element={<NhapDiemPage />} />
              <Route path="quan-ly-diem/diem-danh/:classSubjectId" element={<DiemDanhSheet />} />

              {/* Danh mục Tổ chức & Đào tạo */}
              <Route path="khoa-dao-tao" element={<KhoaDaoTao />} />
              <Route path="nganh-hoc" element={<NganhIndex />} />
              <Route path="mon-hoc" element={<MonHocIndex />} />
              <Route path="phong-hoc" element={<PhongHocIndex />} />
              <Route path="nam-hoc" element={<NamHocHome />} />
              <Route element={<KhoaIndex />}>
                <Route path="dao-tao/khoa" element={<KhoaList />} />
              </Route>
              <Route element={<HocKyLayout />}>
                <Route path="hoc-ky" element={<HocKyList />} />
              </Route>

              {/* Công tác Học sinh & Phân lớp */}
              <Route element={<HocSinhLayout />}>
                <Route path="hoc-sinh/ho-so" element={<DanhSachHoSoHocSinh />} />
                <Route path="hoc-sinh/ho-so/create" element={<CreateStudent />} />
              </Route>
              <Route element={<PhanLopLayout />}>
                <Route path="hoc-sinh/phan-lop" element={<PhanLop />} />
              </Route>

              {/* Điểm rèn luyện */}
              <Route path="diem-ren-luyen" element={<DiemRenLuyenIndex />} />
              <Route path="diem-ren-luyen/tieu-chi-danh-gia" element={<DiemRenLuyen_TieuChiDanhGiaIndex />} />

              {/* Tuyển sinh */}
              <Route path="tuyen-sinh/dot-tuyen-sinh" element={<DotTuyenSinhHome />} />
              <Route path="tuyen-sinh/dot-tuyen-sinh/:id" element={<AdmissionCampaignDetail />} />
              <Route path="tuyen-sinh/to-hop-mon" element={<ToHopMonHome />} />
              <Route path="tuyen-sinh/ho-so-tuyen-sinh" element={<HoSoTuyenSinhHome />} />
              <Route path="tuyen-sinh/ho-so-tuyen-sinh/tao-moi" element={<TaoHoSoTuyenSinh />} />
              <Route path="tuyen-sinh/cau-hinh-tuyen-sinh" element={<CauHinhTuyenSinhHome />} />

              {/* Quản lý Thi */}
              <Route path="thi/lich-thi" element={<LichThiIndex />} />

              {/* Học phí */}
              <Route path="hoc-phi" element={<DotHocPhiIndex />} />
              <Route path="hoc-phi/tong-quan" element={<TuitionDashboard />} />
              <Route path="hoc-phi/:id" element={<DotHocPhiOne />} />

              {/* Nhân sự & Tài khoản */}
              <Route element={<NhanVienLayout />}>
                <Route path="account" element={<QuanLyTaiKhoan />} />
                <Route path="users" element={<QuanLyNhanVien />} />
                <Route path="users/:staffCode" element={<NhanVienOne />} />
              </Route>

              {/* Cấu hình & Hệ thống */}
              <Route path="dia-chi" element={<DiaChiTree />} />
              <Route path="cai-dat/cau-hinh-chung" element={<CauHinhChung />} />
              <Route path="cai-dat/huong-dan-su-dung" element={<HuongDanSuDung />} />
            </Route>

            {/* ========================================================= */}
            {/* 3. TEACHER (MEMBER) ROUTES                                */}
            {/* ========================================================= */}
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
              <Route path="lop-hoc/:idLopHoc" element={<LopHocOneTeacher />} />
              <Route path="nhap-diem/:idClassSubject" element={<NhapDiemPage />} />
              <Route path="diem-danh/:classSubjectId" element={<DiemDanhSheet />} />
              <Route path="thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
            </Route>

            {/* ========================================================= */}
            {/* 4. STUDENT ROUTES                                         */}
            {/* ========================================================= */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute>
                  <StudentMainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<StudentDashboard />} />
              <Route path="dao-tao/thoi-khoa-bieu" element={<WeeklySchedule />} />
              <Route path="dao-tao/khung-chuong-trinh" element={<StudentChuongTrinhKhung />} />
              <Route path="diem-so" element={<StudentbangDiem />} />
              <Route path="diem-ren-luyen" element={<PhieuDiemRenLuyenIndex />} />
              <Route path="hoc-phi" element={<StudentTuition />} />
            </Route>

            {/* ========================================================= */}
            {/* 5. FALLBACK / 404                                         */}
            {/* ========================================================= */}
            <Route
              path="*"
              element={<div className="p-8 text-center text-slate-600">404 - Trang không tồn tại</div>}
            />
          </Routes>
        </Suspense>
      </AppProvider>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  )
}

export default App
