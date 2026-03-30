import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import FloatingContact from "../Home/components/FloatingContact";

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
