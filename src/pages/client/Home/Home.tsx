import DangKyTuVan from "../DangKyTuVan/DangKyTuVan";
import ChuongTrinhDaoTao from "./components/ChuongTrinhDaoTao";
import MainBanner from "./components/MainBanner";
import MediaSection from "./components/MediaTabs";
import NewsSection from "./components/NewsSection";

const Home = () => {
  return (
    <div>
      <MainBanner />
      <ChuongTrinhDaoTao />
      <DangKyTuVan />
      <NewsSection />
      <MediaSection />
    </div>
  );
};

export default Home;
