import { $api } from "../../../../api/client";
import type { paths } from "../../../../api/v1";
import { createContextProvider } from "../../../../util/createContextProvider";

export type SearchPostDto = paths["/posts"]["get"]["parameters"]["query"];

export const [PostListProvider, usePostListContext] = createContextProvider(
  () => {
    /**
     * Load danh sách bài viết
     */
    const {
      data: postsData,
      isLoading: isLoadingPosts,
      refetch: refetchPosts,
    } = $api.useQuery("get", "/posts");
    const posts = postsData?.data || [];
    const total = postsData?.meta?.total || 0;

    return {
      posts: posts || [],
      total,
      isLoadingPosts,
      refetchPosts,
    };
  },
);
