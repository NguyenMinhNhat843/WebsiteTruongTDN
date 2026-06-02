import { useForm } from "react-hook-form";
import { $api } from "../../../api/client";
import type { components } from "../../../api/v1";
import { createContextProvider } from "../../../util/createContextProvider";

export type CreatePostDto = components["schemas"]["CreatePostDto"];
export type PostResponseDto = components["schemas"]["PostResponseDto"];
export type PostCategoryType = PostResponseDto["type"];
export type PostStatus = PostResponseDto["status"];

export const [CreatePostProvider, useCreatePostContext] = createContextProvider(
  () => {
    /**
     * Create Post
     */
    const { mutate: createPost, isPending: isCreatingPost } = $api.useMutation(
      "post",
      "/posts",
    );

    /**
     * Upload hình ảnh
     */
    const { mutate: uploadImage, isPending: isUploadingImage } =
      $api.useMutation("post", "/fileStore/upload");

    /**
     * Form Create
     */
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm<CreatePostDto>({
      defaultValues: {
        content: "",
        title: "",
      },
    });

    return {
      createPost,
      isCreatingPost,
      uploadImage,
      isUploadingImage,

      watch,
      setValue,
      register,
      handleSubmit,
      errors,
    };
  },
);
