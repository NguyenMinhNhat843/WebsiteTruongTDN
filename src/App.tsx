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
      <Route path="/admin" element={<AdminMainLayout />}>
        <Route
          path="truyen-thong-bao-chi/tao-bai-viet"
          element={<CreatePost />}
        />
        <Route path="dashboard" element={<div>Dashboard</div>} />
        <Route path="truyen-thong-bao-chi/bai-viet" element={<PostList />} />
        <Route path="users" element={<div>Quản lý người dùng</div>} />
        <Route
          path="quanlychuongtrinhdaotao"
          element={<div>Quản lý chương trình đào tạo</div>}
        />
        <Route path="menu1" element={<div>Tesst menu sidebar 1</div>} />
        <Route path="menu2" element={<div>Tesst menu sidebar 2</div>} />
        <Route path="menu3" element={<div>Tesst menu sidebar 3</div>} />
      </Route>

      {/* Route 404 - Luôn để ở cuối cùng */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
