import { useEffect } from "react";
import ChuongTrinhDaoTao from "../components/home/ChuongTrinhDaoTao";
import ConsultationForm from "../components/home/DangKyTuVan";
import MainBanner from "../components/home/MainBanner";
import MediaSection from "../components/home/MediaTabs";
import NewsSection from "../components/home/NewsSection";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Đợi một chút để các Component kịp render xong
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // Delay 100ms để đảm bảo DOM đã sẵn sàng
      }
    }
  }, [hash]);
  return (
    <div>
      <MainBanner />
      <ChuongTrinhDaoTao />
      <ConsultationForm />
      <MediaSection />
      <NewsSection />
    </div>
  );
};

export default Home;
