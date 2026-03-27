import { useState, useMemo, useCallback, useEffect } from "react";
import type {
  AudienceValue,
  CategoryValue,
  Post,
  Status,
} from "../types/Post.types";
import { MOCK_POSTS } from "../constants/postList.constant";
import { createContextProvider } from "../../../util/createContextProvider";

// Đảm bảo bạn export interface để dùng ở nơi khác nếu cần
export interface Filters {
  search: string;
  category: CategoryValue | "all";
  audience: AudienceValue | "all";
  status: Status | "all";
  dateFrom: string;
  dateTo: string;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "all",
  audience: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

const PAGE_SIZE = 8;

interface UsePostListOptions {
  pageSize?: number;
}

export const usePostList = ({
  pageSize = PAGE_SIZE,
}: UsePostListOptions = {}) => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [currentPage, setCurrentPage] = useState(1);

  const [posts, setPosts] = useState<{ items: Post[]; total: number }>({
    items: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Logic fetch data từ API (Hiện tại chưa có)
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // *** Logic này sau sẽ được thay bằng API call thực tế ***
      let result = [...MOCK_POSTS];
      // 1. Lọc theo search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (post) =>
            post.title?.toLowerCase().includes(searchLower) ||
            post.author?.toLowerCase().includes(searchLower),
        );
      }

      // 2. Lọc theo các trường khác
      if (filters.category !== "all") {
        result = result.filter((p) => p.category === filters.category);
      }
      if (filters.audience !== "all") {
        result = result.filter((p) => p.audience === filters.audience);
      }
      if (filters.status !== "all") {
        result = result.filter((p) => p.status === filters.status);
      }
      if (filters.dateFrom) {
        result = result.filter((p) => p.createdAt >= filters.dateFrom);
      }
      if (filters.dateTo) {
        result = result.filter((p) => p.createdAt <= filters.dateTo);
      }

      // Lưu lại tổng số record sau khi lọc (để làm phân trang)
      const totalCount = result.length;

      // 3. Phân trang (Pagination)
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedItems = result.slice(startIndex, startIndex + pageSize);
      // *** Hết logic giả lập API ***

      //  Cập nhật state
      setPosts({ items: paginatedItems, total: totalCount });
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, pageSize]);

  // Mỗi khi filter hoặc page thay đổi -> Gọi API mới
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Logic cập nhật filter
  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  // Logic Reset
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  // Đếm số lượng filter đang active
  const activeFilterCount = useMemo(() => {
    return [
      filters.category !== "all",
      filters.audience !== "all",
      filters.status !== "all",
      !!filters.dateFrom,
      !!filters.dateTo,
    ].filter(Boolean).length;
  }, [filters]);

  // Thống kê
  const stats = useMemo(
    () => ({
      total: posts.total,
      approved: posts.items.filter((p) => p.status === "da-duyet").length,
      pending: posts.items.filter((p) => p.status === "cho-duyet").length,
    }),
    [posts],
  );

  const totalPages = posts.total
    ? Math.max(1, Math.ceil(posts.total / pageSize))
    : 1;
  const paginated = posts.items;
  const total = posts.total;

  return {
    // filter state
    filters,
    setFilter,
    resetFilters,
    activeFilterCount,

    // pagination state
    currentPage,
    setCurrentPage,
    total,
    totalPages,
    pageSize,

    // loading state
    isLoading,

    // derived data
    paginated,
    stats,
  };
};

export const [PostListProvider, usePostListContext] =
  createContextProvider(usePostList);
