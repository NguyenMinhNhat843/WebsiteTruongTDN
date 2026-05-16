import { useEffect, useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { PAGE_SIZE } from "./constants";
import { SAMPLE_DATA } from "./mockData";
import type { LopHoc } from "./mockType";
import { $api } from "../../../api/client";
import { useAppContext } from "../../../AppProvider";

export const [LopHocPhanProvider, useLopHocPhanContext] = createContextProvider(
  () => {
    const { hocKysData } = useAppContext();
    // state
    const [hocKyIdSelected, setHocKyIdSelected] = useState<number | null>(null);

    useEffect(() => {
      setHocKyIdSelected(
        hocKysData.find((hk) => hk.isCurrent)?.id || hocKysData[0]?.id,
      );
    }, [hocKysData]);

    // get all lớp học phần
    const { data: lopHocPhans, isLoading: isLoadingLopHocPhans } =
      $api.useQuery("get", "/course-offers");

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

    return {
      lopHocPhans,
      isLoadingLopHocPhans,

      // state
      hocKyIdSelected,
      setHocKyIdSelected,
      hocKysData,

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
      pageSize: PAGE_SIZE,
    };
  },
);
