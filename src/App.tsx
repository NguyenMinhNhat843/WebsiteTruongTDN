import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import AdmissionConsulation from "./pages/AdmissionConsulation";
import MainLayout from "./components/layouts/MainLayout";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<PostDetail />} />
        <Route path="/tu-van-tuyen-sinh" element={<AdmissionConsulation />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
