import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Post } from "../../../features/posts/types/Post.types";
import PostDetailView from "../../admin/QuanLyBaiViet/components/PostDetail";

const UserPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Fetch từ MockAPI với filter slug
        const response = await fetch(
          `https://69b11335adac80b427c3e8a9.mockapi.io/news?slug=${slug}`,
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setPost(data[0]);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-8"></div>
        <div className="h-100 w-full bg-gray-200 rounded-xl mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!post || typeof post !== "object") {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy bài viết {slug}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Quay về trang chủ
        </button>
      </div>
    );
  }

  return <PostDetailView post={post} />;
};

export default UserPostDetail;
