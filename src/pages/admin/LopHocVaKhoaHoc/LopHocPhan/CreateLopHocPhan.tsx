// import { useForm } from "react-hook-form";
// import { useLopHocPhanContext } from "./LopHocPhanProvider";
// import { Save, AlertCircle, Calendar, Users, GraduationCap, School } from "lucide-react";
// import { useAppContext } from "../../../../AppProvider";

// // Định nghĩa kiểu dữ liệu nội bộ khớp với type createLopHocPhan đã có của bạn
// interface FormValues {
//   semesterId: number;
//   subjectId: number;
//   classId?: number;
//   teacherId?: number;
//   maxStudents: number;
//   registrationStart?: string;
//   registrationEnd?: string;
// }

// const CreateLopHocPhan = () => {
//   // Giả định context của bạn cung cấp thêm data danh sách (semesters, subjects, classes, teachers) để chọn lựa
//   const {
//     createLopHocPhan,
//     isCreatingLopHocPhan,
//   } = useLopHocPhanContext();
//   const {hocKysData: semesters} = useAppContext()

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       maxStudents: 50, // Giá trị mặc định phổ biến cho lớp học phần
//     }
//   });

//   const onSubmit = (data: FormValues) => {
//     // Gọi API từ openapi react-query theo đúng chuẩn cấu trúc object body
//     createLopHocPhan(
//       {
//         body: data,
//       },
//       {
//         onSuccess: () => {
//           alert("Tạo lớp học phần thành công!");
//           reset();
//         },
//         onError: (err) => {
//           alert("Đã xảy ra lỗi khi tạo lớp học phần.");
//           console.error(err);
//         }
//       }
//     );
//   };

//   return (
//     <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">

//       {/* Tiêu đề vùng nhập liệu */}
//       <div className="mb-6 pb-4 border-b border-slate-100">
//         <h3 className="text-lg font-bold text-slate-800">Thông tin khởi tạo lớp học phần</h3>
//         <p className="text-sm text-slate-400 mt-0.5">Thiết lập học kỳ, môn học, giảng viên và thời gian đăng ký cho lớp học mới.</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//         {/* Hàng 1: Học kỳ & Môn học (Bắt buộc - 2 Cột) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Học kỳ */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
//               <Calendar className="w-4 h-4 text-slate-400" />
//               Học kỳ <span className="text-rose-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 {...register("semesterId", {
//                   required: "Vui lòng chọn học kỳ",
//                   valueAsNumber: true
//                 })}
//                 className={`w-full p-2.5 pr-10 text-base border rounded-lg bg-slate-50/40 focus:bg-white outline-none transition-all appearance-none cursor-pointer text-slate-700
//                   ${errors.semesterId ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"}`}
//               >
//                 <option value="">-- Chọn học kỳ --</option>
//                 {semesters?.map((s) => (
//                   <option key={s.id} value={s.id}>{s.name || `Học kỳ ${s.id}`}</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//             {errors.semesterId && (
//               <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium pl-0.5">
//                 <AlertCircle className="w-3.5 h-3.5" />
//                 <span>{errors.semesterId.message}</span>
//               </div>
//             )}
//           </div>

//           {/* Môn học */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
//               <GraduationCap className="w-4 h-4 text-slate-400" />
//               Môn học <span className="text-rose-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 {...register("subjectId", {
//                   required: "Vui lòng chọn môn học",
//                   valueAsNumber: true
//                 })}
//                 className={`w-full p-2.5 pr-10 text-base border rounded-lg bg-slate-50/40 focus:bg-white outline-none transition-all appearance-none cursor-pointer text-slate-700
//                   ${errors.subjectId ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"}`}
//               >
//                 <option value="">-- Chọn môn học --</option>
//                 {subjects?.map((sub: any) => (
//                   <option key={sub.id} value={sub.id}>{sub.subjectName} ({sub.subjectCode})</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//             {errors.subjectId && (
//               <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium pl-0.5">
//                 <AlertCircle className="w-3.5 h-3.5" />
//                 <span>{errors.subjectId.message}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Hàng 2: Lớp sinh viên hành chính, Giảng viên & Sĩ số tối đa (3 Cột) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {/* Lớp hành chính (Optional) */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
//               <School className="w-4 h-4 text-slate-400" />
//               Lớp danh nghĩa <span className="text-slate-400 font-normal">(Tùy chọn)</span>
//             </label>
//             <div className="relative">
//               <select
//                 {...register("classId", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full p-2.5 pr-10 text-base border border-slate-200 rounded-lg bg-slate-50/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-700"
//               >
//                 <option value="">-- Chọn lớp học --</option>
//                 {classes?.map((c: any) => (
//                   <option key={c.id} value={c.id}>{c.className}</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//           </div>

