import { useChuongTrinhKhungContext } from "./ChuongTrinhKhungProvider";
import Overview from "./Components/ChuongTrinhKhungOne/Overview";
import Modules from "./Components/ChuongTrinhKhungOne/Modules";
import HeaderOne from "./Components/ChuongTrinhKhungOne/HeaderOne";

const ChuongTrinhKhungOne = () => {
  const { selected, activeTab } = useChuongTrinhKhungContext();
  if (!selected) return null;

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden min-w-0">
      <HeaderOne />

      {activeTab === "overview" && <Overview />}
      {activeTab === "modules" && <Modules />}
    </div>
  );
};

export default ChuongTrinhKhungOne;
