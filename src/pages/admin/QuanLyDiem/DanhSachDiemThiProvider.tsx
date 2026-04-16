import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";

export const [DanhSachDiemThiProvider, useDanhSachDiemThiContext] =
  createContextProvider(() => {
    const [openModalImportExcel, setOpenModalImportExcel] = useState(false);
    const [openLichSuThaoTac, setOpenLichSuThaoTac] = useState(false);

    return {
      openLichSuThaoTac,
      setOpenLichSuThaoTac,
      openModalImportExcel,
      setOpenModalImportExcel,
    };
  });
