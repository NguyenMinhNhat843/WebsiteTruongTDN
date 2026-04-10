import { useState } from "react";
import {
  Image,
  Video,
  FileText,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Trash2,
  Download,
  Edit,
  X,
  FolderOpen,
  HardDrive,
  Play,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  thumbnail?: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  tags: string[];
  description?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
}

// Dữ liệu mẫu
const mediaData: MediaItem[] = [
  {
    id: "M001",
    name: "dai-hoc-truong.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    size: 2456789,
    uploadDate: "2026-04-01",
    uploadedBy: "Admin",
    category: "Cơ sở vật chất",
    tags: ["trường học", "cơ sở"],
    description: "Hình ảnh toàn cảnh trường",
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "M002",
    name: "phong-thuc-hanh.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    size: 1845632,
    uploadDate: "2026-04-02",
    uploadedBy: "Admin",
    category: "Cơ sở vật chất",
    tags: ["phòng học", "thực hành"],
    description: "Phòng thực hành kỹ thuật",
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "M003",
    name: "sinh-vien-hoc-tap.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400",
    size: 15678945,
    uploadDate: "2026-03-28",
    uploadedBy: "Admin",
    category: "Hoạt động",
    tags: ["sinh viên", "học tập"],
    description: "Video sinh viên trong giờ học",
    duration: 125,
  },
  {
    id: "M004",
    name: "le-khai-giang.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
    size: 3245789,
    uploadDate: "2026-03-25",
    uploadedBy: "Admin",
    category: "Sự kiện",
    tags: ["lễ khai giảng", "sự kiện"],
    description: "Lễ khai giảng năm học 2025-2026",
    dimensions: { width: 2048, height: 1365 },
  },
  {
    id: "M005",
    name: "bang-tuyen-sinh.pdf",
    type: "document",
    url: "",
    size: 456789,
    uploadDate: "2026-04-05",
    uploadedBy: "Phòng CTSV",
    category: "Tài liệu",
    tags: ["tuyển sinh", "thông báo"],
    description: "Bảng thông báo tuyển sinh 2026",
  },
  {
    id: "M006",
    name: "giao-vien-day-hoc.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    size: 2134567,
    uploadDate: "2026-04-03",
    uploadedBy: "Admin",
    category: "Đội ngũ",
    tags: ["giáo viên", "giảng dạy"],
    description: "Giáo viên trong giờ lên lớp",
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "M007",
    name: "thi-tay-nghe.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    size: 23456789,
    uploadDate: "2026-03-30",
    uploadedBy: "Admin",
    category: "Hoạt động",
    tags: ["thi", "tay nghề"],
    description: "Video thi tay nghề sinh viên",
    duration: 245,
  },
  {
    id: "M008",
    name: "thu-vien.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    size: 1923456,
    uploadDate: "2026-04-04",
    uploadedBy: "Admin",
    category: "Cơ sở vật chất",
    tags: ["thư viện", "cơ sở"],
    description: "Thư viện trường",
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "M009",
    name: "hoat-dong-ngoai-khoa.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800",
    size: 2876543,
    uploadDate: "2026-04-06",
    uploadedBy: "Đoàn TN",
    category: "Hoạt động",
    tags: ["ngoại khóa", "sinh viên"],
    description: "Hoạt động ngoại khóa của sinh viên",
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "M010",
    name: "quy-che-dao-tao.pdf",
    type: "document",
    url: "",
    size: 678912,
    uploadDate: "2026-04-07",
    uploadedBy: "Phòng ĐT",
    category: "Tài liệu",
    tags: ["quy chế", "đào tạo"],
    description: "Quy chế đào tạo năm 2026",
  },
  {
    id: "M011",
    name: "xuong-thuc-hanh.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    size: 2456123,
    uploadDate: "2026-04-08",
    uploadedBy: "Admin",
    category: "Cơ sở vật chất",
    tags: ["xưởng", "thực hành"],
    description: "Xưởng thực hành kỹ thuật",
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "M012",
    name: "le-tot-nghiep.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    size: 34567890,
    uploadDate: "2026-03-20",
    uploadedBy: "Admin",
    category: "Sự kiện",
    tags: ["tốt nghiệp", "lễ"],
    description: "Lễ tốt nghiệp khóa 2023-2026",
    duration: 1800,
  },
];

const categories = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "Cơ sở vật chất", label: "Cơ sở vật chất" },
  { value: "Hoạt động", label: "Hoạt động" },
  { value: "Sự kiện", label: "Sự kiện" },
  { value: "Đội ngũ", label: "Đội ngũ" },
  { value: "Tài liệu", label: "Tài liệu" },
];

