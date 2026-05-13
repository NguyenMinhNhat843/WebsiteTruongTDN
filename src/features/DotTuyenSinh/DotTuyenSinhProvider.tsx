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
    const { id } = useParams();
    const admissionId = parseInt(id ?? "", 10);

    // state
    const [openFormCreate, setOpenFormCreate] = useState<boolean>(false);
    // const [selectedId, setSelectedId] = useState<number | null>(null); // xem chi tiết đợt tuyển sinh nào, null nếu không xem chi tiết nào

    // get dot tuyen sinh
    const { data: admissions, isLoading: isLoadingAdmissions } = $api.useQuery(
      "get",
      "/admissions",
    );

    // post dot tuyen sinh
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

    // get đợt tuyển sinh chi tiết
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
    console.log("Chi tiết đợt tuyển sinh:", admissionId, chiTietDotTuyenSinh);

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
      console.log("Form Data:", data);
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
