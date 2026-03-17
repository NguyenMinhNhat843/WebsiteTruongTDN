import ChuongTrinhDaoTao from "../components/home/ChuongTrinhDaoTao";
import MainBanner from "../components/home/MainBanner";
import MediaSection from "../components/home/MediaTabs";
import NewsSection from "../components/home/NewsSection";
import DangKyTuVan from "../components/home/DangKyTuVan";

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
