import { useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import type { EducationSystem, Student, StudentStatus } from "./type";
import { INITIAL_MAJORS, MOCK_STUDENTS } from "./mockData";

export const [XetTotNghiepProvider, useXetTotNghiepContext] =
  createContextProvider(() => {
    const [openModelOne, setOpenModelOne] = useState(false);
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterSystem, setFilterSystem] = useState<EducationSystem | "All">(
      "All",
    );
    const [filterStatus, setFilterStatus] = useState<StudentStatus | "All">(
      "All",
    );
    const [filterMajor, setFilterMajor] = useState<string>("All");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State cho sinh viên mới
    const [newStudent, setNewStudent] = useState<Partial<Student>>({
      system: "Trung cấp",
      status: "Đang xem xét",
      vocationalCert: false,
      major: INITIAL_MAJORS[0],
    });

    // Logic lọc dữ liệu tổng hợp
    const filteredStudents = useMemo(() => {
      return students.filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id.includes(searchTerm);
        const matchesSystem =
          filterSystem === "All" || s.system === filterSystem;
        const matchesStatus =
          filterStatus === "All" || s.status === filterStatus;
        const matchesMajor = filterMajor === "All" || s.major === filterMajor;
        return matchesSearch && matchesSystem && matchesStatus && matchesMajor;
      });
    }, [students, searchTerm, filterSystem, filterStatus, filterMajor]);

    const handleAddStudent = (e: React.FormEvent) => {
      e.preventDefault();
      const studentToAdd = {
        ...newStudent,
        id: `SV${Math.floor(100 + Math.random() * 900)}`,
      } as Student;

      setStudents([studentToAdd, ...students]);
      setIsModalOpen(false);
      setNewStudent({
        system: "Trung cấp",
        status: "Đang xem xét",
        vocationalCert: false,
        major: INITIAL_MAJORS[0],
      });
    };

    return {
      students,
      setStudents,
      filterSystem,
      setFilterMajor,
      setFilterSystem,
      searchTerm,
      setSearchTerm,
      filterStatus,
      setFilterStatus,
      filterMajor,
      isModalOpen,
      setIsModalOpen,
      newStudent,
      setNewStudent,
      filteredStudents,
      handleAddStudent,
      openModelOne,
      setOpenModelOne,
    };
  });
