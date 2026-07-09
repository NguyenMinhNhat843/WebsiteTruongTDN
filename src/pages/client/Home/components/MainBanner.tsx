import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const BANNERS = [
  {
    id: 1,
    image: "/Home/trandainghia_banner1.jpg",
    tag: "Chào Mừng Đến Với Nhà Trường",
    title: "Trường Trung Cấp Kinh Tế - Kỹ Thuật Trần Đại Nghĩa",
    ctaText: "ĐĂNG KÝ XÉT TUYỂN",
    ctaLink: "/dang-ky-tuyen-sinh",
  },
  {
    id: 2,
    image: "/Home/trandainghia_banner2.jpg",
    tag: "Đào Tạo Chất Lượng",
    title: "Học Tập Chủ Động - Vững Bước Thành Công",
    ctaText: "KHÁM PHÁ NGAY",
    ctaLink: "/dang-ky-tuyen-sinh",
  },
  {
    id: 3,
    image: "/Home/trandainghia_banner3.jpg",
    tag: "Tương Lai Tươi Sáng",
    title: "Đồng Hành Cùng Bạn Trên Con Đường Lập Nghiệp",
    ctaText: "ĐĂNG KÝ XÉT TUYỂN",
    ctaLink: "/dang-ky-tuyen-sinh",
  },
];

const MainBanner = () => {
  return (
    <div className="relative group w-full h-[calc(100vh-138px)] min-h-[500px] overflow-hidden bg-slate-950">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".button-next-slide",
          prevEl: ".button-prev-slide",
        }}
        className="w-full h-full"
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full select-none">
              {/* Image with optimized overlay */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transform scale-100 transition-transform duration-[6000ms] cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              />

              {/* Gradient overlay to optimize contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-slate-950/40" />

              {/* Center Layout Content */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="max-w-3xl text-center flex flex-col items-center">
                  {/* Small Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md animate-fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    {banner.tag}
                  </span>

                  {/* Micro-text presentation header inside container */}
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-8 max-w-2xl drop-shadow-xl uppercase">
                    {banner.title}
                  </h2>

                  {/* Primary Call to Action Actionable Link */}
                  <a
                    href={banner.ctaLink}
                    className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 active:scale-[0.98] text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-amber-500/10 transition-all group/btn"
                  >
                    {banner.ctaText}
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Arrows for Desktop */}
        <button className="button-prev-slide absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/20 hover:bg-slate-900/60 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hidden md:flex">
          <ChevronLeft size={24} />
        </button>
        <button className="button-next-slide absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/20 hover:bg-slate-900/60 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hidden md:flex">
          <ChevronRight size={24} />
        </button>
      </Swiper>

      {/* Styled Bullet Pagination System */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .swiper-pagination {
              bottom: 32px !important;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
            }
            .swiper-pagination-bullet {
              background: rgba(255, 255, 255, 0.35) !important;
              opacity: 1 !important;
              width: 12px !important;
              height: 4px !important;
              border-radius: 2px !important;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
              margin: 0 !important;
            }
            .swiper-pagination-bullet:hover {
              background: rgba(255, 255, 255, 0.7) !important;
            }
            .swiper-pagination-bullet-active {
              background: #f59e0b !important; /* Thay màu trắng bằng màu vàng hổ phách đồng bộ thương hiệu */
              width: 36px !important;
              box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
            }
          `,
        }}
      />
    </div>
  );
};

export default MainBanner;
