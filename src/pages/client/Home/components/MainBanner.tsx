import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const BANNERS = [
  {
    id: 1,
    image:
      "https://gcs.tripi.vn/public-tripi/tripi-feed/img/482784zKE/anh-mo-ta.png",
    title: "Chào mừng đến với Trường của chúng tôi",
    subtitle: "Nơi ươm mầm những tài năng tương lai với môi trường hiện đại.",
  },
  {
    id: 2,
    image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-16.jpg",
    title: "Tuyển sinh năm học 2026",
    subtitle: "Đa dạng ngành nghề, cam kết việc làm sau khi tốt nghiệp.",
  },
];

const MainBanner = () => {
  return (
    <div className="relative group w-full h-[calc(100vh-138px)] overflow-hidden bg-slate-900">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false, // Tắt cái này để các chấm không bị teo nhỏ bất thường
        }}
        navigation={{
          nextEl: ".button-next-slide",
          prevEl: ".button-prev-slide",
        }}
        className="w-full h-full"
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              {/* Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay - Tăng nhẹ độ tối (bg-black/30) giúp text và pagination sáng rõ hơn */}
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-up tracking-tight drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl max-w-2xl font-light opacity-90 drop-shadow-sm">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <button className="button-prev-slide absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/15 hover:bg-black/30 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/10 shadow-lg">
          <ChevronLeft size={28} />
        </button>
        <button className="button-next-slide absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/15 hover:bg-black/30 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/10 shadow-lg">
          <ChevronRight size={28} />
        </button>
      </Swiper>

      {/* Tối ưu hóa UI Hệ thống Pagination chuyển thành thanh kén (Capsule) cao cấp */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Container chứa các dấu chấm */
            .swiper-pagination {
              bottom: 24px !important;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
            }
            
            /* Cấu hình chấm mặc định (Chưa active) */
            .swiper-pagination-bullet {
              background: rgba(255, 255, 255, 0.45) !important;
              opacity: 1 !important;
              width: 10px !important;
              height: 6px !important;
              border-radius: 9999px !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              margin: 0 !important;
            }
            
            /* Hiệu ứng Hover lên các chấm */
            .swiper-pagination-bullet:hover {
              background: rgba(255, 255, 255, 0.8) !important;
            }

            /* Cấu hình chấm khi được kích hoạt (Active) */
            .swiper-pagination-bullet-active {
              background: #ffffff !important; /* Dùng màu trắng tinh khôi quý phái hơn màu xanh cũ trên nền ảnh này */
              width: 32px !important; /* Kéo dài thành dạng thanh kén sang trọng */
              height: 6px !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
          `,
        }}
      />
    </div>
  );
};

export default MainBanner;
