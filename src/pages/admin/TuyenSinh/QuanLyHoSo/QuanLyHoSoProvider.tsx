import { CheckCircle, Clock, FileCheck, XCircle } from "lucide-react";
import { createContextProvider } from "../../../../util/createContextProvider";
import { useState } from "react";
import type { Application, BatchStat, SystemStat } from "./type";
import { applicationsData } from "./mockData";

export const admissionBatches = [
  { value: "all", label: "Tất cả đợt tuyển sinh" },
  { value: "dot1_2026", label: "Tuyển sinh Trung cấp nghề đợt 1 năm 2026" },
  { value: "dot2_2026", label: "Tuyển sinh Trung cấp nghề đợt 2 năm 2026" },
  { value: "dot3_2026", label: "Tuyển sinh Trung cấp nghề đợt 3 năm 2026" },
];

export const [QuanLyHoSoProvider, useQuanLyHoSoContext] = createContextProvider(
  () => {
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
      submittedCount: applications.filter((a) => a.status === "submitted")
        .length,
      reviewingCount: applications.filter((a) => a.status === "reviewing")
        .length,
      approvedCount: applications.filter((a) => a.status === "approved").length,
      rejectedCount: applications.filter((a) => a.status === "rejected").length,
    };

    // Thống kê theo đợt
    const batchStats: BatchStat[] = admissionBatches.slice(1).map((batch) => {
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
    const systemStats: SystemStat[] = [
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

    return {
      handleSubmit,
      getSystemColor,
      getStatusBadge,
      filteredApplications,
      systemStats,
      applications,
      searchQuery,
      setSearchQuery,
      filterBatch,
      setFilterBatch,
      filterSystem,
      setFilterSystem,
      filterStatus,
      setFilterStatus,
      selectedApplication,
      setSelectedApplication,
      setShowDetailModal,
      setShowRegisterModal,
      setShowReviewModal,
      setFormData,
      stats,
      batchStats,
      showDetailModal,
      showRegisterModal,
      showReviewModal,
      formData,
    };
  },
);
