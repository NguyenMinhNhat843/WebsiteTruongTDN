import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { exemptionsData, exemptionTypes } from "./mockData";
import type { Exemption } from "./mockType";

export const [ExemtionProvider, useExemtionContext] = createContextProvider(
  () => {
    const [exemptions] = useState<Exemption[]>(exemptionsData);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedExemption, setSelectedExemption] =
      useState<Exemption | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Tính toán thống kê
    const stats = {
      totalExemptions: exemptions.length,
      totalAmount: exemptions
        .filter((e) => e.status === "approved")
        .reduce((sum, e) => sum + e.amount, 0),
      pendingCount: exemptions.filter((e) => e.status === "pending").length,
      approvedCount: exemptions.filter((e) => e.status === "approved").length,
      rejectedCount: exemptions.filter((e) => e.status === "rejected").length,
    };

    // Thống kê theo loại
    const typeStats = exemptionTypes.slice(1).map((type) => {
      const items = exemptions.filter(
        (e) => e.type === type.value && e.status === "approved",
      );
      return {
        type: type.label,
        count: items.length,
        amount: items.reduce((sum, e) => sum + e.amount, 0),
        color: type.color,
      };
    });

    // Lọc danh sách
    const filteredExemptions = exemptions.filter((exemption) => {
      const matchSearch =
        exemption.studentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        exemption.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exemption.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = filterType === "all" || exemption.type === filterType;
      const matchStatus =
        filterStatus === "all" || exemption.status === filterStatus;

      return matchSearch && matchType && matchStatus;
    });

    return {
      exemptions,
      searchQuery,
      setSearchQuery,
      filterType,
      setFilterType,
      filterStatus,
      setFilterStatus,
      selectedExemption,
      setSelectedExemption,
      showDetailModal,
      setShowDetailModal,
      showRegisterModal,
      setShowRegisterModal,
      showReviewModal,
      setShowReviewModal,

      stats,
      typeStats,
      filteredExemptions,
    };
  },
);
