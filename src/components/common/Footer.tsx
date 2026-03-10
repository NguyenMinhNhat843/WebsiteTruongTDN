import {
  Facebook,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Music2, // TikTok thường dùng icon nốt nhạc trong Lucide
} from "lucide-react";

const Footer = () => {
  return (
    <section className="bg-blue-900 text-white pt-12 pb-4 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-12">
        {/* Cột 1: Bản đồ */}
        <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border border-blue-700/50">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.96638428612!2d106.67493631525656!3d10.813813961456976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e1f00a5d21%3A0x633d744833256a1b!2zMzQgTmd1eeG7hW4gQsSpbmggS2hpw6ptLCBQaMaw4budbmcgMSwgR8OyIFZhcCwgVGjDoG5oIHFwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s"
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            title="Địa chỉ trường"
            className="grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>

        {/* Cột 2: Thông tin liên hệ */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl md:text-2xl font-extrabold uppercase leading-tight tracking-wide">
              Trường Trung cấp Kinh tế - Kỹ thuật <br />
              <span className="text-blue-400">Trần Đại Nghĩa</span>
            </h2>
            <div className="h-1 w-20 bg-blue-400 mt-2 rounded-full"></div>
          </div>

          {/* Mạng xã hội */}
          <div className="flex gap-3">
            {[
              { Icon: Facebook, link: "#" },
              { Icon: Music2, link: "#" },
              { Icon: Youtube, link: "#" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="p-2.5 rounded-lg bg-blue-800/50 hover:bg-blue-400 hover:text-blue-900 transition-all duration-300 border border-blue-700"
              >
                <item.Icon size={20} strokeWidth={2} />
              </a>
            ))}
          </div>

          {/* Chi tiết liên hệ */}
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-800/50 rounded-lg text-blue-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Địa chỉ:</p>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Đường 2/4, Phường Vĩnh Phước, TP. Nha Trang, Khánh Hòa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-800/50 rounded-lg text-blue-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-blue-200 text-sm">
                  <span className="font-semibold text-white uppercase mr-2 text-xs border border-blue-700 px-2 py-0.5 rounded">
                    Hotline
                  </span>
                  +84-258-2220999 | +84-258-2241999
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-800/50 rounded-lg text-blue-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Email:</p>
                <p className="text-blue-200 text-sm hover:text-blue-400 cursor-pointer transition-colors">
                  info@trandainghiant.edu.vn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bản quyền phía dưới cùng */}
      <div className="container mx-auto mt-12 pt-6 border-t border-blue-800 text-center text-blue-400 text-xs">
        © 2026 Trường Trung cấp kinh tế - kỹ thuật Trần Đại Nghĩa.
      </div>
    </section>
  );
};

export default Footer;
