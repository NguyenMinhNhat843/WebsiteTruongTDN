import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import FloatingContact from "../../pages/client/Home/components/FloatingContact";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
        <FloatingContact />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