//           {/* Giảng viên (Optional) */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
//               <Users className="w-4 h-4 text-slate-400" />
//               Giảng viên phụ trách <span className="text-slate-400 font-normal">(Tùy chọn)</span>
//             </label>
//             <div className="relative">
//               <select
//                 {...register("teacherId", {
//                   setValueAs: (v) => v === "" ? undefined : Number(v)
//                 })}
//                 className="w-full p-2.5 pr-10 text-base border border-slate-200 rounded-lg bg-slate-50/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-700"
//               >
//                 <option value="">-- Chọn giảng viên --</option>
//                 {teachers?.map((t: any) => (
//                   <option key={t.id} value={t.id}>{t.fullName}</option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//           </div>

//           {/* Sĩ số sinh viên tối đa */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5">
//               Số lượng sinh viên tối đa <span className="text-rose-500">*</span>
//             </label>
//             <input
//               type="number"
//               {...register("maxStudents", {
//                 required: "Vui lòng nhập sĩ số tối đa",
//                 valueAsNumber: true,
//                 min: { value: 1, message: "Sĩ số phải lớn hơn 0" }
//               })}
//               placeholder="VD: 50"
//               className={`w-full p-2.5 text-base border rounded-lg outline-none transition-all bg-slate-50/40 focus:bg-white
//                 ${errors.maxStudents ? "border-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"}`}
//             />
//             {errors.maxStudents && (
//               <div className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium pl-0.5">
//                 <AlertCircle className="w-3.5 h-3.5" />
//                 <span>{errors.maxStudents.message}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Hàng 3: Thời gian đăng ký (Bắt đầu / Kết thúc - 2 Cột) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Thời gian bắt đầu */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5">
//               Thời gian bắt đầu đăng ký <span className="text-slate-400 font-normal">(Tùy chọn)</span>
//             </label>
//             <input
//               type="datetime-local"
//               {...register("registrationStart", {
//                 setValueAs: (v) => v === "" ? undefined : v
//               })}
//               className="w-full p-2.5 text-base border border-slate-200 rounded-lg outline-none transition-all bg-slate-50/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700"
//             />
//           </div>

//           {/* Thời gian kết thúc */}
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5">
//               Thời gian kết thúc đăng ký <span className="text-slate-400 font-normal">(Tùy chọn)</span>
//             </label>
//             <input
//               type="datetime-local"
//               {...register("registrationEnd", {
//                 setValueAs: (v) => v === "" ? undefined : v
//               })}
//               className="w-full p-2.5 text-base border border-slate-200 rounded-lg outline-none transition-all bg-slate-50/40 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700"
//             />
//           </div>
//         </div>

//         {/* Nút hành động */}
//         <div className="pt-4 border-t border-slate-100 flex gap-3">
//           <button
//             type="submit"
//             disabled={isCreatingLopHocPhan}
//             className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.99]"
//           >
//             {isCreatingLopHocPhan ? (
//               <span className="inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <Save className="w-4 h-4" />
//             )}
//             Lưu thông tin lớp học phần
//           </button>

//           <button
//             type="button"
//             onClick={() => reset()}
//             disabled={isCreatingLopHocPhan}
//             className="px-6 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.99]"
//           >
//             Hủy / Nhập lại
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// };

// export default CreateLopHocPhan;
