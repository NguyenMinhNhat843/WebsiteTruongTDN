import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import type { Student } from "./type";
import { studentsData } from "./mockData";
import { formatCurrency } from "../../../util/format";

export const [ThuHocPhiProvider, useThuHocPhiContext] = createContextProvider(
  () => {
    const [students] = useState<Student[]>(studentsData);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSystem, setFilterSystem] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
      null,
    );
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [paymentNote, setPaymentNote] = useState("");

    // Tính toán thống kê
    const stats = {
      totalStudents: students.length,
      totalRevenue: students.reduce((sum, s) => sum + s.paid, 0),
      totalRemaining: students.reduce((sum, s) => sum + s.remaining, 0),
      paidStudents: students.filter((s) => s.status === "paid").length,
      partialStudents: students.filter((s) => s.status === "partial").length,
      unpaidStudents: students.filter((s) => s.status === "unpaid").length,
    };

    // Lọc danh sách
    const filteredStudents = students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSystem =
        filterSystem === "all" || student.system === filterSystem;
      const matchStatus =
        filterStatus === "all" || student.status === filterStatus;

      return matchSearch && matchSystem && matchStatus;
    });

    const handlePayment = () => {
      if (!selectedStudent || !paymentAmount) return;

      // Logic xử lý thanh toán sẽ được thêm vào đây
      alert(
        `Đã thu ${formatCurrency(Number(paymentAmount))} từ ${selectedStudent.name}`,
      );
      setShowPaymentModal(false);
      setPaymentAmount("");
      setPaymentNote("");
    };

    return {
      students,
      searchQuery,
      setSearchQuery,
      filterSystem,
      setFilterSystem,
      filterStatus,
      setFilterStatus,
      selectedStudent,
      setSelectedStudent,
      showPaymentModal,
      setShowPaymentModal,
      showDetailModal,
      setShowDetailModal,
      paymentAmount,
      setPaymentAmount,
      paymentMethod,
      setPaymentMethod,
      paymentNote,
      setPaymentNote,

      stats,
      filteredStudents,
      handlePayment,
    };
  },
);
