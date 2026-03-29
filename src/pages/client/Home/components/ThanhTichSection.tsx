import CountUp from "react-countup";
import { InView } from "react-intersection-observer";
import { Users, GraduationCap, Award, BookOpen } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Users,
    label: "Học sinh",
    value: 1500,
    suffix: "+",
    description: "Đang theo học",
  },
  {
    id: 2,
    icon: GraduationCap,
    label: "Tốt nghiệp",
    value: 99,
    suffix: "%",
    description: "Tỉ lệ đỗ tốt nghiệp",
  },
  {
    id: 3,
    icon: Award,
    label: "Giải thưởng",
    value: 50,
    suffix: "+",
    description: "Thành tích xuất sắc",
  },
  {
    id: 4,
    icon: BookOpen,
    label: "Ngành học",
    value: 12,
    suffix: "",
    description: "Chương trình đào tạo",
  },
];

const ThanhTichSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 relative py-20 bg-white overflow-hidden">
      {/* Subtle blue tint gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/60 via-white to-sky-50/40 pointer-events-none" />

      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 uppercase">
            Những con số ấn tượng của chúng tôi
          </h2>
          <div className="w-24 h-0.5 bg-blue-500 mx-auto mb-6"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group relative flex flex-col items-center text-center
                  bg-white border border-blue-100
                  rounded-2xl px-6 py-8
                  shadow-sm shadow-blue-100/60
                  hover:shadow-md hover:shadow-blue-200/60
                  hover:border-blue-300
                  hover:-translate-y-1
                  transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="mb-5 w-14 h-14 flex items-center justify-center rounded-xl
                  bg-blue-50 border border-blue-100
                  group-hover:bg-blue-600 group-hover:border-blue-600
                  transition-all duration-300"
                >
                  <Icon
                    size={26}
                    className="text-blue-500 group-hover:text-white transition-colors duration-300"
                  />
                </div>

                {/* Counter */}
                <InView triggerOnce={true}>
                  {({ inView, ref }) => (
                    <div
                      ref={ref}
                      className="text-4xl md:text-5xl font-bold text-slate-800 mb-1 tabular-nums"
                    >
                      {inView ? (
                        <CountUp
                          end={stat.value}
                          duration={2.5}
                          separator=","
                        />
                      ) : (
                        0
                      )}
                      <span className="text-blue-500">{stat.suffix}</span>
                    </div>
                  )}
                </InView>

                {/* Label */}
                <p className="text-slate-700 font-semibold text-sm mb-1">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-slate-400 text-xs">{stat.description}</p>

                {/* Bottom accent on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 rounded-full group-hover:w-12 transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThanhTichSection;
