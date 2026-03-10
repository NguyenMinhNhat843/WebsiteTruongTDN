import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import NavigationTree from "./NavigationTree";
import { navData } from "./navData";

const TopBar: React.FC = () => {
  return (
    <div className="w-full bg-blue-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
        <span className="text-sm font-semibold tracking-wider">
          HOTLINE: 0982 626 111
        </span>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="hover:text-blue-200 transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={16} strokeWidth={2.5} />
          </a>
          <a
            href="#"
            className="hover:text-blue-200 transition-colors"
            aria-label="Twitter"
          >
            <Twitter size={16} strokeWidth={2.5} />
          </a>
          <a
            href="#"
            className="hover:text-blue-200 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={16} strokeWidth={2.5} />
          </a>
          <a
            href="#"
            className="hover:text-blue-200 transition-colors"
            aria-label="Youtube"
          >
            <Youtube size={16} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
};

const HeaderNav: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          {/* Logo/Brand */}
          <div className="h-18 w-18 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="leading-tight">
            <div className="text-sm text-center font-normal text-gray-500 tracking-wide uppercase">
              Sở Lao Động Thương Binh Và Xã Hội Khánh Hòa
            </div>
            <div className="text-lg md:text-xl text-center font-bold text-blue-800 mt-0.5 tracking-tight">
              Trường Trung Cấp Kinh Tế – Kỹ Thuật Trần Đại Nghĩa
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-blue-800">
        <div className="max-w-5xl mx-auto">
          <NavigationTree data={navData} className="shadow-sm" />
        </div>
      </div>
    </header>
  );
};

const Header = () => {
  return (
    <>
      <TopBar />
      <HeaderNav />
    </>
  );
};

export default Header;
