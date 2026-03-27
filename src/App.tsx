import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import NewsList from "./pages/client/NewsList";
import PostLayout from "./components/layouts/PostLayout";
import GioiThieuVeTruong from "./pages/client/GioiThieuVeTruong";
import TamNhinSuMang from "./pages/client/TamNhinSuMang";
import SoDoToChuc from "./pages/client/SoDoToChuc";
import HopTacQuocTe from "./pages/client/HopTacQuocTe";
import CreatePost from "./pages/admin/CreatePost";
import AdminLayout from "./components/layouts/AdminLayout";
import BoMayToChuc from "./pages/client/BoMayToChuc/BoMayToChuc";
import LienHe from "./pages/client/LienHe/LienHe";
import DangKyTuVan from "./pages/client/DangKyTuVan/DangKyTuVan";
import ChuongTrinhDaoTaoDetail from "./pages/client/ChuongTrinhDaoTaoDetail";
import PostDetail from "./pages/client/PostDetail";
import Home from "./pages/client/Home/Home";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Giới thiệu về trường */}
        <Route path="/gioi-thieu-chung" element={<GioiThieuVeTruong />} />
        <Route path="/bo-may-to-chuc" element={<BoMayToChuc />} />
        <Route
          path="/tam-nhin-su-mang-gia-tri-cot-loi"
          element={<TamNhinSuMang />}
        />
        <Route path="/so-do-to-chuc" element={<SoDoToChuc />} />
        <Route path="/hop-tac-quoc-te" element={<HopTacQuocTe />} />

        {/* Liên hệ */}
        <Route path="/lien-he-cong-tac" element={<LienHe />} />
        <Route path="/dang-ky-tuyen-sinh" element={<DangKyTuVan />} />

        {/* Chương trình đào tạo */}
        <Route path="/chuong-trinh-dao-tao">
          <Route path=":heDaoTaoSlug" element={<ChuongTrinhDaoTaoDetail />} />
          <Route path=":heDaoTaoSlug/:nganhSlug" element={<PostDetail />} />
        </Route>

        {/* tin tức */}
        <Route path="/tin-tuc" element={<NewsList />} />
        <Route element={<PostLayout />}>
          <Route path="tin-tuc/:slug" element={<PostDetail />} />
          <Route path="tuyen-dung/:slug" element={<PostDetail />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="create-post" element={<CreatePost />} />
        <Route path="dashboard" element={<div>Dashboard</div>} />
      </Route>
    </Routes>
  );
}

export default App;
