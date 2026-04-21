import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/navTree/SideBar.tsx";
import navItems from "./navItem.ts";
import UserProfileHeader from "./UserProfileHeader.tsx";

const AdminMainLayout = () => {
  return (
    <div className="flex min-h-screen max-w-full">
      <aside className="sticky top-0 h-screen">
        <Sidebar items={navItems} defaultOpenIds={["products", "orders"]} />
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

export default AdminMainLayout;