function MediaLibrary() {
  const [media] = useState<MediaItem[]>(mediaData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Tính toán thống kê
  const stats = {
    totalFiles: media.length,
    images: media.filter((m) => m.type === "image").length,
    videos: media.filter((m) => m.type === "video").length,
    documents: media.filter((m) => m.type === "document").length,
    totalSize: media.reduce((sum, m) => sum + m.size, 0),
  };

  // Lọc danh sách
  const filteredMedia = media.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchType = filterType === "all" || item.type === filterType;
    const matchCategory =
      filterCategory === "all" || item.category === filterCategory;

    return matchSearch && matchType && matchCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "document":
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "text-blue-600 bg-blue-100";
      case "video":
        return "text-purple-600 bg-purple-100";
      case "document":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl shadow-lg">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Thư Viện Media
                </h1>
                <p className="text-gray-600">
                  Quản lý hình ảnh, video và tài liệu
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-600 text-white rounded-xl hover:from-pink-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Upload className="w-5 h-5" />
              Tải lên media
            </button>
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-pink-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalFiles}
                </div>
                <div className="text-xs text-gray-500">files</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              Tổng số file
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Image className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.images}</div>
                <div className="text-xs text-blue-100">files</div>
              </div>
            </div>
            <div className="text-sm font-medium">Hình ảnh</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Video className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.videos}</div>
                <div className="text-xs text-purple-100">files</div>
              </div>
            </div>
            <div className="text-sm font-medium">Video</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.documents}</div>
                <div className="text-xs text-orange-100">files</div>
              </div>
            </div>
            <div className="text-sm font-medium">Tài liệu</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Dung lượng
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatFileSize(stats.totalSize)}
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

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === "all"
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterType("image")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterType === "image"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <Image className="w-4 h-4" />
                Hình ảnh
              </button>
              <button
                onClick={() => setFilterType("video")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterType === "video"
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                <Video className="w-4 h-4" />
                Video
              </button>
              <button
                onClick={() => setFilterType("document")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterType === "document"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                Tài liệu
              </button>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none text-sm bg-transparent w-48"
                />
              </div>

              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Xem dạng lưới"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Xem dạng danh sách"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị media */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => {
              const TypeIcon = getTypeIcon(item.type);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Preview */}
                  <div className="relative aspect-video bg-gray-100">
                    {item.type === "image" && (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {item.type === "video" && (
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        {item.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(item.duration)}
                          </div>
                        )}
                      </div>
                    )}
                    {item.type === "document" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedMedia(item);
                          setShowDetailModal(true);
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Tải về"
                      >
                        <Download className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={`p-2 rounded-lg ${getTypeColor(item.type)}`}
                      >
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(item.size)}
                      </span>
                    </div>
                    <h3
                      className="font-medium text-gray-900 text-sm mb-1 truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.category}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-600 to-orange-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Tên file
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Kích thước
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Ngày tải
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Người tải
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedia.map((item, index) => {
                  const TypeIcon = getTypeIcon(item.type);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getTypeColor(item.type)}`}
                          >
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}
                        >
                          {item.type === "image"
                            ? "Hình ảnh"
                            : item.type === "video"
                              ? "Video"
                              : "Tài liệu"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-700">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">
                        {new Date(item.uploadDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.uploadedBy}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedMedia(item);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Tải về"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Không tìm thấy media nào</p>
          </div>
        )}

        {/* Modal chi tiết */}
        {showDetailModal && selectedMedia && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="bg-gradient-to-r from-pink-500 to-orange-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Chi Tiết Media</h2>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedMedia(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-pink-100">{selectedMedia.name}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Preview lớn */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  {selectedMedia.type === "image" && (
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.name}
                      className="w-full max-h-96 object-contain"
                    />
                  )}
                  {selectedMedia.type === "video" && (
                    <div className="relative aspect-video">
                      <img
                        src={selectedMedia.thumbnail || selectedMedia.url}
                        alt={selectedMedia.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-20 h-20 text-white" />
                      </div>
                    </div>
                  )}
                  {selectedMedia.type === "document" && (
                    <div className="aspect-video flex items-center justify-center">
                      <FileText className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Thông tin */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tên file
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedMedia.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Loại
                      </label>
                      <p className="text-gray-900">
                        {selectedMedia.type === "image"
                          ? "Hình ảnh"
                          : selectedMedia.type === "video"
                            ? "Video"
                            : "Tài liệu"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Danh mục
                      </label>
                      <p className="text-gray-900">{selectedMedia.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Kích thước
                      </label>
                      <p className="text-gray-900">
                        {formatFileSize(selectedMedia.size)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Ngày tải lên
                      </label>
                      <p className="text-gray-900">
                        {new Date(selectedMedia.uploadDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Người tải
                      </label>
                      <p className="text-gray-900">
                        {selectedMedia.uploadedBy}
                      </p>
                    </div>
                    {selectedMedia.dimensions && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Kích thước ảnh
                        </label>
                        <p className="text-gray-900">
                          {selectedMedia.dimensions.width} x{" "}
                          {selectedMedia.dimensions.height} px
                        </p>
                      </div>
                    )}
                    {selectedMedia.duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Thời lượng
                        </label>
                        <p className="text-gray-900">
                          {formatDuration(selectedMedia.duration)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mô tả */}
                {selectedMedia.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Mô tả
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedMedia.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedia.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Tải về
                  </button>
                  <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal upload */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-pink-500 to-orange-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">Tải Lên Media</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-pink-400 transition-colors cursor-pointer bg-gray-50">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Hỗ trợ: JPG, PNG, MP4, MOV, PDF, DOCX (Tối đa 50MB)
                  </p>
                  <button className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium">
                    Chọn file
                  </button>
                </div>

                {/* Thông tin bổ sung */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500">
                      {categories.slice(1).map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Nhập mô tả cho media..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tags, cách nhau bởi dấu phẩy"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-600 text-white rounded-lg hover:from-pink-600 hover:to-orange-700 transition-all font-medium">
                    Tải lên
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

export default MediaLibrary;
