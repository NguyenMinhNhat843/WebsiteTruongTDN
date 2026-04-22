import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/navTree/SideBar.tsx";
import { navItemTeacher } from "./navItemTeacher.tsx";
import UserProfileHeader from "../../admin/AdminMainLayout/UserProfileHeader.tsx";

const MemberLayout = () => {
  return (
    <div className="flex min-h-screen max-w-full">
      <aside className="sticky top-0 h-screen">
        <Sidebar
          items={navItemTeacher}
          defaultOpenIds={["products", "orders"]}
        />
      </aside>

      <main className="grow min-w-0">
        <div className="relative">
          <UserProfileHeader />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;
