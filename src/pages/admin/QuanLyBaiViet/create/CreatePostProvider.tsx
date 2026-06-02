import { useForm } from "react-hook-form";
import type { components } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";
import { $api } from "../../../../api/client";

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
  { value: "POLICY", label: "Chính sách", icon: "📜" },
];

export const POST_STATUSES: Options<PostStatus>[] = [
  { value: "DRAFT", label: "Bản nháp", icon: "📝" },
  { value: "PUBLISHED", label: "Đã đăng", icon: "✅" },
  { value: "ARCHIVED", label: "Lưu trữ", icon: "📦" },
  { value: "PENDING", label: "Hẹn giờ", icon: "⏰" },
];

export const [CreatePostProvider, useCreatePostContext] = createContextProvider(
  (props: { defaultValues?: PostResponseDto }) => {
    /**
     * Create Post
     */
    const { mutate: createPost, isPending: isCreatingPost } = $api.useMutation(
      "post",
      "/posts",
    );

    /**
     * Chỉnh sửa
     */
    const { mutate: updatePost, isPending: isUpdatingPost } = $api.useMutation(
      "patch",
      "/posts/{id}",
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

      watch,
      setValue,
      register,
      handleSubmit,
      errors,
    };
  },
);
