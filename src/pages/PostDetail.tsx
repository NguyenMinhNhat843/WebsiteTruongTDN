import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { IPost } from "../types/api.type";

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost | null>(null);
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

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Header bài viết */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Nội dung chi tiết (Render HTML) */}
      <div
        className="prose prose-lg max-w-none prose-slate prose-headings:text-gray-900 prose-a:text-blue-600"
        style={{
          // Đảm bảo ảnh trong content ko bị tràn
          overflowWrap: "break-word",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
          className="post-content-html"
        />
      </div>

      {/* CSS tùy chỉnh cho nội dung HTML (Cần thiết cho Tailwind) */}
      <style>{`
        .post-content-html h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .post-content-html p { margin-bottom: 1.25rem; color: #374151; line-height: 1.8; }
        .post-content-html ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .post-content-html li { margin-bottom: 0.5rem; }
        .post-content-html img { border-radius: 0.75rem; margin: 2rem 0; width: 100%; }
      `}</style>
    </article>
  );
};

export default PostDetail;
