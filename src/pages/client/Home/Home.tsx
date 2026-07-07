import CamNhanSection from "./components/CamNhanSection";
import ChuongTrinhDaoTao from "./components/ChuongTrinhDaoTao";
import MainBanner from "./components/MainBanner";
import NewsSection from "./components/NewsSection";
import QuyTrinhSection from "./components/QuyTrinhSection";
import ThanhTichSection from "./components/ThanhTichSection";
import TuyenSinhSection from "./components/TuyenSinhSection";
import ViSaoChonSection from "./components/ViSaoChonSection";

const Home = () => {
  return (
    <div>
      <MainBanner />
      <ChuongTrinhDaoTao />
      <TuyenSinhSection />
      <ThanhTichSection />
      <QuyTrinhSection />
      <CamNhanSection />
      <NewsSection />
      <ViSaoChonSection />
    </div>
  );
};

export default Home;
