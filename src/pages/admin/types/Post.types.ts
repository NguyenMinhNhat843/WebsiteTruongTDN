import type { ReactNode } from "react";

// ─── Domain types ─────────────────────────────────────────────────────────────

export type CategoryValue =
  | "thong-bao"
  | "tin-tuc"
  | "su-kien"
  | "hoc-tap"
  | "tuyen-sinh"
  | "tuyen-dung";

export type AudienceValue =
  | "Toàn trường"
  | "Học sinh"
  | "Giáo viên"
  | "Phụ huynh"
  | "Ban giám hiệu";

// ─── Form state ───────────────────────────────────────────────────────────────
export interface PostFormValues {
  title: string;
  category: CategoryValue | "";
  audience: AudienceValue[];
  content: string;
  tags: string[];
  coverImage: File | null;
  coverPreview: string | null;
  isPinned: boolean;
  isPublished: boolean;
  publishDate: string;
}

export interface FormErrors {
  title?: string;
  category?: string;
  content?: string;
  audience?: string;
}

// ### UI component props ─────────────────────────────────────────────────────────
export interface Category {
  value: CategoryValue;
  label: string;
  color: string;
}

export interface TagProps {
  label: string;
  onRemove: () => void;
}

export interface ToolbarButtonProps {
  icon: ReactNode;
  title: string;
  onClick: () => void;
}
