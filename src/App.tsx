import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'

import { AppProvider } from './AppProvider'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import { Loader2 } from 'lucide-react'
import PhongHocIndex from './pages/admin/PhongHoc'
import DiemRenLuyenIndex from './pages/admin/DiemRenLuyen'
import DiemRenLuyen_TieuChiDanhGiaIndex from './pages/admin/DiemRenLuyen_TieuChiDanhGia'
import { Toaster } from 'sonner'
import CauHinhChung from './pages/admin/CauHinhHeThong'
import TinHocUngDung from './pages/client/ChuongTrinhDaoTao/TinHocUngDung'
import DichVuDuLichChiTiet from './pages/client/ChuongTrinhDaoTao/DichVuDuLich'
import TiengAnhChiTiet from './pages/client/ChuongTrinhDaoTao/TiengAnhChiTiet'
import DotHocPhiIndex from './pages/admin/HocPhi'
import CoSoVatChat from './pages/client/CoSoVatChat'
import DoiTacTuyenDung from './pages/client/DoiTacDaoTaoVaTuyenDung'
import DotHocPhiOne from './pages/admin/HocPhi/One/DotHocPhiOne'
import DiaChiTree from './pages/admin/DiaChi'
import TuitionDashboard from './pages/admin/HocPhi/TongQuan'
import StudentMainLayout from './pages/student/Layout/StudentMainLayout'
import StudentChuongTrinhKhung from './pages/student/ChuongTrinhKhung'
import WeeklySchedule from './pages/student/ThoiKhoaBieu'
import StudentbangDiem from './pages/student/BangDiem'
import StudentTuition from './pages/student/HocPhi'
import PhieuDiemRenLuyenIndex from './pages/student/PhieuDiemRenLuyen'
import DotTuyenSinhHome from './pages/admin/TuyenSinh/DotTuyenSinh'
import NamHocHome from './pages/admin/NamHoc'
import AdmissionCampaignDetail from './pages/admin/TuyenSinh/DotTuyenSinh/One/DotTuyenSinhDetail'
import TaoHoSoTuyenSinh from './pages/admin/TuyenSinh/HoSoTuyenSinh/TabHoSoTuyenSinh'
import ToHopMonHome from './pages/admin/TuyenSinh/ToHopMon'
import HoSoTuyenSinhHome from './pages/admin/TuyenSinh/HoSoTuyenSinh'
import CauHinhTuyenSinhHome from './pages/admin/TuyenSinh/CauHinhTuyenSinh'

// --- LAZY LOADING COMPONENTS ---

// Layouts chung
const MainLayout = lazy(() => import('./pages/client/layout/MainLayout'))
const PostLayout = lazy(() => import('./pages/client/PostDetail/PostLayout'))
const AdminMainLayout = lazy(() => import('./pages/admin/AdminMainLayout/AdminMainLayout'))
const MemberLayout = lazy(() => import('./pages/MembersDashboard/MemberSideBar/MemberLayout'))

// Client Pages
const Home = lazy(() => import('./pages/client/Home/Home'))
const GioiThieuVeTruong = lazy(() => import('./pages/client/GioiThieuVeTruong'))
const BoMayToChuc = lazy(() => import('./pages/client/BoMayToChuc/BoMayToChuc'))
const TamNhinSuMang = lazy(() => import('./pages/client/TamNhinSuMang'))
const SoDoToChuc = lazy(() => import('./pages/client/SoDoToChuc'))
const LienHe = lazy(() => import('./pages/client/LienHe/LienHe'))
const DangKyTuVan = lazy(() => import('./pages/client/DangKyTuVan/DangKyTuVan'))
const NewsList = lazy(() => import('./pages/client/NewsList'))
const UserPostDetail = lazy(() => import('./pages/client/PostDetail/UserPostDetail'))

