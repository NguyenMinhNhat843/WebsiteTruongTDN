import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import MainLayout from "./components/layouts/MainLayout";
import NewsList from "./pages/NewsList";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="tin-tuc" element={<NewsList />} />
        <Route path="tin-tuc/:slug" element={<PostDetail />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
