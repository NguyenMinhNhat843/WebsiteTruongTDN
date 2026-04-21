import { useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";

export const [CreateNhanVienProvider, useCreateNhanVienContext] =
  createContextProvider(() => {
    const [formData, setFormData] = useState({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      address: "",
      role: "STAFF",
    });

    const handleSubmit = () => {
      console.log("Dữ liệu nhân viên mới:", formData);
      // Xử lý logic submit tại đây
    };

    return {
      formData,
      setFormData,
      handleSubmit,
    };
  });
