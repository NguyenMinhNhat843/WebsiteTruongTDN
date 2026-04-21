import { KhoaProvider } from "./KhoaProvider";
import { Outlet } from "react-router-dom";

const KhoaIndex = () => {
  return (
    <KhoaProvider>
      <Outlet />
    </KhoaProvider>
  );
};

export default KhoaIndex;
