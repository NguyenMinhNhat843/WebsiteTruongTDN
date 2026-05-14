import { useState } from "react";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";

export type TaoCongNoPreviewDto =
  components["schemas"]["TuitionPreviewResponseDto"];
export type ChiTietHocPhiDto = components["schemas"]["TuitionFeeItemsDto"];
export type InvoiceDto = components["schemas"]["InvoiceDto"];

export const [HocPhiProvider, useHocphisContext] = createContextProvider(() => {
  const [isOpenModalTaoCongNo, setIsOpenModalTaoCongNo] = useState(false);
  const [studentCodeInput, setStudentCodeInput] = useState("63893284");
  // get danh sách học kỳ
  const { data: hockys, isPending: isPendingHocKys } = $api.useQuery(
    "get",
    "/semesters",
  );

  // get thông tin học phí xem trước khi mở đợt học phí
  const { data: hocPhiXemTruoc, isPending: isPendingHocPhiXemTruoc } =
    $api.useQuery("get", "/tuition-fee/preview");

  // post tạo công nợ toàn trường
  const { mutate: createSemesterFees, isPending: isPendingCreateSemesterFees } =
    $api.useMutation("post", "/tuition-fee/create-semester-fees", {
      onSuccess: () => {
        alert("Đã tạo công nợ học phí cho học kỳ mới thành công!");
      },
    });

  // get sinh viên theo mã sinh viên
  const { data: studentTuitionInfo, isPending: isPendingStudentTuitionInfo } =
    $api.useQuery(
      "get",
      "/students",
      {
        params: {
          query: {
            studentCode: studentCodeInput,
          },
        },
      },
      {
        enabled: studentCodeInput.trim() !== "", // Chỉ gọi API khi có mã sinh viên
      },
    );
  const student = studentTuitionInfo?.[0];

  // Lấy chi tiết công nợ của sinh viên theo mã sinh viên
  const {
    data: studentTuitionDetails,
    isPending: isPendingStudentTuitionDetails,
  } = $api.useQuery("get", `/tuition-fee/fees/{studentId}`, {
    params: {
      path: {
        studentId: studentTuitionInfo?.[0]?.id || 0,
      },
    },
  });

  // thanh toán học phí
  const { mutate: thanhToanHocPhi, isPending: isPendingThanhToanHocPhi } =
    $api.useMutation("post", "/tuition-fee/pay");

  // Lấy danh sách hóa đơn học phí của sinh viên theo mã sinh viên
  const { data, isPending: isPendingStudentTuitionInvoices } = $api.useQuery(
    "get",
    `/tuition-fee/invoices/{studentCode}`,
    {
      params: {
        path: {
          studentCode: studentCodeInput,
        },
      },
    },
  );
  const studentTuitionInvoices: InvoiceDto[] = data || [];

  return {
    hockys,
    isPendingHocKys,
    hocPhiXemTruoc,
    isPendingHocPhiXemTruoc,
    createSemesterFees,
    isPendingCreateSemesterFees,
    isOpenModalTaoCongNo,
    setIsOpenModalTaoCongNo,
    studentCodeInput,
    setStudentCodeInput,
    studentTuitionInfo,
    isPendingStudentTuitionInfo,
    studentTuitionDetails,
    isPendingStudentTuitionDetails,
    student,
    thanhToanHocPhi,
    isPendingThanhToanHocPhi,
    studentTuitionInvoices,
    isPendingStudentTuitionInvoices,
  };
});
