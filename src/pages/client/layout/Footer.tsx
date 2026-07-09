import {
  Facebook,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Music2, // TikTok thường dùng icon nốt nhạc trong Lucide
} from "lucide-react";

interface ContactInfoItemProp {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  content: string;
  isLink?: boolean;
  href?: string;
}

const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", link: "#" },
  { Icon: Music2, label: "TikTok", link: "#" },
  { Icon: Youtube, label: "Youtube", link: "#" },
] as const;

const CONTACT_INFO: ContactInfoItemProp[] = [
  {
    Icon: MapPin,
    label: "Cơ sở 1:",
    content: "1028 đường 2/4, phường Bắc Sơn, TP. Nha Trang, Tỉnh Khánh Hòa",
    isLink: false,
  },
  {
    Icon: MapPin,
    label: "Cơ sở 2:",
    content: "25 Lê Lợi, phường Xương Huân, TP. Nha Trang, Tỉnh Khánh Hòa",
    isLink: false,
  },
  {
    Icon: MapPin,
    label: "Cơ sở 3:",
    content:
      "Thửa đất 183, Tổ dân phố Lộc Hải, Phường Cam Lộc, TP. Cam Ranh, Tỉnh Khánh Hòa",
    isLink: false,
  },
  {
    Icon: Phone,
    label: "Điện thoại:",
    content: "(025) 8625 6999",
    isLink: false,
  },
  {
    Icon: Phone,
    label: "Hotline/Zalo:",
    content: "081 4393 535",
    isLink: false,
  },
  {
    Icon: Mail,
    label: "Email:",
    content: "tctdn@khanhhoa.gov.vn",
    isLink: true,
    href: "mailto:tctdn@khanhhoa.gov.vn",
  },
];

const InfoItem = ({ item }: { item: ContactInfoItemProp }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-blue-800/50 rounded-lg text-school-blue-400 shrink-0">
        <item.Icon size={20} />
      </div>
      <div>
        <p className="font-semibold text-white">{item.label}</p>
        {item.isLink ? (
          <a
            href={item.href}
            className="text-school-blue-200 text-sm hover:text-school-blue-400 cursor-pointer transition-colors break-all"
          >
            {item.content}
          </a>
        ) : (
          <p className="text-school-blue-200 text-sm">{item.content}</p>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-4 px-4">
      {/* Thêm md:items-stretch để ép 2 cột bằng chiều cao nhau */}
      <div className="max-w-7xl px-4 sm:px-4 mx-auto flex flex-col md:flex-row items-stretch gap-12">
        {/* Cột 1: Bản đồ - Đổi aspect-video thành h-full trên PC, set chiều cao tối thiểu cho mobile */}
        <div className="w-full md:w-1/2 min-h-[350px] md:min-h-full rounded-2xl overflow-hidden shadow-2xl border border-blue-700/50">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.9227336237846!2d109.19086307484181!3d12.253507987999754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317067017e128bf5%3A0x575db80a15914628!2zVHLGsOG7nW5nIFRydW5nIGPhuqVwIEtpbmggdOG6vyAtIEvhu7kgdGh14bqtdCBUcuG6p24gxJDhuqFpIE5naMSpYQ!5e0!3m2!1svi!2s!4v1773194714627!5m2!1svi!2s"
            className="w-full h-full min-h-[350px] md:min-h-full object-cover"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Cột 2: Thông tin liên hệ */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-between gap-6">
          {/* Tên trường - Luôn căn giữa trên mọi thiết bị */}
          <div className="text-center flex flex-col items-center w-full">
            <h2 className="text-2xl md:text-2xl font-extrabold uppercase leading-tight tracking-wide">
              Trường Trung cấp Kinh tế - Kỹ thuật <br />
              <span className="text-yellow-400 text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Trần Đại Nghĩa
              </span>
            </h2>
            <div className="h-1 w-20 bg-yellow-400 mt-2 rounded-full"></div>
          </div>

          {/* Mạng xã hội - Đã thêm shadow và hiệu ứng nổi bật */}
          <div className="flex gap-3 justify-center md:justify-start w-full">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.link}
                aria-label={item.label}
                className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 border border-blue-600/50 shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:shadow-[0_0_16px_rgba(234,179,8,0.4)] hover:-translate-y-0.5"
              >
                <item.Icon size={20} strokeWidth={2.5} />
              </a>
            ))}
          </div>

          {/* Thông tin liên hệ - Thêm style nổi bật cho các icon bên trong */}
          <div className="w-full flex flex-col gap-4 [&_svg]:text-yellow-400 [&_svg]:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]">
            {CONTACT_INFO.map((item) => (
              <InfoItem key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bản quyền phía dưới cùng */}
      <div className="container mx-auto mt-12 pt-6 border-t border-blue-800 text-center text-school-blue-400 text-xs">
        © 2026 Trường Trung cấp kinh tế - kỹ thuật Trần Đại Nghĩa.
      </div>
    </footer>
  );
};

export default Footer;
