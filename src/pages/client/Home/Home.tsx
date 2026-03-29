import ChuongTrinhDaoTao from "./components/ChuongTrinhDaoTao";
import MainBanner from "./components/MainBanner";
import MediaSection from "./components/MediaTabs";
import NewsSection from "./components/NewsSection";
import ThanhTichSection from "./components/ThanhTichSection";
import TuyenSinhSection from "./components/TuyenSinhSection";

const Home = () => {
  return (
    <div>
      <MainBanner />
      <ChuongTrinhDaoTao />
      <TuyenSinhSection />
      <ThanhTichSection />
      <NewsSection />
      <MediaSection />
    </div>
  );
};

export default Home;
