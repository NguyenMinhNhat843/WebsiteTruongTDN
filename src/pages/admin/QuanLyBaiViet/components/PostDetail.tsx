import type { Post } from "../../../../features/posts/types/Post.types";

interface PostDetailViewProps {
  post?: Post | null;
}

const PostDetailView = ({ post }: PostDetailViewProps) => {
  if (!post) {
    return null;
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

export default PostDetailView;
