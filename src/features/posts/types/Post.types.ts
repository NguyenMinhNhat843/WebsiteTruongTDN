import type { ReactNode } from "react";

// ─── Domain types ─────────────────────────────────────────────────────────────

export type CategoryValue =
  | "thong-bao"
  | "tin-tuc"
  | "su-kien"
  | "hoc-tap"
  | "tuyen-sinh"
  | "tuyen-dung";

export type AudienceValue = "toan-truong" | "hoc-sinh" | "giao-vien";
export type Status = "cho-duyet" | "da-duyet";

export interface Post {
  id?: string;
  title?: string;
  slug?: string;
  category?: CategoryValue;
  audience?: AudienceValue;
  image?: string;
  summary?: string;
  content?: string; // Nội dung HTML
  author?: string;
  status?: Status;
  published_at?: string;
  createdAt: string; // ISO date string
  views?: number;
}

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
