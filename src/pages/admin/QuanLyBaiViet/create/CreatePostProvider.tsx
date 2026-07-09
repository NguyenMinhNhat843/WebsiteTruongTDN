import { useForm } from "react-hook-form";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";
import { useQueryClient } from "@tanstack/react-query";

export type CreatePostDto = components["schemas"]["CreatePostDto"];
export type PostResponseDto = components["schemas"]["PostResponseDto"];
export type PostCategoryType = PostResponseDto["type"];
export type PostStatus = PostResponseDto["status"];
export interface Options<T> {
  value: T;
  label: string;
  icon: string;
}

export const POST_CATEGORIES: Options<PostCategoryType>[] = [
  { value: "NEWS", label: "Tin tức", icon: "📰" },
  { value: "EVENT", label: "Sự kiện", icon: "📅" },
  { value: "ACHIEVEMENT", label: "Thành tích", icon: "🏆" },
  { value: "ADMISSION", label: "Tuyển sinh", icon: "🎓" },
  { value: "INTERNAL", label: "Tin nội bộ", icon: "👥" },
  { value: "RECRUITMENT", label: "Tuyển dụng", icon: "💼" },
];

export const POST_STATUSES: Options<PostStatus>[] = [
  { value: "DRAFT", label: "Bản nháp", icon: "📝" },
  { value: "PUBLISHED", label: "Đăng bài", icon: "✅" },
];

export const [CreatePostProvider, useCreatePostContext] = createContextProvider(
  (props: { defaultValues?: PostResponseDto }) => {
    const queryClient = useQueryClient();

    /**
     * Create Post
     */
    const { mutate: createPost, isPending: isCreatingPost } = $api.useMutation(
      "post",
      "/posts",
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/posts"] });
        },
      },
    );

    /**
     * Chỉnh sửa
     */
    const { mutate: updatePost, isPending: isUpdatingPost } = $api.useMutation(
      "patch",
      "/posts/{id}",
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/posts"] });
        },
      },
    );

    /**
     * Upload hình ảnh
     */
    const {
      data: uploadImageData,
      mutate: uploadImage,
      isPending: isUploadingImage,
    } = $api.useMutation("post", "/fileStore/upload");

    /**
     * Form Create
     */
    const defaultValue = props.defaultValues;
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
      reset,
    } = useForm<CreatePostDto>({
      defaultValues: defaultValue ?? {
        content: "",
        title: "",
      },
    });

    return {
      createPost,
      isCreatingPost,
      uploadImage,
      isUploadingImage,
      uploadImageData,
      defaultValue,
      updatePost,
      isUpdatingPost,
      reset,

      watch,
      setValue,
      register,
      handleSubmit,
      errors,
    };
  },
);
