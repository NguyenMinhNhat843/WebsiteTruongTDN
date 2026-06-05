import { useState } from "react";
import { $api } from "../../../../api/client";
import { createContextProvider } from "../../../../util/createContextProvider";

export interface LocalFileItem {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
}

export interface SelectedFilesMap {
  [configItemId: number]: LocalFileItem[];
}

export const [CreateProvider, useCreateContext] = createContextProvider(() => {
  /**
   * Xử lý upload các file tài liệu
   */
  const [selectedFiles, setSelectedFiles] = useState<SelectedFilesMap>({});
  const handleUploadFiles = () => {
    const formData = new FormData();
    Object.entries(selectedFiles).forEach(([configItemId, files]) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      files.forEach((fileItem: any) => {
        formData.append("files", fileItem.file);
        formData.append("documentConfigItemIds", configItemId);
      });
    });

    formData.forEach((value, key) => {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    });
  };

  /**
   * Thêm học sinh
   */
  const { mutate: createStudent, isPending: isCreatingStudent } =
    $api.useMutation("post", "/students");

  /**
   * Load cấu hình hồ sơ nhập học
   */
  const { data: configHoSoNhapHoc, isLoading: isLoadingConfigHoSoNhapHoc } =
    $api.useQuery(
      "get",
      "/document-configs/{id}", // Mặc định lấy 1 luôn
      {
        params: {
          path: {
            id: 1,
          },
        },
      },
    );
  const configHoSoNhapHocItems = configHoSoNhapHoc?.items || [];

  /**
   * Lưu file lên server
   */
  const { mutate: uploadFile, isPending: isUploadingFile } = $api.useMutation(
    "post",
    "/student-documents/bulk",
  );

  return {
    createStudent,
    isCreatingStudent,
    configHoSoNhapHocItems,
    isLoadingConfigHoSoNhapHoc,
    uploadFile,
    isUploadingFile,
    selectedFiles,
    setSelectedFiles,
    handleUploadFiles,
  };
});
