import { useState } from "react";
import CauHinhHoSoHocSinh from "./TabCauHinhHoSoHocSinh";

type TabKey = "ho-so-hoc-sinh";

interface TabItem {
  key: TabKey;
  label: string;
  component: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    key: "ho-so-hoc-sinh",
    label: "Cấu hình hồ sơ học sinh",
    component: <CauHinhHoSoHocSinh />,
  },
  // Thêm tab mới ở đây, ví dụ:
  // { key: "abc", label: "Cấu hình ABC", component: <CauHinhABC /> },
];

const CauHinhChung = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0].key);

  return (
    <div className="p-4">
      {/* Thanh tab */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
    </div>
  );
};

export default CauHinhChung;
