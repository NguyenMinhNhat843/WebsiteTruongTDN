import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/navTree/SideBar.tsx";
import UserProfileHeader from "../../admin/AdminMainLayout/UserProfileHeader.tsx";
import { navItemTeacher } from "./navItemTeacher.tsx";

const MemberLayout = () => {
  return (
    <div className="flex min-h-screen max-w-full">
      <aside className="sticky top-0 h-screen">
        <Sidebar items={navItemTeacher} defaultOpenIds={[]} />
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
