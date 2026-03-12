import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import MainLayout from "./components/layouts/MainLayout";
import NewsList from "./pages/NewsList";
import BoMayToChuc from "./pages/BoMayToChuc";
import PostLayout from "./components/layouts/PostLayout";
import ChuongTrinhDaoTaoDetail from "./pages/ChuongTrinhDaoTaoDetail";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/bo-may-to-chuc" element={<BoMayToChuc />} />
        <Route path="/chuong-trinh-dao-tao">
          <Route path=":heDaoTaoSlug" element={<ChuongTrinhDaoTaoDetail />} />

          <Route path=":heDaoTaoSlug/:nganhSlug" element={<PostDetail />} />
        </Route>
        <Route path="/tin-tuc" element={<NewsList />} />
        <Route element={<PostLayout />}>
          <Route path="tin-tuc/:slug" element={<PostDetail />} />
        </Route>
        <Route path="/:slug" element={<PostDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
