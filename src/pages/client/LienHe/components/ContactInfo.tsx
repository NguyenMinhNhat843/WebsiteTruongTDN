import { BookOpen, GraduationCap, Headset, Mail, Phone } from "lucide-react";

const ContactInfo = () => {
  const departments = [
    {
      name: "Phòng Tuyển sinh",
      description: "Hỗ trợ tư vấn chọn ngành, nộp hồ sơ và thủ tục nhập học.",
      phone: "081.439.3535  -  0379.112.491 (Ms.Đỗ Thị Ngọc An)",
      email: "tuyensinh@trandainghiant.edu.vn",
      icon: <GraduationCap className="w-6 h-6 text-school-blue-600" />,
      color: "bg-blue-50",
    },
    {
      name: "Phòng Đào tạo",
      description:
        "Quản lý kế hoạch giảng dạy, thời khóa biểu và kết quả học tập.", // Cập nhật mô tả cho đúng chuyên môn
      phone: "(0258) 224 1999 - 0988.904.906 (Nguyễn Thị Thảo)",
      email: "daotao@trandainghiant.edu.vn",
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      name: "Phòng Hành chính - Nhân sự",
      description: "Giải đáp các vấn đề về thủ tục hành chính và nhân sự.",
      phone: "(0258) 222 0999  -  0962.848.951 (Ms.Nguyễn Thị Phương Loan)",
      email: "tuyensinh@trandainghiant.edu.vn",
      icon: <Headset className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
      {/* Header cho phần liên hệ */}
      <div>
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          Thông tin <span className="text-blue-600">liên hệ</span>
        </h2>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          Đội ngũ cán bộ của nhà trường luôn sẵn sàng giải đáp mọi thắc mắc của
          bạn qua các kênh trực tiếp.
        </p>
      </div>

      {/* Cards các phòng ban */}
      <div className="grid gap-6">
        {departments.map((dept, index) => (
          <div
            key={index}
            className="group p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
          >
            <div className="flex gap-5">
              <div
                className={`shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl ${dept.color} transition-transform group-hover:scale-110`}
              >
                {dept.icon}
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-xl">
                    {dept.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {dept.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
                  <a
                    href={`tel:${dept.phone}`}
                    className="flex items-center gap-2 text-school-blue-600 font-bold hover:underline"
                  >
                    <Phone size={16} />
                    {dept.phone}
                  </a>
                  <a
                    href={`mailto:${dept.email}`}
                    className="flex items-center gap-2 text-slate-600 text-sm hover:text-school-blue-600 transition-colors"
                  >
                    <Mail size={16} />
                    {dept.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
