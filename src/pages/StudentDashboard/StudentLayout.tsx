import { Outlet } from "react-router-dom";
import UserProfileHeader from "../admin/AdminMainLayout/UserProfileHeader";
import Sidebar from "../../components/navTree/SideBar.tsx";
import { navItemStudent } from "./navItemStudent.tsx";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen max-w-full">
      <aside className="sticky top-0 h-screen">
        <Sidebar
          items={navItemStudent}
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

export default StudentLayout;
