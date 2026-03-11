import ChuongTrinhDaoTao from "../components/home/ChuongTrinhDaoTao";
import ConsultationForm from "../components/home/DangKyTuVan";
import MainBanner from "../components/home/MainBanner";
import MediaSection from "../components/home/MediaTabs";
import NewsSection from "../components/home/NewsSection";

const Home = () => {
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
