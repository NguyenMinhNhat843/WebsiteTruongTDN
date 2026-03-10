import { navData } from "./navData";
import type { MenuItem } from "./types";

import React from "react";

type Props = {
  data?: MenuItem[];
  className?: string;
};

const renderSubGrid = (item: MenuItem) => {
  const isMega = item.layout === "mega";

  return (
    <div
      className={`
      absolute left-0 top-full bg-white text-gray-800 shadow-2xl rounded-b-lg border-t-2 border-blue-600 p-4 z-50
      hidden group-hover:block transition-all duration-200 w-max
    
    `}
    >
      {/* Container chứa các cụm */}
      <div
        className={`
        ${
          isMega
            ? "flex flex-row items-start gap-12" // Mega: Các cụm dàn hàng ngang, cách nhau 12 (48px)
            : "flex flex-col space-y-1" // Dropdown thường: Xếp dọc
        }
      `}
      >
        {item.children?.map((child) => (
          <div key={child.id} className={isMega ? "flex-1" : "w-full"}>
            {isMega ? (
              <>
                {/* Tiêu đề cụm - Xếp dọc bên trong mỗi cụm */}
                <h3 className="font-bold text-blue-900 mb-4 border-b pb-2 uppercase text-[13px] whitespace-nowrap">
                  {child.label}
                </h3>
                <ul className="space-y-3">
                  {child.children?.map((gc) => (
                    <li key={gc.id}>
                      <a
                        href={gc.href}
                        className="text-gray-600 hover:text-blue-600 text-[14px] transition-colors block leading-relaxed"
                      >
                        {gc.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              /* Dropdown dọc đơn giản */
              <a
                href={child.href}
                className="block p-2 text-sm hover:bg-blue-50 rounded-md transition-all whitespace-nowrap"
              >
                {child.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NavigationTree: React.FC<Props> = ({
  data = navData,
  className = "",
}) => {
  return (
    <nav className={`w-full ${className}`} aria-label="Main navigation">
      <ul className="flex justify-between items-center gap-8 px-4 py-2 md:py-2">
        {data.map((item) => (
          <li key={item.id} className="relative group">
            <a
              href={item.href ?? "#"}
              className="text-sm md:text-base text-white px-2 py-2 inline-block opacity-100 hover:opacity-75 transition-opacity duration-300 ease-in-out"
            >
              {item.label}
            </a>

            {item.children && item.children.length > 0 && (
              <>{renderSubGrid(item)}</>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationTree;
