import React from "react";
import clsx from "clsx";

// 1. Định nghĩa interface với Generic T
interface Tab<T> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps<T> {
  tabs: readonly Tab<T>[]; // Thêm readonly để dùng được với "as const"
  activeTab?: T;
  onChange?: (id: T) => void;
  className?: string;
}

// 2. Cú pháp Const với Generic: <T,> (có dấu phẩy) là mẹo để
// TypeScript không nhầm lẫn T với một thẻ HTML (JSX)
const Tabs = <T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) => {
  return (
    <div className={clsx("flex border-b border-gray-100 gap-8", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={clsx(
              "flex items-center gap-2 py-4 text-sm font-semibold transition-all relative cursor-pointer",
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600",
            )}
          >
            {tab.icon}
            {tab.label}

            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
