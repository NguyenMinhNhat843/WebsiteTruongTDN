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
    <div className="relative group w-full h-[300px] overflow-hidden">
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
          dynamicBullets: true,
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

              {/* Overlay - Giúp chữ nổi bật hơn trên ảnh */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-up">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl max-w-2xl font-light">
                  {banner.subtitle}
                </p>
                <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-full font-medium">
                  Tìm hiểu ngay
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <button className="button-prev-slide absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft size={32} />
        </button>
        <button className="button-next-slide absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight size={32} />
        </button>
      </Swiper>

      {/* Override Swiper Pagination Color */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .swiper-pagination-bullet-active {
                background: #2563eb !important;
                width: 24px !important;
                border-radius: 4px !important;
            }
            `,
        }}
      />
    </div>
  );
};

export default MainBanner;
