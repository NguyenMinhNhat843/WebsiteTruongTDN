import { PhanLopProvider } from "./PhanLopProvider";
import { Outlet } from "react-router-dom";

const PhanLopLayout = () => {
  return (
    <PhanLopProvider>
      <Outlet />
    </PhanLopProvider>
  );
};

export default PhanLopLayout;
