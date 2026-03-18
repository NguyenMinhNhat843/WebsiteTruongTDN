import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const CauHoiThuongGap = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question:
        "Trường có hỗ trợ giới thiệu việc làm sau khi tốt nghiệp không?",
      answer:
        "Có. Với phương châm 'Đào tạo gắn liền với việc làm', nhà trường liên kết chặt chẽ với các doanh nghiệp để sinh viên thực tập và được ưu tiên tuyển dụng ngay sau khi tốt nghiệp.",
    },
    {
      question: "Hồ sơ xét tuyển vào trường bao gồm những gì?",
      answer:
        "Hồ sơ cơ bản bao gồm: Phiếu đăng ký dự tuyển, bản sao bằng tốt nghiệp (hoặc giấy chứng nhận tốt nghiệp tạm thời), bản sao học bạ và các giấy tờ ưu tiên (nếu có).",
    },
    {
      question: "Trung tâm ASIA của trường có chức năng gì?",
      answer:
        "Trung tâm ASIA chuyên về đào tạo ngắn hạn, tư vấn du học, trao đổi sinh viên quốc tế và chuyển giao công nghệ, giúp sinh viên tiếp cận môi trường học tập toàn cầu.",
    },
    {
      question: "Học sinh tốt nghiệp THCS có thể theo học tại trường không?",
      answer:
        "Hoàn toàn được. Trường có các chương trình đào tạo hệ Trung cấp dành riêng cho đối tượng tốt nghiệp THCS, giúp các em rút ngắn thời gian và sớm có nghề nghiệp vững chắc.",
    },
    {
      question: "Trường có đào tạo các kỹ năng mềm và ngoại ngữ không?",
      answer:
        "Ngoài chuyên môn, trường rất chú trọng rèn luyện kỹ năng giao tiếp, tác phong công nghiệp và bồi dưỡng ngoại ngữ để sinh viên thích nghi tốt với mọi môi trường làm việc.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="">
      {/* Tiêu đề Divider tương tự trang Liên Hệ */}
      <div className="flex items-center mb-10">
        <div className="grow h-px bg-slate-200"></div>
        <h2 className="px-6 text-2xl font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2">
          <HelpCircle className="text-blue-600" /> Giải đáp thắc mắc
        </h2>
        <div className="grow h-px bg-slate-200"></div>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-blue-50/50 transition-colors"
            >
              <span
                className={`font-semibold ${openIndex === index ? "text-blue-700" : "text-slate-800"}`}
              >
                {index + 1}. {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {/* Phần nội dung xổ xuống */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center mt-8 text-sm text-slate-500 italic">
        Vẫn còn thắc mắc? Liên hệ ngay với{" "}
        <span className="text-blue-600 font-medium">Phòng Tuyển sinh</span> để
        được hỗ trợ trực tiếp.
      </p>
    </div>
  );
};

export default CauHoiThuongGap;
