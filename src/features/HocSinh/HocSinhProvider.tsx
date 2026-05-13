import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createContextProvider } from "../../util/createContextProvider";
import { $api } from "../../api/client";
import type { components } from "../../api/v1";

export type HocSinhDto = components["schemas"]["StudentResponseDto"];

export const [HocSinhProvider, useHocSinhContext] = createContextProvider(
  () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // get students
    const { data: students } = $api.useQuery("get", "/students");

    // delete student
    const { mutate: deleteStudent, isPending: isDeletingStudent } =
      $api.useMutation("delete", "/students/{id}", {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/students"] });
        },
      });

    return {
      students: students || [],
      deleteStudent,
      isDeletingStudent,

      navigate,
    };
  },
);
