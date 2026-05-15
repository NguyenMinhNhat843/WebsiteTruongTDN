import { useMemo, useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";

export const [PhanLopProvider, usePhanLopContext] = createContextProvider(
  () => {
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    // nganhf
    const { data: nganhs, isPending: isPendingNganhs } = $api.useQuery(
      "get",
      "/majors",
    );

    // batch
    const { data: batches, isPending: isPendingbatches } = $api.useQuery(
      "get",
      "/batches",
    );
    const latestBatch = useMemo(() => {
      if (!selectedMajorId || !batches) return null;
      return batches
        .filter((b) => b.majorId === selectedMajorId)
        .sort((a, b) => b.id - a.id)[0];
    }, [selectedMajorId, batches]);

    // get danh sách học sinh đủ điều kiện phân lớp
    const { data: students, isPending: isPendingStudents } = $api.useQuery(
      "get",
      "/classes/eligible-for-assignment",
      {
        params: {
          query: {
            batchId: latestBatch?.id, // Lấy batchId từ latestBatch đã tính toán ở trên
          },
        },
      },
      {
        enabled: !!latestBatch, // Chỉ chạy query này khi latestBatch đã có giá trị
      },
    );

    // Phân lớp tự động
    const { mutate: phanLop, isPending: isPendingPhanLop } = $api.useMutation(
      "post",
      "/classes/assign-classes",
    );

    return {
      students,
      isPendingStudents,
      nganhs,
      isPendingNganhs,
      batches,
      isPendingbatches,
      phanLop,
      isPendingPhanLop,

      // state
      selectedMajorId,
      setSelectedMajorId,
      latestBatch,
    };
  },
);