// Admin Pages
const LoginPage = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard/Home'))
const AdminPostPreview = lazy(() => import('./pages/admin/QuanLyBaiViet/AdminPostPreview'))
const CreatePost = lazy(() => import('./pages/admin/QuanLyBaiViet/create/CreatePost'))
const UpdatePost = lazy(() => import('./pages/admin/QuanLyBaiViet/create/UpdatePost'))
const PostList = lazy(() => import('./pages/admin/QuanLyBaiViet/list/PostList'))
const ChuongTrinhKhung = lazy(() => import('./pages/admin/ChuongTrinhKhung/ChuongTrinhKhungIndex'))
const TaoChuongTrinhKhung = lazy(() => import('./pages/admin/ChuongTrinhKhung/Create/TaoChuongTrinhKhung'))
const LopHocLayout = lazy(() => import('./pages/admin/LopDanhNghia/LopHocLayout'))
const LopHocList = lazy(() => import('./pages/admin/LopDanhNghia/LopHocList'))
const LopHocOne = lazy(() => import('./pages/admin/LopDanhNghia/LopHocOne/index'))
const NhapDiemPage = lazy(() => import('./pages/admin/LopDanhNghia/LopHocOne/TableNhapDiem/NhapDiemPage'))
const TienDoDaoTao = lazy(() => import('./pages/admin/TienDoGiangDay'))
const ThoiKhoaBieuWrapper = lazy(() => import('./pages/admin/ThoiKhoaBieu/ThoiKhoaBieuWrapper'))
const PhanLopLayout = lazy(() => import('./pages/admin/PhanLop/PhanLopLayout'))
const PhanLop = lazy(() => import('./pages/admin/PhanLop/PhanLop'))
const KhoaIndex = lazy(() => import('./pages/admin/Khoa/KhoaIndex'))
const KhoaList = lazy(() => import('./pages/admin/Khoa/KhoaList'))
const KhoaDaoTao = lazy(() => import('./pages/admin/khoaHoc/KhoaDaoTaoIndex'))
const NganhIndex = lazy(() => import('./pages/admin/Nganh/NganhIndex'))
const MonHocIndex = lazy(() => import('./pages/admin/MonHoc/MonHocIndex'))
const HocSinhLayout = lazy(() => import('./pages/admin/HoSoHocSinh/HocSinhLayout'))
const DanhSachHoSoHocSinh = lazy(() => import('./pages/admin/HoSoHocSinh/HoSoHocSinhList/HoSoHocSinhList'))
const CreateStudent = lazy(() => import('./pages/admin/HoSoHocSinh/Create/Create'))
const HoSoHocSinhOne = lazy(() => import('./pages/admin/HoSoHocSinh/HoSoHocSinhOne/HoSoHocSinhOne'))
const HocKyLayout = lazy(() => import('./pages/admin/HocKy/HocKyLayout'))
const HocKyList = lazy(() => import('./pages/admin/HocKy/HocKyList'))
const NhanVienLayout = lazy(() => import('./pages/admin/QuanLyNhanVien/NhanVienLayout'))
const QuanLyTaiKhoan = lazy(() => import('./pages/admin/QuanLyAccount'))
const QuanLyNhanVien = lazy(() => import('./pages/admin/QuanLyNhanVien/NhanVienList/QuanLyNhanVienList'))
const NhanVienOne = lazy(() => import('./pages/admin/QuanLyNhanVien/NhanVienOne/NhanVienOne'))
const HuongDanSuDung = lazy(() => import('./pages/HuongDanSuDung'))
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))

// Teacher (Member) Pages
const MemberDashboard = lazy(() => import('./pages/MembersDashboard/Home'))
const LopHocGiangDay = lazy(() => import('./pages/MembersDashboard/LopGiangDay/LopGiangDay'))
const LopHocOneTeacher = lazy(() => import('./pages/MembersDashboard/LopGiangDay/LopHocOneTeacher'))
const BangDiem = lazy(() => import('./pages/MembersDashboard/NhapDiem/BangDiem'))
const ThoiKhoaBieu = lazy(() => import('./pages/MembersDashboard/ThoiKhoaBieu/ThoiKhoaBieu'))

