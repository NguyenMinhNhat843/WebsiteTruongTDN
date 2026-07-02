import { useEffect, useMemo, useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";

export const [PhanLopProvider, usePhanLopContext] = createContextProvider(
  () => {
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    const [selectedBatchId, setSelectedBatchId] = useState<
      number | null | undefined
    >(null);
    // nganhf
    const { data: nganhs, isPending: isPendingNganhs } = $api.useQuery(
      "get",
      "/majors",
    );

    /**
     * Lấy khóa đào tạo
     */
    const { data: batches, isPending: isPendingbatches } = $api.useQuery(
      "get",
      "/batches",
    );
    const allBatch = useMemo(() => {
      if (!selectedMajorId || !batches) return [];
      return batches
        .filter((b) => b.majorId === selectedMajorId)
        .sort((a, b) => (b?.id || 0) - (a?.id || 0)); // Mới nhất lên đầu
    }, [selectedMajorId, batches]);

    // 4. Dùng useEffect để khi đổi Ngành thì tự động chọn Khóa đầu tiên (Khóa mới nhất)
    useEffect(() => {
      if (allBatch && allBatch.length > 0) {
        setSelectedBatchId(allBatch[0].id);
      } else {
        setSelectedBatchId(null);
      }
    }, [allBatch]);

    // get danh sách học sinh đủ điều kiện phân lớp
    const {
      data: students,
      isLoading: isLoadingStudents,
      refetch: refetchStudents,
    } = $api.useQuery(
      "get",
      "/students/eligible-for-assignment",
      {
        params: {
          query: {
            batchId: selectedBatchId!,
          },
        },
      },
      {
        enabled: !!selectedBatchId,
      },
    );

    // Phân lớp tự động
    const { mutate: phanLop, isPending: isPendingPhanLop } = $api.useMutation(
      "patch",
      "/students/assign-classes",
      {
        onSuccess: () => {
          refetchStudents();
        },
      },
    );

    return {
      students,
      isLoadingStudents,
      nganhs,
      isPendingNganhs,
      batches,
      isPendingbatches,
      phanLop,
      isPendingPhanLop,
      allBatch,

      // state
      selectedMajorId,
      setSelectedMajorId,
      selectedBatchId,
      setSelectedBatchId,
    };
  },
);
