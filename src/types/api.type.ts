export type CategoryPost =
  | "Tin tuyển sinh"
  | "Tin tức - Sự kiện"
  | "Tin tuyển dụng";

export interface Post {
  id?: string;
  title?: string;
  slug?: string;
  category?: CategoryPost;
  image?: string;
  summary?: string;
  content?: string; // Nội dung HTML
  status?: string;
  published_at?: string;
}
