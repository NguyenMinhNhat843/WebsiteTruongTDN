import { Facebook, Instagram, Youtube } from "lucide-react";
import NavigationTree from "./navigation/NavigationTree";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  {
    Icon: Youtube,
    label: "Youtube",
    href: "https://www.youtube.com/@truongtckt-kttrandainghia",
  },
] as const;
const HOTLINE = "0982 626 111";

const TopBar = () => {
  return (
    <div className="w-full bg-blue-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
        <a
          href={`tel:${HOTLINE}`}
          className="text-sm font-semibold tracking-wider"
        >
          HOTLINE: {HOTLINE}
        </a>
        <div className="flex items-center space-x-4">
          {SOCIAL_LINKS.map(({ Icon, label, href }) => (
            <a
              href={href}
              className="hover:text-school-blue-200 transition-colors"
              aria-label={label}
              key={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={16} strokeWidth={2.5} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const GeometricLines = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 900 110"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="0"
      y1="0"
      x2="900"
      y2="110"
      stroke="rgba(96,165,250,0.12)"
      strokeWidth="1"
    />
    <line
      x1="0"
      y1="30"
      x2="900"
      y2="140"
      stroke="rgba(96,165,250,0.09)"
      strokeWidth="1"
    />
    <line
      x1="900"
      y1="0"
      x2="0"
      y2="110"
      stroke="rgba(251,191,36,0.07)"
      strokeWidth="1"
    />
    <rect
      x="700"
      y="-20"
      width="260"
      height="160"
      rx="2"
      fill="rgba(96,165,250,0.04)"
      transform="rotate(-12 800 55)"
    />
    <rect
      x="720"
      y="-10"
      width="200"
      height="130"
      rx="2"
      fill="none"
      stroke="rgba(96,165,250,0.08)"
      strokeWidth="0.8"
      transform="rotate(-12 800 55)"
    />
  </svg>
);

const HeaderNav = () => {
  return (
    // <div className="relative w-full shadow-md bg-[url('/banner.png')] bg-cover bg-center">
    <div className="relative w-full " style={{ background: "#0e2a4a" }}>
      {/* SVG trang trí tuyệt đối */}
      <GeometricLines />

      {/* <div className="absolute inset-0 bg-black/50 md:bg-black/40 shadow-inner"></div> */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center relative z-10">
        <div className="flex items-center space-x-3">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="h-20 w-20 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm shrink-0 hover:opacity-80 transition-opacity block"
          >
            <img
              src="/logo.png"
              alt="Logo Trường Trần Đại Nghĩa"
              className="h-full w-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.includes("logo-fallback.png")) return;
                img.src = "/logo-fallback.png";
              }}
            />
          </Link>

          <div className="leading-tight">
            <div className="text-lg md:text-2xl text-center font-bold text-white mt-0.5 tracking-tight">
              Trường Trung Cấp Kinh Tế – Kỹ Thuật Trần Đại Nghĩa
            </div>
            <div className="flex items-center justify-center gap-2">
              {/* Đường kẻ nhỏ trang trí trước slogan */}
              <div className="w-8 h-px bg-blue-300 hidden md:block"></div>
              <p className="text-sm md:text-base font-medium text-amber-300 italic tracking-wide">
                "Chất lượng vàng – Niềm tin vàng"
              </p>
              <div className="w-8 h-px bg-blue-300 hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <TopBar />

      <HeaderNav />

      <nav className="w-full bg-blue-800">
        <div className="max-w-5xl mx-auto">
          <NavigationTree className="shadow-sm" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
