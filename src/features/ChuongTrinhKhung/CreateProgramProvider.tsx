import { useFieldArray, useForm } from "react-hook-form";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";

export type CreateProgramDto = components["schemas"]["CreateCurriculumDto"];

export const [TaoChuongTrinhKhungProvider, useTaoChuongTrinhKhungContext] =
  createContextProvider(() => {
    // form
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
      watch,
      control,
    } = useForm<CreateProgramDto>({
      defaultValues: {
        isActive: true,
        curriculumSubjects: [],
      },
    });
    const { append, remove } = useFieldArray({
      control,
      name: "curriculumSubjects",
    });
    const allSubjects = watch("curriculumSubjects") || [];

    // Hàm thêm môn học vào học kỳ
    const handleAddSubject = (subjectId: number, semesterNumber: number) => {
      if (!subjectId) return;

      const subjectData = monhocs?.find((s) => s.id === subjectId);

      if (subjectData) {
        // Kiểm tra trùng môn trong toàn bộ chương trình (hoặc chỉ trong học kỳ này tùy bạn)
        if (allSubjects.some((s) => s.subjectId === subjectId)) {
          alert("Môn học này đã tồn tại trong chương trình!");
          return;
        }

        // Thêm vào form theo cấu trúc yêu cầu
        append({
          subjectId: subjectData.id,
          semesterNumber: semesterNumber ?? 1,
          isMandatory: true,
          minGrade: 4,
        });
      }
    };

    const handleRemove = (subjectId: number) => {
      // Tìm index thực tế trong mảng tổng curriculumSubjects để xóa
      const indexToRemove = allSubjects.findIndex(
        (s) => s.subjectId === subjectId,
      );
      if (indexToRemove !== -1) {
        remove(indexToRemove);
      }
    };

    // get môn học
    const {
      data: monhocs,
      isLoading: isLoadingMonHoc,
      error: errorMonHoc,
    } = $api.useQuery("get", "/subjects");

    // get ngành
    const {
      data: majors,
      isLoading: isLoadingMajors,
      error: errorMajors,
    } = $api.useQuery("get", "/majors");

    // create curriculum
    const { mutate: createCurriculum, isPending: isCreatingCurriculum } =
      $api.useMutation("post", "/curriculums");

    return {
      //form
      register,
      handleSubmit,
      reset,
      errors,
      handleAddSubject,
      handleRemove,
      allSubjects,

      monhocs,
      isLoadingMonHoc,
      errorMonHoc,

      majors,
      isLoadingMajors,
      errorMajors,

      createCurriculum,
      isCreatingCurriculum,
    };
  });
