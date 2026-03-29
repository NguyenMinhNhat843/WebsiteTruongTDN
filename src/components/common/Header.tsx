import { Facebook, Phone, Search } from "lucide-react";
import NavigationTree from "./navigation/NavigationTree";
import { Link } from "react-router-dom";

const HeaderNav = () => {
  // Type-safe cho hàm xử lý lỗi ảnh
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const img = e.currentTarget;
    if (img.src.includes("logo-fallback.png")) return;
    img.src = "/logo-fallback.png";
  };

  return (
    <header className="relative w-full bg-school-blue-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
        {/* LEFT: Logo + Tên trường */}
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3 shrink-0 text-center sm:text-left">
          <Link
            to="/"
            className="h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm shrink-0 hover:opacity-80 transition-opacity block mb-3 sm:mb-0"
          >
            <img
              src="/logo.png"
              alt="Logo Trường Trần Đại Nghĩa"
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          </Link>

          <div className="leading-tight">
            <h1 className="text-lg md:text-xl font-bold text-white mt-0.5 tracking-tight uppercase">
              Trường Trung Cấp Kinh Tế – Kỹ Thuật Trần Đại Nghĩa
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-8 h-px bg-blue-300 hidden md:block"></div>
              <p className="text-sm md:text-base font-medium text-amber-300 italic tracking-wide">
                "Chất lượng vàng – Niềm tin vàng"
              </p>
              <div className="w-8 h-px bg-blue-300 hidden md:block"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: Liên hệ + Mạng xã hội + Tìm kiếm */}
        <div className="flex flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto">
          {/* Hàng 1: Thông tin liên hệ */}
          <div className="flex items-center justify-center md:justify-end gap-3 w-full">
            {/* Điện thoại */}
            <a
              href="tel:0123456789"
              className="flex items-center gap-1.5 text-white hover:text-amber-300 transition-colors text-sm font-medium"
            >
              <Phone size={16} strokeWidth={2.5} />
              <span className="whitespace-nowrap">0123 456 789</span>
            </a>

            <div className="w-px h-4 bg-blue-300/50"></div>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-blue-300 transition-colors text-sm font-medium"
              title="Facebook"
            >
              <Facebook size={16} strokeWidth={2.5} />
              <span className="hidden lg:inline">Facebook</span>
            </a>

            {/* Zalo */}
            <a
              href="https://zalo.me/0123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-blue-300 transition-colors text-sm font-medium"
              title="Zalo"
            >
              <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0">
                Zalo
              </span>
              <span className="hidden lg:inline text-sm">Zalo</span>
            </a>
          </div>

          {/* Hàng 2: Ô tìm kiếm */}
          <div className="relative w-full max-w-75 md:w-full">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-3 pr-9 py-1.5 rounded-full text-sm bg-white/15 backdrop-blur-sm 
                         border border-white/30 text-white placeholder-white/60 
                         focus:outline-none focus:bg-white/25 focus:border-white/60 transition-all"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Header = () => {
  return (
    <header>
      {/* <TopBar /> */}

      <HeaderNav />

      <nav className="w-full bg-blue-800">
        <div className="max-w-6xl mx-auto">
          <NavigationTree className="shadow-sm" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
