import type { Post } from "../types/Post.types";

export const postApi = {
  getPosts: async (page = 1, limit = 10): Promise<Post[]> => {
    const response = await fetch(
      `https://69b11335adac80b427c3e8a9.mockapi.io/news?page=${page}&limit=${limit}`,
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },
};

// Các API khác như getPostById, createPost, updatePost, deletePost
