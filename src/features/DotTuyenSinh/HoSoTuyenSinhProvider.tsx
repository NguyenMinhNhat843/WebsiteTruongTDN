import { useQueryClient } from "@tanstack/react-query";
import { $api } from "../../api/client";
import type { components, operations } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useParams } from "react-router-dom"; // Giả sử bạn dùng id từ URL cho findOne
import { useState } from "react";
import { useDotTuyenSinhContext } from "./DotTuyenSinhProvider";

export type CreateHoSoTuyenSinhDto =
  components["schemas"]["CreateApplyApplicationDto"];
export type HoSoTuyenSinhDto = components["schemas"]["ApplicationResponseDto"];
export type UpdateHoSoTuyenSinhDto =
  components["schemas"]["UpdateApplicationDto"];
export type StatusHoSoTuyenSinh = HoSoTuyenSinhDto["status"];
export type FindHoSoTuyenSinhQuery =
  operations["ApplicationController_findAll"]["parameters"]["query"];

export const [HoSoTuyenSinhProvider, useHoSoTuyenSinhContext] =
  createContextProvider(() => {
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>(); // Lấy ID hồ sơ tuyển sinh từ URL nếu cần cho findOne
    const { id: idDotTuyenSinh } = useDotTuyenSinhContext();
    const [isCreateHoSoModalOpen, setIsCreateHoSoModalOpen] = useState(false);

    // 1. Find All - Lấy danh sách hồ sơ
    const { data: hoSoTuyenSinhs, isLoading: isLoadingHoSoTuyenSinhs } =
      $api.useQuery(
        "get",
        "/applications",
        {
          params: {
            query: {
              admissionItemId: Number(idDotTuyenSinh),
            },
          },
        },
        {
          enabled: !!idDotTuyenSinh, // Chỉ fetch khi đã có id đợt tuyển sinh
        },
      );

    // 2. Find One - Lấy chi tiết một hồ sơ (chỉ chạy khi có id)
    const { data: hoSoDetail, isLoading: isLoadingDetail } = $api.useQuery(
      "get",
      "/applications/{id}",
      {
        params: {
          path: { id: Number(id) },
        },
      },
      {
        enabled: !!id, // Chỉ fetch khi id tồn tại
      },
    );

    // 3. Create - Thêm mới hồ sơ
    const { mutateAsync: createHoSo, isPending: isCreating } = $api.useMutation(
      "post",
      "/applications",
      {
        onSuccess: () => {
          // Làm mới danh sách sau khi tạo thành công
          queryClient.invalidateQueries({ queryKey: ["get", "/applications"] });
        },
      },
    );

    // 4. Update - Cập nhật hồ sơ (Thông tin hoặc trạng thái)
    const { mutateAsync: updateHoSo, isPending: isUpdating } = $api.useMutation(
      "patch",
      "/applications/{id}",
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/applications"] });
          if (id) {
            queryClient.invalidateQueries({
              queryKey: [
                "get",
                "/applications/{id}",
                { params: { path: { id: Number(id) } } },
              ],
            });
          }
        },
      },
    );

    // 5. Delete - Xóa hồ sơ
    const { mutateAsync: deleteHoSo, isPending: isDeleting } = $api.useMutation(
      "delete",
      "/applications/{id}",
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/applications"] });
        },
      },
    );

    return {
      // Data & Loading states
      hoSoTuyenSinhs,
      isLoadingHoSoTuyenSinhs,
      hoSoDetail,
      isLoadingDetail,

      //state
      isCreateHoSoModalOpen,
      setIsCreateHoSoModalOpen,

      // Actions
      createHoSo: (data: CreateHoSoTuyenSinhDto) => createHoSo({ body: data }),

      updateHoSo: (updateId: number, data: UpdateHoSoTuyenSinhDto) =>
        updateHoSo({
          params: { path: { id: updateId } },
          body: data,
        }),

      deleteHoSo: (deleteId: number) =>
        deleteHoSo({
          params: { path: { id: deleteId } },
        }),

      // Status flags
      isActionLoading: isCreating || isUpdating || isDeleting,
    };
  });
