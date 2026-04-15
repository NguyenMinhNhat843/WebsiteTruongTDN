import { useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { PAGE_SIZE } from "./constants";
import { HE_DAO_TAO, SAMPLE_DATA } from "./mockData";
import type { LopHoc } from "./mockType";

export const [LopHocVaKhoaHocProvider, useLopHocVaKhoaHocContext] =
  createContextProvider(() => {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [fKhoa, setFKhoa] = useState("");
    const [fStatus, setFStatus] = useState("");
    const [fNganh, setFNganh] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [detail, setDetail] = useState<LopHoc | null>(null);

    const filtered = useMemo(() => {
      return SAMPLE_DATA.filter((r) => {
        if (activeTab !== "all" && r.he !== activeTab) return false;
        if (fKhoa && r.khoa !== fKhoa) return false;
        if (fStatus && r.status !== fStatus) return false;
        if (fNganh && r.nganh !== fNganh) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !r.ma.toLowerCase().includes(q) &&
            !r.ten.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      });
    }, [activeTab, fKhoa, fStatus, fNganh, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageData = filtered
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      .map((r, i) => ({
        ...r,
        stt: ((page - 1) * PAGE_SIZE + i + 1).toString(),
      }));

    const stats = useMemo(() => {
      const active = SAMPLE_DATA.filter((r) => r.status === "Đang học").length;
      const total = SAMPLE_DATA.reduce((s, r) => s + r.siso, 0);
      const avgFill = Math.round(
        (SAMPLE_DATA.reduce((s, r) => s + r.siso / r.max, 0) /
          SAMPLE_DATA.length) *
          100,
      );
      return {
        total: SAMPLE_DATA.length,
        active,
        students: total.toLocaleString("vi-VN"),
        fill: avgFill + "%",
      };
    }, []);

    const handleTabChange = (key: string) => {
      setActiveTab(key);
      setPage(1);
    };
    const handleFilter = () => setPage(1);

    const tabCounts = useMemo(() => {
      const counts: Record<string, number> = { all: SAMPLE_DATA.length };
      Object.keys(HE_DAO_TAO).forEach((k) => {
        counts[k] = SAMPLE_DATA.filter((r) => r.he === k).length;
      });
      return counts;
    }, []);

    return {
      activeTab,
      setActiveTab,
      fKhoa,
      setFKhoa,
      fStatus,
      setFStatus,
      fNganh,
      setFNganh,
      search,
      setSearch,
      page,
      setPage,
      showCreate,
      setShowCreate,
      detail,
      setDetail,
      filtered,
      totalPages,
      pageData,
      stats,
      handleTabChange,
      handleFilter,
      tabCounts,
      pageSize: PAGE_SIZE,
    };
  });
