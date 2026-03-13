import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { navData } from "./navData";
import type { MenuItem } from "./types";

type Props = {
  data?: MenuItem[];
  className?: string;
};

const NavigationTree = ({ data = navData, className = "" }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

  const toggleMobileSubMenu = (id: string) => {
    setActiveMobileMenu(activeMobileMenu === id ? null : id);
  };

  return (
    <nav
      className={`relative w-full ${className}`}
      aria-label="Main navigation"
    >
      {/* --- MOBILE CONTROL --- */}
      <div className="lg:hidden flex justify-end p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MENU LIST --- */}
      <ul
        className={`
        /* Base styles */
        flex flex-col lg:flex-row lg:justify-between lg:items-center px-4
        /* Mobile styles */
        ${isOpen ? "max-h-[80vh] opacity-100 py-4" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"} 
        overflow-y-auto lg:overflow-visible transition-all duration-300 ease-in-out
      `}
      >
        {data.map((item) => (
          <li key={item.id} className="relative group">
            <div className="flex items-center justify-between">
              <a
                href={item.href ?? "#"}
                className="text-base text-white py-3 lg:py-2 px-2 block w-full hover:text-blue-200 transition-colors uppercase font-medium lg:font-normal lg:normal-case"
              >
                {item.label}
              </a>

              {/* Nút bấm mở rộng cho Mobile */}
              {item.children && item.children.length > 0 && (
                <button
                  onClick={() => toggleMobileSubMenu(item.id)}
                  className="lg:hidden text-white p-3"
                >
                  <ChevronDown
                    className={`transition-transform ${activeMobileMenu === item.id ? "rotate-180" : ""}`}
                    size={20}
                  />
                </button>
              )}
            </div>

            {/* --- SUB MENU LOGIC --- */}
            {item.children && item.children.length > 0 && (
              <div
                className={`
                /* Desktop: Hover để hiện */
                lg:absolute lg:left-0 lg:top-full lg:invisible lg:opacity-0 lg:group-hover:visible lg:group-hover:opacity-100 lg:group-hover:translate-y-1
                /* Mobile: Click để hiện */
                ${activeMobileMenu === item.id ? "block" : "hidden lg:block"}
                bg-white lg:shadow-2xl lg:rounded-b-lg lg:border-t-2 lg:border-school-blue-600 p-4 z-50 transition-all duration-200
                min-w-50 lg:w-max
              `}
              >
                {item.layout === "mega" ? (
                  <MegaMenu item={item} />
                ) : (
                  <DropdownMenu item={item} />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// --- Sub Components (Tối ưu hiển thị cho cả 2 nền tảng) ---

const MegaMenu = ({ item }: { item: MenuItem }) => (
  <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
    {item.children?.map((child) => (
      <div key={child.id} className="w-full lg:flex-1">
        <h3 className="font-bold text-blue-900 mb-2 lg:mb-4 border-b pb-1 lg:pb-2 uppercase text-[12px] lg:text-[13px]">
          {child.label}
        </h3>
        <ul className="space-y-2 lg:space-y-3 pl-2 lg:pl-0">
          {child.children?.map((gc) => (
            <li key={gc.id}>
              <a
                href={gc.href}
                className="text-gray-600 hover:text-blue-600 text-sm flex items-center gap-2"
              >
                <ChevronRight size={12} className="lg:hidden text-blue-400" />
                {gc.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const DropdownMenu = ({ item }: { item: MenuItem }) => (
  <div className="flex flex-col space-y-1 pl-2 lg:pl-0">
    {item.children?.map((child) => (
      <a
        key={child.id}
        href={child.href}
        className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-all"
      >
        {child.label}
      </a>
    ))}
  </div>
);

export default NavigationTree;
