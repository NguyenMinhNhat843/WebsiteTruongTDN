import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";

export const [KhoaProvider, useKhoaContext] = createContextProvider(() => {
  const [openModalThietLapKhoa, setOpenModalThietLapKhoa] = useState(false);
  const [openModalCreateKhoa, setOpenModalCreateKhoa] = useState(false);

  return {
    openModalThietLapKhoa,
    setOpenModalThietLapKhoa,
    openModalCreateKhoa,
    setOpenModalCreateKhoa,
  };
});
