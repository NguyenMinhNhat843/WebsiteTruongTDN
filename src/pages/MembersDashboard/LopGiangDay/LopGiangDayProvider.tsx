import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const [LopGiangDayProvider, useLopGiangDayContext] =
  createContextProvider(() => {
    // Khi chọn 1 class sẽ mở modal thông tin chi tiết
    const [classSelected, setClassSelected] = useState<any | null>(null);
    const [openModalLichSu, setOpenModalLichSu] = useState<any | null>(null);

    return {
      classSelected,
      setClassSelected,
      openModalLichSu,
      setOpenModalLichSu,
    };
  });
