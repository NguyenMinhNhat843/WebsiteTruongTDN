import { Facebook, Phone } from "lucide-react";
import NavigationTree from "../navigation/NavigationTree";
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
    <header className="relative w-full bg-school-blue-950 border-b border-blue-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between relative z-10 gap-4 md:gap-6">
        {/* LEFT: Logo + Tên trường */}
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 shrink-0 text-center sm:text-left">
          <Link
            to="/"
            className="h-14 w-14 md:h-16 md:w-16 rounded-full overflow-hidden border-2 border-blue-200/60 shadow-md shrink-0 hover:opacity-90 transition-opacity block mb-3 sm:mb-0 bg-white/5"
          >
            <img
              src="/logo.png"
              alt="Logo Trường Trần Đại Nghĩa"
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          </Link>

          <div className="leading-tight">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white mt-0.5 tracking-tight uppercase max-w-2xl drop-shadow-sm">
              Trường Trung Cấp Kinh Tế – Kỹ Thuật Trần Đại Nghĩa
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <div className="w-6 h-px bg-blue-400/50 hidden sm:block"></div>
              <p className="text-xs sm:text-sm md:text-base font-medium text-amber-300 italic tracking-wide">
                "Chất lượng vàng – Niềm tin vàng"
              </p>
              <div className="w-6 h-px bg-blue-400/50 hidden sm:block"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: Liên hệ + Mạng xã hội (Đã loại bỏ ô Search, tối ưu không gian phẳng) */}
        <div className="flex items-center justify-center md:justify-end gap-4 shrink-0 w-full md:w-auto py-1 border-t border-white/5 md:border-none mt-2 md:mt-0">
          {/* Điện thoại */}
          <a
            href="tel:0123456789"
            className="flex items-center gap-1.5 text-white hover:text-amber-300 transition-colors text-sm font-semibold tracking-wide group"
          >
            <Phone
              size={15}
              strokeWidth={2.5}
              className="text-amber-400 group-hover:scale-110 transition-transform"
            />
            <span className="whitespace-nowrap">0123 456 789</span>
          </a>

          <div className="w-px h-4 bg-blue-800"></div>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/90 hover:text-blue-400 transition-colors text-sm font-medium"
            title="Facebook"
          >
            <Facebook size={15} strokeWidth={2.5} className="fill-current" />
            <span className="hidden sm:inline text-xs font-semibold">
              Facebook
            </span>
          </a>

          <div className="w-px h-4 bg-blue-800"></div>

          {/* Zalo */}
          <a
            href="https://zalo.me/0123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/90 hover:text-blue-400 transition-colors text-sm font-medium"
            title="Zalo"
          >
            <span className="bg-[#0068ff] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-tighter leading-none shrink-0">
              ZALO
            </span>
            <span className="hidden sm:inline text-xs font-semibold">Zalo</span>
          </a>
        </div>
      </div>
    </header>
  );
};

const Header = () => {
  return (
    <>
      {/* Header chỉ chứa phần thông tin logo, cuộn đi tự nhiên */}
      <header className="w-full bg-white">
        {/* <TopBar /> */}
        <HeaderNav />
      </header>

      {/* Nav nằm ngoài hẳn header, ngang hàng với header nên sẽ ghim chuẩn 100% */}
      <nav className="w-full bg-blue-800 sticky top-0 z-50 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto">
          <NavigationTree className="shadow-none" />
        </div>
      </nav>
    </>
  );
};

export default Header;
