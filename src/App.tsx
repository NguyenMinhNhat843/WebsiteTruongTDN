import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import AdmissionConsulation from "./pages/AdmissionConsulation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<PostDetail />} />
        <Route path="/tu-van-tuyen-sinh" element={<AdmissionConsulation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
