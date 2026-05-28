import { useState } from "react";
import { $api } from "../../../api/client";
import { createContextProvider } from "../../../util/createContextProvider";
import type { components, paths } from "../../../api/v1";

export type SearchAccountDto =
  paths["/auth/accounts"]["get"]["parameters"]["query"];
export type AccountResponseDto = components["schemas"]["AccountResponseDto"];

export const [QuanLyTaiKhoanProvider, useQuanLyTaiKhoanContext] =
  createContextProvider(() => {
    const [filterAccount, setFilterAccount] = useState<SearchAccountDto>({
      role: undefined,
    });

    /**
     * Lấy account theo role
     */
    const {
      data: accounts,
      isLoading: isLoadingAccounts,
      error: errorAccounts,
    } = $api.useQuery("get", "/auth/accounts", {
      params: {
        query: {
          ...filterAccount,
        },
      },
    });

    return {
      accounts,
      isLoadingAccounts,
      errorAccounts,

      // state
      filterAccount,
      setFilterAccount,
    };
  });
