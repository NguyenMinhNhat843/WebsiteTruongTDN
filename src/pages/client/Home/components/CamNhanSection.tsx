import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Quote, Star, ArrowLeft, ArrowRight } from "lucide-react";

// Import Swiper styles trực tiếp vào component
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Testimonial {
  id: number;
  name: string;
  major: string;
  job: string;
  comment: string;
  avatar: string;
}

// Mở rộng thành 4 data chuẩn hóa bám sát 3 ngành hot
const cuuSinhVienData: Testimonial[] = [
  {
    id: 1,
    name: "Nguyễn Văn Hùng",
    major: "Cựu SV Tin học ứng dụng",
    job: "Lập trình viên Fullstack tại FPT Software",
    comment:
      "Nhờ chương trình đào tạo nhấn mạnh vào 70% thực hành và các thầy cô tận tâm chỉ dạy làm dự án thực tế, mình đã có thể tự tin đi làm tại tập đoàn công nghệ lớn ngay từ khi chưa nhận bằng tốt nghiệp chính quy.",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Lê Thị Mai Chi",
    major: "Cựu SV Tiếng Anh thương mại",
    job: "Chuyên viên Đối ngoại & Khách hàng tại Hotel Nikko",
    comment:
      "Môi trường học tập phản xạ liên tục giúp mình bứt phá kỹ năng giao tiếp ngoại ngữ chuẩn doanh nghiệp. Ngay sau khi ra trường, mình được ban tuyển sinh nhà trường giới thiệu phỏng vấn thẳng, đạt yêu cầu của chuỗi khách sạn 5 sao.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Trần Minh Hoàng",
    major: "Cựu SV Dịch vụ du lịch & Lữ hành",
    job: "Điều hành Tour Cao cấp tại Saigontourist",
    comment:
      "Điểm mình thích nhất là được cọ xát dẫn tour thực tế ngay từ năm thứ nhất. Những chuyến đi thực địa liên tục và kỳ thực tập có lương tại resort đã giúp mình tích lũy kinh nghiệm bằng 2 năm người khác đi làm.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Phạm Thùy Linh",
    major: "Cựu SV Dịch vụ du lịch & Lữ hành",
    job: "Quản lý Nhà hàng tại Vinpearl Resort",
    comment:
      "Kiến thức nghiệp vụ buồng phòng, nhà hàng, khách sạn tại trường cực kỳ sát với thực tế vận hành của doanh nghiệp 5 sao. Bằng cấp chính quy cộng với kỹ năng thực chiến vững vàng là chìa khóa giúp mình thăng tiến rất nhanh.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
  },
];

const CamNhanSection: React.FC = () => {
  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="cam-nhan-sinh-vien"
    >
      {/* Khối background trang trí */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Tiêu đề góc nhìn & Điều hướng Slider */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-md">
              Người thật - Việc thật
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 uppercase tracking-tight mt-3">
              Gương mặt <span className="text-blue-700">Cựu sinh viên</span>{" "}
              thành đạt
            </h2>
            <div className="w-16 h-1 bg-amber-400 mt-3 rounded-full mx-auto md:mx-0"></div>
          </div>

          {/* Cặp nút điều hướng Custom siêu đẹp bằng Tailwind */}
          <div className="flex items-center gap-3">
            <button className="swiper-button-prev-custom w-12 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button className="swiper-button-next-custom w-12 h-12 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khối Swiper Slider */}
        <div className="pb-12">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-custom",
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            className="p-2"
          >
            {cuuSinhVienData.map((item) => (
              <SwiperSlide key={item.id} className="h-full">
                <div className="bg-slate-50/80 hover:bg-white rounded-3xl p-8 md:p-10 relative border border-slate-100 flex flex-col justify-between h-full min-h-[320px] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 group">
                  {/* Icon Quote đóng dấu chìm sang trọng */}
                  <Quote className="absolute top-8 right-8 w-14 h-14 text-blue-900/[0.03] group-hover:text-blue-900/[0.06] transition-colors duration-300 pointer-events-none" />

                  <div>
                    {/* Đánh giá 5 sao vàng chất lượng */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Lời cảm nhận sâu sắc */}
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium italic mb-8 relative z-10 text-justify">
                      "{item.comment}"
                    </p>
                  </div>

                  {/* Thông tin cá nhân nằm ở phần chân thẻ */}
                  <div className="flex items-center gap-4 border-t border-slate-200/60 pt-5 mt-auto">
                    <div className="relative shrink-0">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        loading="lazy"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:border-blue-100 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-950 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-blue-700 font-semibold mt-0.5">
                        {item.major}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {item.job}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Hệ chấm chuyển trang Custom nằm gọn gàng bên dưới */}
        <div className="swiper-pagination-custom flex justify-center gap-2 mt-4" />
      </div>

      {/* Override lại một chút CSS CSS của Swiper Bullets cho đồng bộ tông màu */}
      <style>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 28px;
          background: #1e3a8a;
        }
      `}</style>
    </section>
  );
};

export default CamNhanSection;
