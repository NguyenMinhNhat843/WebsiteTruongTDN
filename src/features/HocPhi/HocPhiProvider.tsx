import { useState } from "react";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useQueryClient } from "@tanstack/react-query";

export type TaoCongNoPreviewDto =
  components["schemas"]["TuitionPreviewResponseDto"];
export type ChiTietHocPhiDto = components["schemas"]["TuitionFeeItemsDto"];
export type InvoiceDto = components["schemas"]["InvoiceDto"];

export const [HocPhiProvider, useHocphisContext] = createContextProvider(() => {
  const [isOpenModalTaoCongNo, setIsOpenModalTaoCongNo] = useState(false);
  const [studentCodeInput, setStudentCodeInput] = useState("");
  const queryClient = useQueryClient();

  /**
   * Lấy thông tin xem trước công nợ học phí của học kỳ mới
   */
  const { data: hocPhiXemTruoc, isPending: isPendingHocPhiXemTruoc } =
    $api.useQuery("get", "/tuition-fee/preview");

  /**
   * Tạo công nợ toàn trường cho học kỳ mới
   */
  const { mutate: createSemesterFees, isPending: isPendingCreateSemesterFees } =
    $api.useMutation("post", "/tuition-fee/create-semester-fees", {
      onSuccess: () => {
        alert("Đã tạo công nợ học phí cho học kỳ mới thành công!");
      },
    });

  /**
   * Hàm lấy thông tin sinh viên
   */
  const {
    data: students,
    mutate: getStudentTuitionInfo,
    isPending: isPendingGetStudentTuitionInfo,
  } = $api.useMutation("get", "/students");
  const studentTuitionInfoData = students?.[0];

  // Lấy chi tiết công nợ của sinh viên theo mã sinh viên
  const {
    data: studentTuitionDetails,
    isPending: isPendingStudentTuitionDetails,
  } = $api.useQuery("get", `/tuition-fee/fees/{studentId}`, {
    params: {
      path: {
        studentId: studentTuitionInfoData?.id || 0,
      },
    },
  });

  // thanh toán học phí
  const { mutate: thanhToanHocPhi, isPending: isPendingThanhToanHocPhi } =
    $api.useMutation("post", "/tuition-fee/pay", {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", `/tuition-fee/fees/{studentId}`],
        });
      },
    });

  // Lấy danh sách hóa đơn học phí của sinh viên theo mã sinh viên
  const { data, isPending: isPendingStudentTuitionInvoices } = $api.useQuery(
    "get",
    `/tuition-fee/invoices/{studentCode}`,
    {
      params: {
        path: {
          studentCode: studentTuitionInfoData?.studentCode,
        },
      },
    },
  );
  const studentTuitionInvoices: InvoiceDto[] = data || [];

  return {
    getStudentTuitionInfo,
    isPendingGetStudentTuitionInfo,
    studentTuitionInfoData,
    hocPhiXemTruoc,
    isPendingHocPhiXemTruoc,
    createSemesterFees,
    isPendingCreateSemesterFees,
    isOpenModalTaoCongNo,
    setIsOpenModalTaoCongNo,
    studentCodeInput,
    setStudentCodeInput,
    studentTuitionDetails,
    isPendingStudentTuitionDetails,
    thanhToanHocPhi,
    isPendingThanhToanHocPhi,
    studentTuitionInvoices,
    isPendingStudentTuitionInvoices,
  };
});
