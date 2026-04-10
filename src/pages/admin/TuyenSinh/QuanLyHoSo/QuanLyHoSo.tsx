import { useState } from "react";
import {
  FileCheck,
  Search,
  Filter,
  User,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  Upload,
  Phone,
  Mail,
  MapPin,
  Award,
  AlertCircle,
  Download,
} from "lucide-react";

interface Application {
  id: string;
  applicantName: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  idCard: string;
  batch: string;
  batchLabel: string;
  system: string;
  major: string;
  graduationYear: string;
  previousSchool: string;
  gpa: number;
  status: "submitted" | "reviewing" | "approved" | "rejected";
  submitDate: string;
  reviewDate?: string;
  reviewer?: string;
  documents: {
    name: string;
    uploaded: boolean;
  }[];
  notes?: string;
}

// Dữ liệu mẫu
const applicationsData: Application[] = [
  {
    id: "HS001",
    applicantName: "Nguyễn Văn An",
    birthDate: "2005-05-15",
    gender: "Nam",
    phone: "0901234567",
    email: "nguyenvanan@email.com",
    address: "Quận 1, TP.HCM",
    idCard: "079205012345",
    batch: "dot1_2026",
    batchLabel: "Đợt 1 - Năm 2026",
    system: "Trung cấp nghề",
    major: "Công nghệ kỹ thuật ô tô",
    graduationYear: "2023",
    previousSchool: "THPT Lê Quý Đôn",
    gpa: 7.8,
    status: "approved",
    submitDate: "2026-03-10",
    reviewDate: "2026-03-15",
    reviewer: "Trần Văn B",
    documents: [
      { name: "Bằng tốt nghiệp THPT", uploaded: true },
      { name: "Học bạ THPT", uploaded: true },
      { name: "Giấy khai sinh", uploaded: true },
      { name: "CMND/CCCD", uploaded: true },
      { name: "Ảnh 3x4", uploaded: true },
    ],
    notes: "Hồ sơ đầy đủ, đạt yêu cầu",
  },
  {
    id: "HS002",
    applicantName: "Trần Thị Bình",
    birthDate: "2008-08-20",
    gender: "Nữ",
    phone: "0902345678",
    email: "tranthib@email.com",
    address: "Quận 3, TP.HCM",
    idCard: "079208012346",
    batch: "dot1_2026",
    batchLabel: "Đợt 1 - Năm 2026",
    system: "Sơ cấp nghề",
    major: "May công nghiệp",
    graduationYear: "2024",
    previousSchool: "THCS Nguyễn Du",
    gpa: 7.0,
    status: "reviewing",
    submitDate: "2026-04-05",
    documents: [
      { name: "Bằng tốt nghiệp THCS", uploaded: true },
      { name: "Học bạ THCS", uploaded: true },
      { name: "Giấy khai sinh", uploaded: true },
      { name: "CMND/CCCD", uploaded: false },
      { name: "Ảnh 3x4", uploaded: true },
    ],
  },
  {
    id: "HS003",
    applicantName: "Lê Văn Cường",
    birthDate: "2005-12-10",
    gender: "Nam",
    phone: "0903456789",
    email: "levanc@email.com",
    address: "Quận 5, TP.HCM",
    idCard: "079205012347",
    batch: "dot2_2026",
    batchLabel: "Đợt 2 - Năm 2026",
    system: "Đại học liên kết",
    major: "Quản trị kinh doanh",
    graduationYear: "2023",
    previousSchool: "THPT Trần Hưng Đạo",
    gpa: 8.5,
    status: "submitted",
    submitDate: "2026-04-08",
    documents: [
      { name: "Bằng tốt nghiệp THPT", uploaded: true },
      { name: "Học bạ THPT", uploaded: true },
      { name: "Giấy chứng nhận ưu tiên", uploaded: true },
      { name: "Giấy khai sinh", uploaded: true },
      { name: "CMND/CCCD", uploaded: true },
      { name: "Ảnh 3x4", uploaded: true },
    ],
  },
  {
    id: "HS004",
    applicantName: "Phạm Thị Dung",
    birthDate: "2008-03-25",
    gender: "Nữ",
    phone: "0904567890",
    email: "phamthid@email.com",
    address: "Quận 7, TP.HCM",
    idCard: "079208012348",
    batch: "dot1_2026",
    batchLabel: "Đợt 1 - Năm 2026",
    system: "Hệ 9+",
    major: "Điện tử công nghiệp",
    graduationYear: "2024",
    previousSchool: "THCS Lê Lợi",
    gpa: 8.0,
    status: "approved",
    submitDate: "2026-03-20",
    reviewDate: "2026-03-25",
    reviewer: "Trần Văn B",
    documents: [
      { name: "Bằng tốt nghiệp THCS", uploaded: true },
      { name: "Học bạ THCS", uploaded: true },
      { name: "Giấy khai sinh", uploaded: true },
      { name: "CMND/CCCD", uploaded: true },
      { name: "Ảnh 3x4", uploaded: true },
    ],
    notes: "Học sinh giỏi, điểm cao",
  },
  {
    id: "HS005",
    applicantName: "Hoàng Văn Em",
    birthDate: "2005-07-18",
    gender: "Nam",
    phone: "0905678901",
    email: "hoangvane@email.com",
    address: "Quận 10, TP.HCM",
    idCard: "079205012349",
    batch: "dot1_2026",
    batchLabel: "Đợt 1 - Năm 2026",
    system: "Trung cấp nghề",
    major: "Kỹ thuật hàn",
    graduationYear: "2023",
    previousSchool: "THPT Nguyễn Thị Minh Khai",
    gpa: 6.5,
    status: "rejected",
    submitDate: "2026-03-12",
    reviewDate: "2026-03-18",
    reviewer: "Trần Văn B",
    documents: [
      { name: "Bằng tốt nghiệp THPT", uploaded: true },
      { name: "Học bạ THPT", uploaded: false },
      { name: "Giấy khai sinh", uploaded: true },
      { name: "CMND/CCCD", uploaded: true },
      { name: "Ảnh 3x4", uploaded: false },
    ],
    notes: "Hồ sơ thiếu học bạ và ảnh, không đạt",
  },
  {
    id: "HS006",
    applicantName: "Võ Thị Phương",
    birthDate: "2006-11-30",
    gender: "Nữ",
    phone: "0906789012",
    email: "vothip@email.com",
    address: "Quận 6, TP.HCM",
    idCard: "079206012350",
    batch: "dot2_2026",
    batchLabel: "Đợt 2 - Năm 2026",
    system: "Sơ cấp nghề",
    major: "Nấu ăn",
    graduationYear: "2024",
    previousSchool: "THCS Võ Thị Sáu",
    gpa: 7.5,
    status: "submitted",
    submitDate: "2026-04-09",
    documents: [
      { name: "Bằng tốt nghiệp THCS", uploaded: true },
      { name: "Học bạ THCS", uploaded: true },
      { name: "Giấy khai sinh", uploaded: true },
      { name: "CMND/CCCD", uploaded: true },
      { name: "Ảnh 3x4", uploaded: true },
    ],
  },
];

