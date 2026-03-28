import { useState, useRef } from "react";
import type { ChangeEvent, KeyboardEvent, FormEvent } from "react";
import type {
  AudienceValue,
  CategoryValue,
  PostFormValues,
} from "../types/Post.types";
import { usePostValidation } from "./usePostValidation";

const MAX_TAGS = 8;

// ─── Return type ──────────────────────────────────────────────────────────────

interface UsePostFormReturn {
  // State
  values: PostFormValues;
  tagInput: string;
  submitted: boolean;
  wordCount: number;
  charCount: number;

  // Refs (cần thiết cho insertFormat, vì phải truy cập DOM)
  fileRef: React.RefObject<HTMLInputElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;

  // Validation
  errors: ReturnType<typeof usePostValidation>["errors"];

  // Handlers
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleContentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: CategoryValue) => void;
  handleAudienceToggle: (value: AudienceValue) => void;
  handleTagInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTagKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleRemoveTag: (tag: string) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveCoverImage: () => void;
  handleTogglePinned: () => void;
  handleTogglePublished: () => void;
  handlePublishDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInsertFormat: (before: string, after?: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_VALUES: PostFormValues = {
  title: "",
  category: "",
  audience: [],
  content: "",
  tags: [],
  coverImage: null,
  coverPreview: null,
  isPinned: false,
  isPublished: true,
  publishDate: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePostForm(): UsePostFormReturn {
  const [values, setValues] = useState<PostFormValues>(INITIAL_VALUES);
  const [tagInput, setTagInput] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { errors, validate, clearError, clearAllErrors } = usePostValidation();

  // ── Derived ──────────────────────────────────────────────────────────────────

  const wordCount = values.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = values.content.length;

  // ── Field helpers ─────────────────────────────────────────────────────────────

  const setField = <K extends keyof PostFormValues>(
    key: K,
    value: PostFormValues[K],
  ): void => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setField("title", e.target.value);
    clearError("title");
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setField("content", e.target.value);
    clearError("content");
  };

  const handleCategoryChange = (value: CategoryValue): void => {
    setField("category", value);
    clearError("category");
  };

  const handleAudienceToggle = (value: AudienceValue): void => {
    setValues((prev) => ({
      ...prev,
      audience: prev.audience.includes(value)
        ? prev.audience.filter((a) => a !== value)
        : [...prev.audience, value],
    }));
    clearError("audience");
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, "");
      if (val && !values.tags.includes(val) && values.tags.length < MAX_TAGS) {
        setField("tags", [...values.tags, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string): void => {
    setField(
      "tags",
      values.tags.filter((t) => t !== tag),
    );
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValues((prev) => ({
      ...prev,
      coverImage: file,
      coverPreview: URL.createObjectURL(file),
    }));
  };

  const handleRemoveCoverImage = (): void => {
    setValues((prev) => ({ ...prev, coverImage: null, coverPreview: null }));
  };

  const handleTogglePinned = (): void => {
    setField("isPinned", !values.isPinned);
  };

  const handleTogglePublished = (): void => {
    setField("isPublished", !values.isPublished);
  };

  const handlePublishDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setField("publishDate", e.target.value);
  };

  /**
   * Chèn markdown vào vị trí con trỏ trong textarea.
   * Cần ref trực tiếp vào DOM element nên phải để trong hook này.
   */
  const handleInsertFormat = (before: string, after: string = ""): void => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = values.content.substring(start, end);
    const newContent =
      values.content.substring(0, start) +
      before +
      selected +
      after +
      values.content.substring(end);

    setField("content", newContent);

    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const isValid = validate({
      title: values.title,
      category: values.category,
      content: values.content,
      audience: values.audience,
    });
    if (!isValid) return;
    setSubmitted(true);
  };

  const handleReset = (): void => {
    setValues(INITIAL_VALUES);
    setTagInput("");
    setSubmitted(false);
    clearAllErrors();
  };

  return {
    values,
    tagInput,
    submitted,
    wordCount,
    charCount,
    fileRef,
    textareaRef,
    errors,
    handleTitleChange,
    handleContentChange,
    handleCategoryChange,
    handleAudienceToggle,
    handleTagInputChange,
    handleTagKeyDown,
    handleRemoveTag,
    handleImageUpload,
    handleRemoveCoverImage,
    handleTogglePinned,
    handleTogglePublished,
    handlePublishDateChange,
    handleInsertFormat,
    handleSubmit,
    handleReset,
  };
}