// --- CONFIGURATION ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Component hiển thị khi đang tải trang (Loading Fallback)
const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-gray-50">
      {/* Icon xoay mượt mà */}
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />

      {/* Chữ hiển thị phía dưới */}
      <p className="animate-pulse text-sm font-medium text-gray-500 dark:text-gray-400">Đang tải trang...</p>
    </div>
  )
}

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
              <Route element={<PostLayout />}>
                <Route path="tin-tuc/xem-truoc" element={<AdminPostPreview />} />
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
              <Route index element={<Navigate to="/admin/home" replace />} />
              <Route path="home" element={<Dashboard />} />

              {/* Truyền thông */}
              <Route>
                <Route path="truyen-thong-bao-chi/tao-bai-viet" element={<CreatePost />} />
                <Route path="truyen-thong-bao-chi/:id/edit" element={<UpdatePost />} />
                <Route path="truyen-thong-bao-chi/bai-viet" element={<PostList />} />
              </Route>

              {/* Quản lý đào tạo */}
              <Route>
                <Route path="dao-tao/chuong-trinh-khung" element={<ChuongTrinhKhung />} />
                <Route path="dao-tao/tao-chuong-trinh-khung" element={<TaoChuongTrinhKhung />} />
                <Route element={<LopHocLayout />}>
                  <Route path="dao-tao/lop-hoc" element={<LopHocList />} />
                  <Route path="dao-tao/lop-hoc/:idLopHoc" element={<LopHocOne />} />
                  <Route path="dao-tao/lop-hoc/:idLopHoc/:idClassSubject" element={<NhapDiemPage />} />
                </Route>
                <Route path="dao-tao/tien-do-dao-tao" element={<TienDoDaoTao />} />
                <Route path="dao-tao/thoi-khoa-bieu" element={<ThoiKhoaBieuWrapper />} />
              </Route>

              <Route element={<PhanLopLayout />}>
                <Route path="hoc-sinh/phan-lop" element={<PhanLop />} />
              </Route>

              {/* Tuyển sinh */}
              <Route path="tuyen-sinh/dot-tuyen-sinh" element={<DotTuyenSinhHome />} />
              <Route path="tuyen-sinh/dot-tuyen-sinh/:id" element={<AdmissionCampaignDetail />} />
              <Route path="tuyen-sinh/to-hop-mon" element={<ToHopMonHome />} />
              <Route path="tuyen-sinh/ho-so-tuyen-sinh" element={<HoSoTuyenSinhHome />} />
              <Route path="tuyen-sinh/ho-so-tuyen-sinh/tao-moi" element={<TaoHoSoTuyenSinh />} />
              <Route path="tuyen-sinh/cau-hinh-tuyen-sinh" element={<CauHinhTuyenSinhHome />} />

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

              <Route path="diem-ren-luyen" element={<DiemRenLuyenIndex />} />
              <Route path="diem-ren-luyen/tieu-chi-danh-gia" element={<DiemRenLuyen_TieuChiDanhGiaIndex />} />

              {/* Công tác học sinh */}
              <Route element={<HocSinhLayout />}>
                <Route path="hoc-sinh/ho-so" element={<DanhSachHoSoHocSinh />} />
                <Route path="hoc-sinh/ho-so/create" element={<CreateStudent />} />
                <Route path="hoc-sinh/ho-so/:maSinhVien" element={<HoSoHocSinhOne />} />
              </Route>

              <Route path="nam-hoc" element={<NamHocHome />} />

              {/* Học kỳ */}
              <Route element={<HocKyLayout />}>
                <Route path="hoc-ky" element={<HocKyList />} />
              </Route>

              {/* Học phí */}
              <Route path="hoc-phi" element={<DotHocPhiIndex />} />
              <Route path="hoc-phi/:id" element={<DotHocPhiOne />} />
              <Route path="hoc-phi/tong-quan" element={<TuitionDashboard />} />

              {/* Địa chỉ */}
              <Route path="dia-chi" element={<DiaChiTree />} />

              {/* Quản trị nhân sự */}
              <Route element={<NhanVienLayout />}>
                <Route path="account" element={<QuanLyTaiKhoan />} />
                <Route path="users" element={<QuanLyNhanVien />} />
                <Route path="users/:staffCode" element={<NhanVienOne />} />
              </Route>

              {/* Cài đặt hệ thống */}
              <Route path="cai-dat/cau-hinh-chung" element={<CauHinhChung />} />
              <Route path="cai-dat/huong-dan-su-dung" element={<HuongDanSuDung />} />
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
              <Route path="lop-hoc/:idLopHoc" element={<LopHocOneTeacher />} />
              <Route path="lop-hoc/:idLopHoc/:idClassSubject" element={<BangDiem />} />
              <Route path="nhap-diem" element={<BangDiem />} />
              <Route path="thoi-khoa-bieu" element={<ThoiKhoaBieu />} />
            </Route>

            {/* ========================= Học sinh / Sinh viên ============================= */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute>
                  <StudentMainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<StudentDashboard />} />

              {/* Học tập */}
              <Route path="dao-tao/thoi-khoa-bieu" element={<WeeklySchedule />} />
              <Route path="dao-tao/khung-chuong-trinh" element={<StudentChuongTrinhKhung />} />
              <Route path="diem-so" element={<StudentbangDiem />} />
              <Route path="diem-ren-luyen" element={<PhieuDiemRenLuyenIndex />} />
              <Route path="hoc-phi" element={<StudentTuition />} />
            </Route>

            {/* Route 404 */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Suspense>
      </AppProvider>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  )
}

export default App
