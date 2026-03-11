export interface IPost {
  id?: string;
  title?: string;
  slug?: string;
  image?: string;
  summary?: string;
  content?: string; // Nội dung HTML
  status?: string;
  published_at?: string;
}
