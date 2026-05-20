import { useMemo, useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import {
  useLopHocPhanOneContext,
  type GradeEntry,
  type GradeEntryRequestDto,
  type SubmitGradeInClass,
} from "./LopHocPhanOneProvider";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StudentRowData {
  id: number;
  studentCode: string;
  fullName: string;
  diem: Record<number, GradeEntry | null>; // Giá trị có thể là điểm số hoặc chuỗi rỗng nếu chưa nhập
  regisId: number; // ID của CourseRegistration để mapping khi gửi điểm lên server
}

export const [TableDiemProvider, useTableDiemContext] = createContextProvider(
  () => {
    const { lopHocPhanDetail } = useLopHocPhanOneContext();

    // 1. Lấy điểm thành phần từ môn học
    const gradesConfig = useMemo(() => {
      return (
        lopHocPhanDetail?.subject?.subjectGrades?.map((subjectGrade) => {
          return {
            name: subjectGrade.gradeComponent.name, // Tên thành phần điểm (ví dụ: "Điểm giữa kỳ")
            weight: subjectGrade.weight, // Trọng số thực tế (ví dụ: 0.3 cho 30%)
            id: subjectGrade.gradeComponent.id, // ID của thành phần điểm để mapping khi nhập liệu
          };
        }) || []
      );
    }, [lopHocPhanDetail]);

    /**
     * Quản lý state dữ liệu cho table
     */
    const [tableData, setTableData] = useState<StudentRowData[]>(() => {
      return (
        lopHocPhanDetail?.registrations?.map((regis) => {
          const student = regis.student;
          const diemMap: Record<number, GradeEntry | null> = {};
          const gradeEntries = regis.gradeEntries || [];

          // Duyệt qua điểm thành phần (ví dụ: Chuyên cần, Giữa kỳ, Cuối kỳ)
          gradesConfig.forEach((gradeComponent) => {
            // Tìm xem sinh viên này (regis.id) đã có điểm của đầu điểm này (grade.id) chưa
            const matchingGrade = gradeEntries?.find(
              (entry) => entry.componentId === gradeComponent.id,
            );

            // Nếu tìm thấy điểm thì hiển thị score, nếu không thấy (hoặc null) thì để chuỗi rỗng ""
            diemMap[gradeComponent.id] =
              matchingGrade && matchingGrade.score !== null
                ? matchingGrade
                : null;
          });

          return {
            id: student.id,
            studentCode: student.studentCode,
            fullName: student.fullName,
            diem: diemMap,
            regisId: regis.id,
          };
        }) || []
      );
    });

    /**
     * Xử lý change input điểm: Cập nhật State tableData theo đúng componentId và studentId
     */
    const handleScoreChange = (
      studentId: number,
      componentId: number,
      value: string,
    ) => {
      if (value !== "") {
        const num = parseFloat(value);
        if (num < 0 || num > 10) return;
      }

      setTableData((prevData) =>
        prevData.map((row) => {
          if (row.id === studentId) {
            // 1. Lấy ra object điểm hiện tại của componentId này (nếu có)
            const currentGradeEntry = row.diem[componentId];
            const newScore = value === "" ? null : parseFloat(value);

            return {
              ...row,
              diem: {
                ...row.diem,
                [componentId]: {
                  // 2. Nếu đã có thông tin cũ thì spread lại, nếu chưa có (null/undefined) thì tạo object mới
                  ...currentGradeEntry,

                  // 3. Đảm bảo các trường bắt buộc 'id' và 'componentId' luôn có giá trị number, không bị undefined
                  id: currentGradeEntry?.id ?? 0, // Hoặc một logic sinh ID tạm thời của bạn, ví dụ: Date.now()
                  componentId: currentGradeEntry?.componentId ?? componentId,
                  courseRegistrationId:
                    currentGradeEntry?.courseRegistrationId ?? row.regisId, // mapping luôn regisId của học sinh nếu cần

                  // 4. Cập nhật score mới
                  score: newScore,
                },
              },
            };
          }
          return row;
        }),
      );
    };

    /**
     * Hàm tính tổng điểm dựa trên các điểm thành phần và trọng số tương ứng
     * Nếu có bất kỳ điểm thành phần nào chưa được nhập (score là null), sẽ trả về "-"
     */
    const calculateTotalScore = (diem: Record<number, any>) => {
      let total = 0;
      let hasAllScores = true;

      for (const grade of gradesConfig) {
        const score = diem[grade.id]?.score;
        if (score === "" || score === undefined || score === null) {
          hasAllScores = false; // Nếu học sinh bị thiếu bất kỳ đầu điểm nào, chưa tính tổng điểm hiển thị
          break;
        }
        total += parseFloat(score as string) * grade.weight; // Tính tổng theo trọng số tích lũy
      }

      return hasAllScores ? total.toFixed(2) : "-";
    };

    /**
     * Xử lý payload save điểm
     */
    const handlePayloadSaveGrade = () => {
      const gradeEntriesPayload: GradeEntryRequestDto[] = [];

      tableData.forEach((studentRow) => {
        Object.keys(studentRow.diem).forEach((componentIdStr) => {
          const compId = Number(componentIdStr);
          const rawValue = studentRow.diem[compId];

          // Lấy giá trị score ra trước
          const currentScore = rawValue?.score;

          // Chỉ push khi score khác null, khác undefined và không phải là chuỗi rỗng
          if (currentScore !== undefined && currentScore !== null) {
            gradeEntriesPayload.push({
              componentId: compId,
              score: Number(currentScore), // Ép kiểu về Number để chuẩn data type của API
              courseRegistrationId: studentRow.regisId,
            });
          }
        });
      });

      const payload: SubmitGradeInClass = {
        grades: gradeEntriesPayload,
      };
      return payload;
    };

    return {
      handlePayloadSaveGrade,
      calculateTotalScore,
      handleScoreChange,
      tableData,
      setTableData,
      gradesConfig,
    };
  },
);
