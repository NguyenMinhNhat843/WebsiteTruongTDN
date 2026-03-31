export const ROLE_LABEL = {
  ADMIN: "Quản trị viên",
  TEACHER: "Giáo viên",
  STAFF: "Nhân viên",
  STUDENT: "Học sinh",
  PARENT: "Phụ huynh",
};

export const ROLE_COLOR = {
  ADMIN: { bg: "#EEEDFE", text: "#3C3489", dot: "#534AB7", border: "#AFA9EC" },
  TEACHER: {
    bg: "#EAF3DE",
    text: "#27500A",
    dot: "#3B6D11",
    border: "#97C459",
  },
  STAFF: { bg: "#FAEEDA", text: "#633806", dot: "#854F0B", border: "#EF9F27" },
  STUDENT: {
    bg: "#E6F1FB",
    text: "#0C447C",
    dot: "#185FA5",
    border: "#85B7EB",
  },
  PARENT: { bg: "#FBEAF0", text: "#72243E", dot: "#993556", border: "#ED93B1" },
};

export const STATUS_COLOR = {
  active: { label: "Hoạt động", color: "#4ade80" },
  inactive: { label: "Không HĐ", color: "#94a3b8" },
  locked: { label: "Đã khoá", color: "#f87171" },
};
