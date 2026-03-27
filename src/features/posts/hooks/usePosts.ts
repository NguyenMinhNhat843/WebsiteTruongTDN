import { useEffect, useState } from "react";
import type { Post } from "../types/Post.types";
import { postApi } from "../api/post.api";

export const usePosts = (page?: number, limit?: number) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi
      .getPosts(page, limit)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [page, limit]);

  return { posts, loading };
};

// Các hook khác như usePost, useCreatePost, useUpdatePost, useDeletePost
