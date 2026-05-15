import { GradeComponentProvider } from "./GradeComponentProvider";
import { Outlet } from "react-router-dom";

const GradeComponentLayout = () => {
  return (
    <GradeComponentProvider>
      <Outlet />
    </GradeComponentProvider>
  );
};

export default GradeComponentLayout;
