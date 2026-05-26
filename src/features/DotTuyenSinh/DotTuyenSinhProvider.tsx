import { useFieldArray, useForm } from "react-hook-form";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";
import { createContextProvider } from "../../util/createContextProvider";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export type CreateDotTuyenSinhDto = components["schemas"]["CreateAdmissionDto"];
export type ChiTietDotTuyenSinhDto =
  components["schemas"]["AdmissionItemResponseDto"];
export type DotTuyenSinhDto = components["schemas"]["AdmissionResponseDto"];
export type StatusDotTuyenSinh = DotTuyenSinhDto["status"];
export type TieuChiTuyenSinhDto =
  components["schemas"]["AdmissionItemCriterionResponseDto"];

export const [DotTuyenSinhProvider, useDotTuyenSinhContext] =
  createContextProvider(() => {
    const queryClient = useQueryClient();
    const { id } = useParams(); // id ddowtj uyeenr sinh
    const idDotTuyenSinh = parseInt(id ?? "", 10);
    const admissionId = parseInt(id ?? "", 10);

    // state
    const [openFormCreate, setOpenFormCreate] = useState<boolean>(false);

    // get dot tuyen sinh
    const { data: admissions, isLoading: isLoadingAdmissions } = $api.useQuery(
      "get",
      "/admissions",
    );

    // delete đợt tuyển sinh theo id
    const { mutate: deleteDotTuyenSinh, isPending: isDeletingDotTuyenSinh } =
      $api.useMutation("delete", "/admissions/{id}", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/admissions"] });
        },
        onError: () => {
          alert(
            "Xóa đợt tuyển sinh thất bại! Có thể do có lỗi mạng hoặc đợt tuyển sinh đã bị xóa bởi người khác.",
          );
        },
      });

    /**
     * Tạo đợt tuyển sinh mới
     */
    const { mutate: createDotTuyenSinh, isPending: isCreatingDotTuyenSinh } =
      $api.useMutation("post", "/admissions", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/admissions"] });
        },
      });

    // get danh sách ngành
    const { data: nganhs, isPending: isLoadingNganhs } = $api.useQuery(
      "get",
      "/majors",
    );

    // get tiêu chí tuyển sinh
    const { data: tieuChiTuyenSinh, isPending: isLoadingTieuChiTuyenSinh } =
      $api.useQuery("get", "/criteria");

    // get đợt tuyển sinh one
    const {
      data: chiTietDotTuyenSinh,
      isLoading: isLoadingChiTietDotTuyenSinh,
    } = $api.useQuery(
      "get",
      "/admissions/{id}",
      {
        params: {
          path: {
            id: admissionId!,
          },
        },
      },
      {
        enabled: admissionId !== undefined,
      },
    );
    const dotTuyenSinhItems = chiTietDotTuyenSinh?.items ?? [];

    // Chốt đượt tuyển sinh
    const { mutate: approveDotTuyenSinh, isPending: isApprovingDotTuyenSinh } =
      $api.useMutation("post", "/admissions/approve", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/admissions"] });
          queryClient.invalidateQueries({
            queryKey: ["get", "/applications"],
          });
        },
      });

    // form create
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateDotTuyenSinhDto>({
      defaultValues: {
        status: "OPEN",
        items: [{ batchName: "", quota: 0, criteria: [] }],
      },
    });

    const {
      fields: itemFields,
      append: appendItem,
      remove: removeItem,
    } = useFieldArray({
      control,
      name: "items",
    });

    const onSubmit = (data: CreateDotTuyenSinhDto) => {
      createDotTuyenSinh(
        {
          body: {
            ...data,
            startDate: data.startDate
              ? new Date(data.startDate).toISOString()
              : "",
            endDate: data.endDate ? new Date(data.endDate).toISOString() : "",
          },
        },
        {
          onSuccess: () => {
            alert("Tạo đợt tuyển sinh thành công!");
            setOpenFormCreate(false);
          },
        },
      );
    };

    // get khóa đào tạo để hiển thị tên khóa đào tạo thay vì id trong chi tiết đợt tuyển sinh
    const {
      data: batches,
      isPending: isBatchesPending,
      isError: isBatchesError,
    } = $api.useQuery("get", "/batches");

    return {
      admissions,
      isLoadingAdmissions,
      createDotTuyenSinh,
      isCreatingDotTuyenSinh,
      nganhs,
      isLoadingNganhs,
      tieuChiTuyenSinh,
      isLoadingTieuChiTuyenSinh,
      chiTietDotTuyenSinh,
      isLoadingChiTietDotTuyenSinh,
      id,
      dotTuyenSinhItems,
      deleteDotTuyenSinh,
      isDeletingDotTuyenSinh,
      idDotTuyenSinh,
      approveDotTuyenSinh,
      isApprovingDotTuyenSinh,
      batches,
      isBatchesPending,
      isBatchesError,

      // state
      openFormCreate,
      setOpenFormCreate,

      // form create
      register,
      control,
      handleSubmit,
      errors,
      itemFields,
      appendItem,
      removeItem,
      onSubmit,
    };
  });
