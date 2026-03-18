import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import MainLayout from "./components/layouts/MainLayout";
import NewsList from "./pages/NewsList";
import BoMayToChuc from "./pages/BoMayToChuc";
import PostLayout from "./components/layouts/PostLayout";
import ChuongTrinhDaoTaoDetail from "./pages/ChuongTrinhDaoTaoDetail";
import DangKyTuVan from "./pages/DangKyTuVan";
import GioiThieuVeTruong from "./pages/GioiThieuVeTruong";
import TamNhinSuMang from "./pages/TamNhinSuMang";
import SoDoToChuc from "./pages/SoDoToChuc";
import HopTacQuocTe from "./pages/HopTacQuocTe";

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

        <Route path="/:slug" element={<PostDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
