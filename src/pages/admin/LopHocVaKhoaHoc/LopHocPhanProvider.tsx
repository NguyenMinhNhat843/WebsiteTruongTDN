import { useEffect, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { PAGE_SIZE } from "./constants";
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
      handleTabChange,
      handleFilter,
      pageSize: PAGE_SIZE,
    };
  },
);
