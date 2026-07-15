import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  User,
  GraduationCap,
  Briefcase,
  Settings,
  Key,
  FileText,
  Calendar,
  DollarSign,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Users,
  Layers,
  Settings2,
  Info,
  AlertCircle
} from "lucide-react";
import PageShell from "../../components/ui/PageShell";

// Định nghĩa kiểu dữ liệu cho từng bước trong bài hướng dẫn
interface Step {
  title: string;
  description: string;
}

// Định nghĩa kiểu dữ liệu cho bài hướng dẫn
interface GuideItem {
  id: string;
  title: string;
  category: "overview" | "student" | "teacher" | "admin";
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  steps: Step[];
  tips?: string;
  warning?: string;
}

const HuongDanSuDung = () => {
  const [activeTab, setActiveTab] = useState<"all" | "overview" | "student" | "teacher" | "admin">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Danh sách các bài hướng dẫn chi tiết
  const guides: GuideItem[] = useMemo(() => [
    // --- TỔNG QUAN ---
    {
      id: "dang-nhap-bao-mat",
      title: "Đăng nhập và bảo mật tài khoản",
      category: "overview",
      description: "Hướng dẫn đăng nhập hệ thống lần đầu và các biện pháp bảo mật tài khoản cá nhân.",
      icon: Key,
      steps: [
        {
          title: "Truy cập đường dẫn đăng nhập",
          description: "Mở trình duyệt và truy cập hệ thống. Chọn vai trò phù hợp (Quản trị viên / Cán bộ giáo viên / Học sinh)."
        },
        {
          title: "Nhập thông tin tài khoản",
          description: "Sử dụng Mã đăng nhập (Mã số học sinh/Mã nhân viên) và mật khẩu mặc định được nhà trường cung cấp."
        },
        {
          title: "Đổi mật khẩu & cập nhật thông tin",
          description: "Trong lần đăng nhập đầu tiên, hệ thống sẽ yêu cầu bạn đổi mật khẩu mới để đảm bảo tính an toàn. Hãy đặt mật khẩu mạnh có cả chữ hoa, chữ thường, số và ký tự đặc biệt."
        }
      ],
      tips: "Không nên chia sẻ mật khẩu cho bất kỳ ai. Nếu nghi ngờ tài khoản bị lộ, hãy sử dụng tính năng đổi mật khẩu ngay lập tức hoặc liên hệ Quản trị viên hệ thống để hỗ trợ.",
    },
    {
      id: "giao-dien-chung",
      title: "Làm quen với giao diện Dashboard",
      category: "overview",
      description: "Tổng quan các khu vực làm việc chính, thanh menu điều hướng và thanh thông báo.",
      icon: Layers,
      steps: [
        {
          title: "Thanh điều hướng bên trái (Sidebar)",
          description: "Chứa danh sách các menu chức năng tương ứng với quyền hạn của bạn. Có thể thu gọn để mở rộng không gian làm việc."
        },
        {
          title: "Thanh tiêu đề phía trên (Header)",
          description: "Hiển thị thông tin tài khoản đang đăng nhập, ngôn ngữ, nút đăng xuất và các thông báo mới nhất từ nhà trường."
        },
        {
          title: "Khu vực hiển thị nội dung chính",
          description: "Nơi hiển thị chi tiết các bảng biểu, biểu đồ dữ liệu và các biểu mẫu nhập thông tin tương tác."
        }
      ],
    },

    // --- HỌC SINH ---
    {
      id: "hs-xem-tkb",
      title: "Xem Thời khóa biểu học tập",
      category: "student",
      description: "Cách kiểm tra lịch học, môn học, giáo viên giảng dạy và phòng học hàng tuần của học sinh.",
      icon: Calendar,
      steps: [
        {
          title: "Truy cập menu Thời khóa biểu",
          description: "Đăng nhập với tài khoản học sinh, chọn 'Học tập' > 'Thời khóa biểu' trên thanh sidebar."
        },
        {
          title: "Lọc theo tuần học",
          description: "Sử dụng bộ chọn tuần để xem lịch học của các tuần tiếp theo hoặc tuần trước đó."
        },
        {
          title: "Xem chi tiết buổi học",
          description: "Nhấp vào ô môn học cụ thể trên lịch biểu để xem phòng học (ví dụ: Phòng 201-A), tên giáo viên giảng dạy và thời gian bắt đầu/kết thúc."
        }
      ],
      tips: "Lịch học trực tuyến (nếu có) sẽ hiển thị kèm liên kết phòng học trực tuyến ngay trên chi tiết môn học."
    },
    {
      id: "hs-xem-diem",
      title: "Xem bảng điểm và kết quả học tập",
      category: "student",
      description: "Xem điểm các môn học theo từng học kỳ, năm học và theo dõi tiến trình học tập cá nhân.",
      icon: Award,
      steps: [
        {
          title: "Chọn menu Điểm số",
          description: "Di chuyển đến mục 'Học tập' > 'Điểm số' trong trang cá nhân của học sinh."
        },
        {
          title: "Chọn Học kỳ & Năm học",
          description: "Sử dụng bộ lọc ở đầu trang để lựa chọn Học kỳ (Kỳ I, Kỳ II) và Năm học bạn muốn tra cứu."
        },
        {
          title: "Theo dõi chi tiết các đầu điểm",
          description: "Bảng điểm hiển thị rõ ràng: Điểm chuyên cần, Điểm kiểm tra thường xuyên (miệng, 15 phút), Điểm giữa kỳ và Điểm cuối kỳ kèm theo Điểm trung bình môn học."
        }
      ],
    },
    {
      id: "hs-cham-drl",
      title: "Tự đánh giá Điểm rèn luyện",
      category: "student",
      description: "Hướng dẫn học sinh thực hiện tự chấm điểm rèn luyện định kỳ vào cuối mỗi học kỳ.",
      icon: FileText,
      steps: [
        {
          title: "Vào mục Điểm rèn luyện",
          description: "Chọn mục 'Học tập' > 'Điểm rèn luyện' trên thanh điều hướng."
        },
        {
          title: "Mở phiếu đánh giá",
          description: "Nhấp nút 'Tự đánh giá' tại đợt chấm điểm rèn luyện đang mở."
        },
        {
          title: "Nhập điểm tự chấm cho từng tiêu chí",
          description: "Đọc kỹ mô tả từng tiêu chí (ý thức học tập, chấp hành nề nếp, hoạt động phong trào...) và điền số điểm tự chấm (không vượt quá điểm tối đa của tiêu chí đó)."
        },
        {
          title: "Lưu và gửi phiếu",
          description: "Kiểm tra lại tổng điểm tự chấm, tải lên minh chứng (nếu có yêu cầu) và nhấp 'Gửi đánh giá'."
        }
      ],
      warning: "Học sinh cần hoàn thành tự chấm điểm rèn luyện đúng thời hạn quy định. Sau khi hết hạn, hệ thống sẽ tự động khóa và bạn không thể tự chấm được nữa.",
    },
    {
      id: "hs-xem-hoc-phi",
      title: "Tra cứu học phí và lịch sử đóng tiền",
      category: "student",
      description: "Kiểm tra dư nợ học phí hiện tại, xem thông tin các đợt học phí và xem hóa đơn điện tử.",
      icon: DollarSign,
      steps: [
        {
          title: "Vào mục Học phí",
          description: "Chọn 'Tài chính' > 'Học phí' từ tài khoản học sinh."
        },
        {
          title: "Xem thông tin đợt học phí",
          description: "Giao diện sẽ liệt kê các khoản phải nộp, số tiền đã đóng, số tiền còn thiếu (nợ học phí) và thời hạn nộp tiền."
        },
        {
          title: "Lấy thông tin chuyển khoản",
          description: "Hệ thống cung cấp Mã QR thanh toán động và thông tin tài khoản ngân hàng của nhà trường cùng cú pháp chuyển khoản chính xác để tự động gạch nợ."
        }
      ],
    },

    // --- GIÁO VIÊN ---
    {
      id: "gv-xem-lich-day",
      title: "Xem lịch giảng dạy và báo giảng",
      category: "teacher",
      description: "Xem lịch dạy chi tiết theo tuần, quản lý lớp được phân công giảng dạy.",
      icon: Calendar,
      steps: [
        {
          title: "Vào trang Thời khóa biểu giáo viên",
          description: "Đăng nhập tài khoản giáo viên, chọn 'Lịch dạy' hoặc 'Thời khóa biểu giảng dạy'."
        },
        {
          title: "Xem danh sách lớp phụ trách",
          description: "Hệ thống hiển thị thời gian, phòng học, lớp niên chế và số lượng học sinh của buổi dạy."
        }
      ],
    },
    {
      id: "gv-nhap-diem",
      title: "Quản lý lớp học & Nhập điểm môn học",
      category: "teacher",
      description: "Quy trình nhập điểm thành phần, điểm thi học kỳ cho các lớp học phần/lớp bộ môn được phân công.",
      icon: Award,
      steps: [
        {
          title: "Chọn Lớp học phần cần nhập điểm",
          description: "Chọn mục 'Quản lý đào tạo' > 'Lớp học' > Chọn lớp bộ môn tương ứng trong danh sách."
        },
        {
          title: "Mở bảng điểm lớp học",
          description: "Nhấp vào tab 'Bảng điểm' hoặc nút 'Nhập điểm'."
        },
        {
          title: "Nhập điểm cho học sinh",
          description: "Nhập trực tiếp điểm số vào các cột điểm thành phần. Hệ thống hỗ trợ phím Enter để xuống dòng nhanh chóng."
        },
        {
          title: "Lưu và phê duyệt",
          description: "Nhấp 'Lưu nháp' để lưu trữ tạm thời, hoặc nhấp 'Khóa & Gửi phê duyệt' để hoàn thành việc nhập điểm và đồng bộ lên học bạ điện tử."
        }
      ],
      warning: "Sau khi bảng điểm đã được khóa và gửi lên hệ thống, giáo viên sẽ không thể tự chỉnh sửa. Mọi thay đổi điểm số sau đó cần gửi yêu cầu phê duyệt sửa điểm lên Ban giám hiệu.",
    },
    {
      id: "gv-cham-drl",
      title: "Đánh giá Điểm rèn luyện cho học sinh",
      category: "teacher",
      description: "Quy trình Giáo viên chủ nhiệm phê duyệt và chấm điểm rèn luyện cho học sinh lớp chủ nhiệm.",
      icon: FileText,
      steps: [
        {
          title: "Vào mục Quản lý điểm rèn luyện lớp chủ nhiệm",
          description: "Truy cập mục 'Điểm rèn luyện' > Chọn lớp chủ nhiệm của bạn."
        },
        {
          title: "Duyệt phiếu tự chấm của học sinh",
          description: "Nhấp vào từng học sinh để xem bảng điểm tự chấm và minh chứng đi kèm."
        },
        {
          title: "Cho điểm đánh giá của Giáo viên chủ nhiệm",
          description: "Đồng ý với điểm tự chấm hoặc điều chỉnh điểm số dựa trên quá trình theo dõi nề nếp của học sinh tại trường. Nhập nhận xét cụ thể."
        },
        {
          title: "Tổng hợp và gửi Hội đồng",
          description: "Nhấp 'Gửi lên hội đồng trường' để hoàn thành quy trình chấm điểm rèn luyện của lớp."
        }
      ],
    },

    // --- ADMIN & STAFF ---
    {
      id: "admin-quan-ly-dao-tao",
      title: "Cấu hình Chương trình khung & Môn học",
      category: "admin",
      description: "Quản lý cơ sở dữ liệu đào tạo gồm Khung chương trình học, môn học và phân chia học kỳ.",
      icon: Settings2,
      steps: [
        {
          title: "Tạo môn học mới",
          description: "Vào mục 'Quản lý đào tạo' > 'Môn học' > Chọn 'Thêm môn học'. Điền mã môn, tên môn, số tín chỉ/tiết học và loại môn (bắt buộc/tự chọn)."
        },
        {
          title: "Cấu hình Chương trình khung",
          description: "Vào mục 'Chương trình khung' > Thiết lập danh sách các môn học bắt buộc cho từng khóa đào tạo và từng ngành học cụ thể."
        }
      ],
    },
    {
      id: "admin-ho-so-hoc-sinh",
      title: "Quản lý hồ sơ Học sinh & Phân lớp",
      category: "admin",
      description: "Tiếp nhận hồ sơ tuyển sinh mới, cập nhật thông tin lý lịch học sinh và xếp lớp niên chế.",
      icon: Users,
      steps: [
        {
          title: "Thêm hồ sơ học sinh mới",
          description: "Truy cập 'Công tác học sinh' > 'Hồ sơ học sinh' > 'Tạo hồ sơ'. Điền thông tin cá nhân, liên hệ, phụ huynh và kết quả tuyển sinh hoặc import từ file Excel."
        },
        {
          title: "Quy trình Phân lớp (Xếp lớp)",
          description: "Vào mục 'Phân lớp học sinh'. Chọn Khóa đào tạo và Ngành học. Chọn danh sách học sinh chưa có lớp và xếp vào lớp niên chế tương ứng."
        }
      ],
      tips: "Khi import dữ liệu học sinh từ Excel, hãy tải file mẫu chuẩn từ hệ thống để tránh lỗi định dạng ngày sinh hoặc số điện thoại.",
    },
    {
      id: "admin-quan-ly-bai-viet",
      title: "Đăng tải bài viết & Tin tức truyền thông",
      category: "admin",
      description: "Quản lý nội dung trang chủ, tin tức tuyển sinh, thông báo của nhà trường.",
      icon: FileText,
      steps: [
        {
          title: "Tạo bài viết mới",
          description: "Truy cập 'Truyền thông' > 'Tạo bài viết'. Thiết lập tiêu đề, tóm tắt, chuyên mục (Tin tức / Tuyển dụng / Đào tạo) và tải lên ảnh đại diện."
        },
        {
          title: "Soạn thảo nội dung phong phú",
          description: "Sử dụng trình soạn thảo trực quan để viết bài, định dạng chữ, chèn hình ảnh, tạo bảng và liên kết video."
        },
        {
          title: "Xem trước và xuất bản",
          description: "Nhấp 'Xem trước' để kiểm tra hiển thị thực tế trên website. Chọn 'Xuất bản' để bài viết hiển thị công khai trên trang chủ nhà trường."
        }
      ],
    },
    {
      id: "admin-quan-ly-hoc-phi",
      title: "Cấu hình Đợt học phí & Quản lý thu chi",
      category: "admin",
      description: "Tạo lập các đợt thu học phí, áp dụng định mức học phí cho học sinh và theo dõi tiến độ thu tiền.",
      icon: DollarSign,
      steps: [
        {
          title: "Tạo Đợt học phí mới",
          description: "Vào mục 'Học phí' > 'Đợt học phí' > Chọn 'Tạo đợt học phí'. Nhập tên đợt (ví dụ: Học phí học kỳ I năm học 2026-2027), thời hạn thanh toán."
        },
        {
          title: "Áp dụng định mức học phí",
          description: "Thiết lập số tiền học phí cụ thể cho từng ngành học hoặc từng lớp học. Hệ thống sẽ tự động tính toán tổng số tiền cần nộp cho mỗi học sinh."
        },
        {
          title: "Đối soát và ghi nhận thanh toán",
          description: "Theo dõi danh sách học sinh đã đóng phí trực tuyến hoặc ghi nhận giao dịch trực tiếp bằng biên lai nộp tiền mặt."
        }
      ],
    },
    {
      id: "admin-cai-dat-he-thong",
      title: "Quản lý tài khoản & Cấu hình hệ thống",
      category: "admin",
      description: "Cấp phát tài khoản người dùng, thiết lập thông tin cơ bản của nhà trường.",
      icon: Settings,
      steps: [
        {
          title: "Quản lý tài khoản (Account management)",
          description: "Vào mục 'Quản trị nhân sự' > 'Quản lý tài khoản'. Tại đây có thể tạo tài khoản mới cho cán bộ, giáo viên, đặt lại mật khẩu cho học sinh hoặc khóa tài khoản vi phạm."
        },
        {
          title: "Cài đặt tham số hệ thống chung",
          description: "Vào 'Cài đặt hệ thống' > 'Cấu hình chung' để thiết lập tên trường, địa chỉ, số hotline, email chính thức và logo hiển thị trên website."
        }
      ],
    }
  ], []);

  // Hàm xử lý toggle mở rộng/thu gọn accordion
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Lọc danh sách hướng dẫn theo tab hiện tại và từ khóa tìm kiếm
  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      // Lọc theo tab
      const matchesTab = activeTab === "all" || guide.category === activeTab;
      
      // Lọc theo từ khóa tìm kiếm
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        guide.title.toLowerCase().includes(searchLower) ||
        guide.description.toLowerCase().includes(searchLower) ||
        guide.steps.some(step => 
          step.title.toLowerCase().includes(searchLower) || 
          step.description.toLowerCase().includes(searchLower)
        ) ||
        (guide.tips && guide.tips.toLowerCase().includes(searchLower)) ||
        (guide.warning && guide.warning.toLowerCase().includes(searchLower));

      return matchesTab && matchesSearch;
    });
  }, [guides, activeTab, searchQuery]);

  // Danh mục tab vai trò phục vụ bộ lọc
  const roleTabs = [
    { value: "all", label: "Tất cả vai trò", icon: <BookOpen size={16} /> },
    { value: "overview", label: "Tổng quan chung", icon: <Layers size={16} /> },
    { value: "student", label: "Học sinh / Sinh viên", icon: <GraduationCap size={16} /> },
    { value: "teacher", label: "Giáo viên / Giảng viên", icon: <Briefcase size={16} /> },
    { value: "admin", label: "Quản trị viên / Cán bộ", icon: <Settings size={16} /> },
  ] as const;

  return (
    <PageShell
      title="Hướng Dẫn Sử Dụng Hệ Thống"
      sub="Tài liệu hướng dẫn thao tác, quy trình nghiệp vụ cho các thành viên sử dụng website nhà trường."
      icon={BookOpen}
    >
      <div className="space-y-6">
        {/* Hộp tìm kiếm và thông tin hỗ trợ nhanh */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ô Tìm kiếm chính */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
                Bạn cần tìm hướng dẫn gì?
              </h2>
              <p className="text-xs text-slate-500">
                Nhập tên chức năng, vai trò hoặc từ khóa (ví dụ: "điểm", "học phí", "đăng nhập") để lọc nhanh tài liệu.
              </p>
            </div>
            
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm chức năng hoặc tác vụ cần thực hiện..."
                className="block w-full pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Hotline / Thông tin liên hệ nhanh */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-bold tracking-wide uppercase text-blue-100">Liên hệ kỹ thuật</span>
              </div>
              <p className="text-xs text-blue-50/90 leading-relaxed">
                Nếu gặp lỗi hệ thống, quên mật khẩu hoặc cần nâng quyền truy cập, vui lòng liên hệ phòng Công nghệ thông tin.
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
              <div>
                <p className="font-semibold text-white">Hotline kỹ thuật:</p>
                <p className="font-mono text-sm mt-0.5">024.1234.5678 (Nhánh 1)</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">Email hỗ trợ:</p>
                <p className="font-mono mt-0.5">support@school.edu.vn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh lọc tab theo vai trò */}
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap gap-1.5">
          {roleTabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Kết quả đếm số lượng tài liệu */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <p>
            Hiển thị <span className="font-bold text-slate-700">{filteredGuides.length}</span> tài liệu hướng dẫn
            {searchQuery && <> cho từ khóa "<span className="text-blue-600 font-semibold">{searchQuery}</span>"</>}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="text-blue-600 hover:underline"
            >
              Reset bộ lọc
            </button>
          )}
        </div>

        {/* Danh sách các tài liệu hướng dẫn (Accordion List) */}
        {filteredGuides.length > 0 ? (
          <div className="space-y-4">
            {filteredGuides.map((guide) => {
              const IconComponent = guide.icon;
              const isExpanded = !!expandedIds[guide.id];

              return (
                <div
                  key={guide.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-blue-300 shadow-md shadow-blue-50/50"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {/* Tiêu đề Accordion */}
                  <button
                    onClick={() => toggleExpand(guide.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isExpanded ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <IconComponent size={20} />
                      </div>
                      
                      {/* Tiêu đề & Mô tả ngắn */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {guide.title}
                          </h3>
                          {/* Badge tag vai trò */}
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide shrink-0 ${
                              guide.category === "overview"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : guide.category === "student"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : guide.category === "teacher"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {guide.category === "overview"
                              ? "Tổng quan"
                              : guide.category === "student"
                              ? "Học sinh"
                              : guide.category === "teacher"
                              ? "Giáo viên"
                              : "Admin & Staff"}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                          {guide.description}
                        </p>
                      </div>
                    </div>

                    {/* Nút Toggle mở rộng */}
                    <div className="text-slate-400 shrink-0 self-center">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {/* Nội dung chi tiết các bước */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-5 animate-in slide-in-from-top duration-200">
                      
                      {/* Tiêu đề vùng nội dung */}
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Các bước thực hiện chi tiết:
                      </h4>

                      {/* Các bước (Step list) */}
                      <div className="relative border-l border-blue-100 ml-4 pl-6 space-y-6">
                        {guide.steps.map((step, index) => (
                          <div key={index} className="relative">
                            {/* Chấm tròn số bước */}
                            <div className="absolute -left-[37px] top-0.5 bg-blue-600 text-white text-[10px] font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center border-4 border-white shadow-sm ring-1 ring-blue-100">
                              {index + 1}
                            </div>
                            
                            <div className="space-y-1">
                              <h5 className="text-sm font-bold text-slate-800">
                                {step.title}
                              </h5>
                              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mẹo hữu ích (Tip box nếu có) */}
                      {guide.tips && (
                        <div className="flex gap-3 bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-xs text-blue-800">
                          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold">Mẹo hữu ích:</span>
                            <p className="leading-relaxed">{guide.tips}</p>
                          </div>
                        </div>
                      )}

                      {/* Lưu ý quan trọng (Warning box nếu có) */}
                      {guide.warning && (
                        <div className="flex gap-3 bg-rose-50/70 border border-rose-100 p-4 rounded-xl text-xs text-rose-800">
                          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold">Lưu ý quan trọng:</span>
                            <p className="leading-relaxed">{guide.warning}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State khi không tìm thấy kết quả */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="bg-slate-100 text-slate-400 p-4 rounded-full">
              <Search size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Không tìm thấy hướng dẫn nào phù hợp
            </h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md">
              Không tìm thấy kết quả cho từ khóa "<span className="font-semibold text-slate-700">{searchQuery}</span>" ở bộ lọc vai trò hiện tại. Vui lòng thử từ khóa khác hoặc chuyển sang "Tất cả vai trò".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Hiển thị tất cả tài liệu
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default HuongDanSuDung;