const admissionBatches = [
  { value: "all", label: "Tất cả đợt tuyển sinh" },
  { value: "dot1_2026", label: "Đợt 1 - Năm 2026 (15/03 - 30/04)" },
  { value: "dot2_2026", label: "Đợt 2 - Năm 2026 (01/05 - 30/06)" },
  { value: "dot3_2026", label: "Đợt 3 - Năm 2026 (01/07 - 31/08)" },
];

const majors = {
  "Trung cấp nghề": [
    "Công nghệ kỹ thuật ô tô",
    "Kỹ thuật hàn",
    "Điện công nghiệp",
    "Cơ khí chế tạo",
    "Kỹ thuật xây dựng",
  ],
  "Sơ cấp nghề": [
    "May công nghiệp",
    "Nấu ăn",
    "Điện dân dụng",
    "Sửa chữa điện tử",
    "Làm vườn",
  ],
  "Đại học liên kết": [
    "Quản trị kinh doanh",
    "Kế toán",
    "Công nghệ thông tin",
    "Marketing",
  ],
  "Hệ 9+": ["Điện tử công nghiệp", "Cơ khí ô tô", "Tin học ứng dụng"],
};

function AdmissionApplication() {
  const [applications] = useState<Application[]>(applicationsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterSystem, setFilterSystem] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "Nam",
    phone: "",
    email: "",
    address: "",
    idCard: "",
    batch: "dot1_2026",
    system: "Trung cấp nghề",
    major: "",
    previousSchool: "",
    graduationYear: "",
    gpa: "",
  });

  // Tính toán thống kê
  const stats = {
    totalApplications: applications.length,
    submittedCount: applications.filter((a) => a.status === "submitted").length,
    reviewingCount: applications.filter((a) => a.status === "reviewing").length,
    approvedCount: applications.filter((a) => a.status === "approved").length,
    rejectedCount: applications.filter((a) => a.status === "rejected").length,
  };

  // Thống kê theo đợt
  const batchStats = admissionBatches.slice(1).map((batch) => {
    const items = applications.filter((a) => a.batch === batch.value);
    return {
      batch: batch.label.split("(")[0].trim(),
      total: items.length,
      approved: items.filter((a) => a.status === "approved").length,
      pending: items.filter(
        (a) => a.status === "submitted" || a.status === "reviewing",
      ).length,
    };
  });

  // Thống kê theo hệ
  const systemStats = [
    "Trung cấp nghề",
    "Sơ cấp nghề",
    "Đại học liên kết",
    "Hệ 9+",
  ].map((system) => {
    const items = applications.filter((a) => a.system === system);
    return {
      system,
      count: items.length,
      approved: items.filter((a) => a.status === "approved").length,
    };
  });

  // Lọc danh sách
  const filteredApplications = applications.filter((application) => {
    const matchSearch =
      application.applicantName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      application.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.phone.includes(searchQuery);

    const matchBatch =
      filterBatch === "all" || application.batch === filterBatch;
    const matchSystem =
      filterSystem === "all" || application.system === filterSystem;
    const matchStatus =
      filterStatus === "all" || application.status === filterStatus;

    return matchSearch && matchBatch && matchSystem && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      submitted: {
        label: "Đã nộp",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: FileCheck,
      },
      reviewing: {
        label: "Đang xét",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
      },
      approved: {
        label: "Đạt",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      rejected: {
        label: "Không đạt",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: XCircle,
      },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const getSystemColor = (system: string) => {
    const colors: Record<string, string> = {
      "Trung cấp nghề": "text-blue-600",
      "Sơ cấp nghề": "text-green-600",
      "Đại học liên kết": "text-purple-600",
      "Hệ 9+": "text-orange-600",
    };
    return colors[system] || "text-gray-600";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã tiếp nhận hồ sơ: ${formData.name}`);
    setShowRegisterModal(false);
    // Reset form
    setFormData({
      name: "",
      birthDate: "",
      gender: "Nam",
      phone: "",
      email: "",
      address: "",
      idCard: "",
      batch: "dot1_2026",
      system: "Trung cấp nghề",
      major: "",
      previousSchool: "",
      graduationYear: "",
      gpa: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tiếp Nhận Hồ Sơ Tuyển Sinh
                </h1>
                <p className="text-gray-600">
                  Quản lý hồ sơ đăng ký tuyển sinh các đợt
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Tiếp nhận hồ sơ mới
            </button>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </div>
                <div className="text-xs text-gray-500">hồ sơ</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">Tổng hồ sơ</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.submittedCount}</div>
                <div className="text-xs text-blue-100">hồ sơ</div>
              </div>
            </div>
            <div className="text-sm font-medium">Đã nộp</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.reviewingCount}</div>
                <div className="text-xs text-yellow-100">hồ sơ</div>
              </div>
            </div>
            <div className="text-sm font-medium">Đang xét</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.approvedCount}</div>
                <div className="text-xs text-green-100">hồ sơ</div>
              </div>
            </div>
            <div className="text-sm font-medium">Đạt</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.rejectedCount}
                </div>
                <div className="text-xs text-gray-500">hồ sơ</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">Không đạt</div>
          </div>
        </div>

        {/* Thống kê theo đợt và hệ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Thống kê theo đợt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Thống kê theo đợt tuyển sinh
            </h3>
            <div className="space-y-3">
              {batchStats.map((stat, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {stat.batch}
                    </span>
                    <span className="text-lg font-bold text-cyan-600">
                      {stat.total} HS
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-600">
                      ✓ {stat.approved} đạt
                    </span>
                    <span className="text-yellow-600">
                      ⏱ {stat.pending} chờ xét
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thống kê theo hệ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              Thống kê theo hệ đào tạo
            </h3>
            <div className="space-y-3">
              {systemStats.map((stat, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${getSystemColor(stat.system)}`}
                    >
                      {stat.system}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {stat.count} HS
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${stat.count > 0 ? (stat.approved / stat.count) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {stat.approved} đã đạt
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Bộ lọc:</span>
            </div>

            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {admissionBatches.map((batch) => (
                <option key={batch.value} value={batch.value}>
                  {batch.label}
                </option>
              ))}
            </select>

            <select
              value={filterSystem}
              onChange={(e) => setFilterSystem(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tất cả hệ đào tạo</option>
              <option value="Trung cấp nghề">Trung cấp nghề</option>
              <option value="Sơ cấp nghề">Sơ cấp nghề</option>
              <option value="Đại học liên kết">Đại học liên kết</option>
              <option value="Hệ 9+">Hệ 9+</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="submitted">Đã nộp</option>
              <option value="reviewing">Đang xét</option>
              <option value="approved">Đạt</option>
              <option value="rejected">Không đạt</option>
            </select>

            <div className="ml-auto flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã HS, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none text-sm bg-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Bảng danh sách hồ sơ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Mã HS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Họ và tên
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Giới tính
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    SĐT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Đợt tuyển sinh
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Hệ/Ngành
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    GPA
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Hồ sơ
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application, index) => {
                  const uploadedDocs = application.documents.filter(
                    (d) => d.uploaded,
                  ).length;
                  const totalDocs = application.documents.length;
                  const isComplete = uploadedDocs === totalDocs;

                  return (
                    <tr
                      key={application.id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {application.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {application.applicantName.charAt(0)}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.applicantName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">
                        {application.gender}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {application.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {application.batchLabel}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-medium ${getSystemColor(application.system)}`}
                        >
                          {application.system}
                        </div>
                        <div className="text-xs text-gray-500">
                          {application.major}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            application.gpa >= 8
                              ? "bg-green-100 text-green-700"
                              : application.gpa >= 6.5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {application.gpa.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isComplete ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                          <span
                            className={`text-xs font-medium ${isComplete ? "text-green-600" : "text-yellow-600"}`}
                          >
                            {uploadedDocs}/{totalDocs}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(application.status === "submitted" ||
                            application.status === "reviewing") && (
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowReviewModal(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Xét duyệt"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Không tìm thấy hồ sơ nào</p>
            </div>
          )}
        </div>

        {/* Modal chi tiết hồ sơ */}
        {showDetailModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Chi Tiết Hồ Sơ</h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedApplication(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-cyan-100">
                  Mã hồ sơ: {selectedApplication.id}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Thông tin cá nhân */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-600" />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Họ và tên:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.applicantName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày sinh:</span>
                      <span className="ml-2 font-medium">
                        {new Date(
                          selectedApplication.birthDate,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Giới tính:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">CMND/CCCD:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.idCard}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        <Phone className="w-3 h-3 inline mr-1" />
                        SĐT:
                      </span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email:
                      </span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin đăng ký */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-600" />
                    Thông tin đăng ký
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="col-span-2">
                      <span className="text-gray-600">Đợt tuyển sinh:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.batchLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Hệ đào tạo:</span>
                      <span
                        className={`ml-2 font-medium ${getSystemColor(selectedApplication.system)}`}
                      >
                        {selectedApplication.system}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngành:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.major}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trường cũ:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.previousSchool}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Năm TN:</span>
                      <span className="ml-2 font-medium">
                        {selectedApplication.graduationYear}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">GPA:</span>
                      <span
                        className={`ml-2 font-bold text-lg ${
                          selectedApplication.gpa >= 8
                            ? "text-green-600"
                            : selectedApplication.gpa >= 6.5
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {selectedApplication.gpa.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hồ sơ đính kèm */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-cyan-600" />
                    Hồ sơ đính kèm
                  </h3>
                  <div className="space-y-2">
                    {selectedApplication.documents.map((doc, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          doc.uploaded
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {doc.uploaded ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            {doc.name}
                          </span>
                        </div>
                        {doc.uploaded && (
                          <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            Tải về
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trạng thái xét duyệt */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Trạng thái</h3>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày nộp:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedApplication.submitDate,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    {selectedApplication.reviewDate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày xét:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedApplication.reviewDate,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Người xét:</span>
                          <span className="font-medium">
                            {selectedApplication.reviewer}
                          </span>
                        </div>
                        {selectedApplication.notes && (
                          <div className="pt-2 border-t border-blue-300">
                            <span className="text-gray-600">Ghi chú:</span>
                            <p className="mt-1 text-gray-700">
                              {selectedApplication.notes}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Đóng
                  </button>
                  {(selectedApplication.status === "submitted" ||
                    selectedApplication.status === "reviewing") && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowReviewModal(true);
                      }}
                      className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                    >
                      Xét duyệt
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal tiếp nhận hồ sơ mới */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Tiếp Nhận Hồ Sơ Mới</h2>
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Thông tin cá nhân */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <User className="w-5 h-5 text-cyan-600" />
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nhập họ và tên"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CMND/CCCD <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.idCard}
                        onChange={(e) =>
                          setFormData({ ...formData, idCard: e.target.value })
                        }
                        placeholder="Nhập số CMND/CCCD"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Nhập số điện thoại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Nhập email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Nhập địa chỉ"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin đăng ký */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <BookOpen className="w-5 h-5 text-cyan-600" />
                    Thông tin đăng ký
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đợt tuyển sinh <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.batch}
                        onChange={(e) =>
                          setFormData({ ...formData, batch: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        {admissionBatches.slice(1).map((batch) => (
                          <option key={batch.value} value={batch.value}>
                            {batch.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hệ đào tạo <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.system}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            system: e.target.value,
                            major: "",
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="Trung cấp nghề">Trung cấp nghề</option>
                        <option value="Sơ cấp nghề">Sơ cấp nghề</option>
                        <option value="Đại học liên kết">
                          Đại học liên kết
                        </option>
                        <option value="Hệ 9+">Hệ 9+</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngành đăng ký <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.major}
                        onChange={(e) =>
                          setFormData({ ...formData, major: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Chọn ngành</option>
                        {majors[formData.system as keyof typeof majors]?.map(
                          (major) => (
                            <option key={major} value={major}>
                              {major}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trường đã học
                      </label>
                      <input
                        type="text"
                        value={formData.previousSchool}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            previousSchool: e.target.value,
                          })
                        }
                        placeholder="Tên trường"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Năm tốt nghiệp
                      </label>
                      <input
                        type="text"
                        value={formData.graduationYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            graduationYear: e.target.value,
                          })
                        }
                        placeholder="VD: 2023"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm GPA
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.gpa}
                        onChange={(e) =>
                          setFormData({ ...formData, gpa: e.target.value })
                        }
                        placeholder="VD: 7.5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload hồ sơ */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                    <Upload className="w-5 h-5 text-cyan-600" />
                    Tải lên hồ sơ
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Kéo thả file hoặc click để chọn
                    </p>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ: PDF, JPG, PNG (Tối đa 10MB/file)
                    </p>
                    <div className="mt-4 text-xs text-gray-600 text-left max-w-md mx-auto">
                      <p className="font-semibold mb-2">Hồ sơ cần thiết:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Bằng tốt nghiệp (bản sao công chứng)</li>
                        <li>Học bạ (bản sao công chứng)</li>
                        <li>Giấy khai sinh (bản sao)</li>
                        <li>CMND/CCCD (bản sao)</li>
                        <li>Ảnh 3x4 (6 ảnh)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                  >
                    Tiếp nhận hồ sơ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xét duyệt */}
        {showReviewModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Xét Duyệt Hồ Sơ</h2>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedApplication(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-cyan-100">
                  Mã hồ sơ: {selectedApplication.id}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">Thí sinh:</span>{" "}
                      <span className="font-medium">
                        {selectedApplication.applicantName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngành:</span>{" "}
                      <span className="font-medium">
                        {selectedApplication.major}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">GPA:</span>{" "}
                      <span className="font-bold text-cyan-600">
                        {selectedApplication.gpa.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú xét duyệt
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Nhập ghi chú..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      alert(`Từ chối hồ sơ ${selectedApplication.id}`);
                      setShowReviewModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Không đạt
                  </button>
                  <button
                    onClick={() => {
                      alert(`Phê duyệt hồ sơ ${selectedApplication.id}`);
                      setShowReviewModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Đạt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdmissionApplication;
