import { useCallback, useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import type { FilterState, HocSinhRow, SortState, ViewMode } from "./mockType";
import { MOCK_DATA } from "./mockData/mockData";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

export const [HoSoHocSinhProvider, useHoSoHocSinhContext] =
  createContextProvider(() => {
    const navigate = useNavigate();
    const [data] = useState<HocSinhRow[]>(MOCK_DATA);
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<FilterState>({
      heDaoTao: "",
      trangThai: "",
      lop: "",
      hocBong: "",
      hoSoThieu: "",
    });
    const [sort, setSort] = useState<SortState>({
      field: "maSoHocSinh",
      dir: "asc",
    });
    const [page, setPage] = useState<number>(1);
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    // ── Unique lop list ───────────────────────────────────────────────────────
    const lopList = useMemo<string[]>(
      () => [...new Set(data.map((r) => r.lop))].sort(),
      [data],
    );

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = useMemo(
      () => ({
        total: data.length,
        dangHoc: data.filter((r) => r.trangThai === "Đang học").length,
        hoSoThieu: data.filter((r) => r.soGiayToChuaNop > 0).length,
        hocBong: data.filter((r) => r.hocBong).length,
      }),
      [data],
    );

    // ── Filter & sort ─────────────────────────────────────────────────────────
    const filtered = useMemo<HocSinhRow[]>(() => {
      let rows = [...data];

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        rows = rows.filter(
          (r) =>
            r.hoTen.toLowerCase().includes(q) ||
            r.maSoHocSinh.toLowerCase().includes(q) ||
            r.soDienThoai.includes(q) ||
            r.lop.toLowerCase().includes(q),
        );
      }
      if (filter.heDaoTao)
        rows = rows.filter((r) => r.heDaoTao === filter.heDaoTao);
      if (filter.trangThai)
        rows = rows.filter((r) => r.trangThai === filter.trangThai);
      if (filter.lop) rows = rows.filter((r) => r.lop === filter.lop);
      if (filter.hocBong === "co") rows = rows.filter((r) => r.hocBong);
      if (filter.hocBong === "khong") rows = rows.filter((r) => !r.hocBong);
      if (filter.hoSoThieu === "co")
        rows = rows.filter((r) => r.soGiayToChuaNop > 0);
      if (filter.hoSoThieu === "khong")
        rows = rows.filter((r) => r.soGiayToChuaNop === 0);

      if (sort.field) {
        rows.sort((a, b) => {
          const av = a[sort.field as keyof HocSinhRow];
          const bv = b[sort.field as keyof HocSinhRow];
          const cmp = String(av).localeCompare(String(bv), "vi");
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }

      return rows;
    }, [data, search, filter, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pageItems = filtered.slice(
      (safePage - 1) * ITEMS_PER_PAGE,
      safePage * ITEMS_PER_PAGE,
    );

    const handleSort = useCallback((field: keyof HocSinhRow) => {
      setSort((prev) =>
        prev.field === field
          ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
          : { field, dir: "asc" },
      );
      setPage(1);
    }, []);

    const handleSearch = (v: string) => {
      setSearch(v);
      setPage(1);
    };
    const handleFilter = <K extends keyof FilterState>(
      k: K,
      v: FilterState[K],
    ) => {
      setFilter((prev) => ({ ...prev, [k]: v }));
      setPage(1);
    };
    const resetFilter = () => {
      setFilter({
        heDaoTao: "",
        trangThai: "",
        lop: "",
        hocBong: "",
        hoSoThieu: "",
      });
      setPage(1);
    };

    const activeFiltersCount = Object.values(filter).filter(Boolean).length;

    // ── Select all ────────────────────────────────────────────────────────────
    const allPageSelected =
      pageItems.length > 0 && pageItems.every((r) => selected.has(r.id));
    const toggleSelectAll = () => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (allPageSelected) pageItems.forEach((r) => next.delete(r.id));
        else pageItems.forEach((r) => next.add(r.id));
        return next;
      });
    };
    const toggleSelect = (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    };

    return {
      toggleSelect,
      allPageSelected,
      toggleSelectAll,
      activeFiltersCount,
      resetFilter,
      handleFilter,
      handleSearch,
      handleSort,
      data,
      search,
      setSearch,
      totalPages,
      safePage,
      pageItems,
      viewMode,
      setViewMode,
      showFilter,
      setShowFilter,
      selected,
      stats,
      lopList,
      filter,
      setSelected,
      filtered,
      sort,
      setPage,

      navigate,
    };
  });
