import ContactInfo from "./components/ContactInfo";
import DiaChi from "./components/DiaChi";

const LienHe = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <ContactInfo />

      {/* Tiêu đề có đường kẻ ngang 2 bên */}
      <div className="flex items-center mt-16 mb-8">
        <div className="grow h-px bg-slate-200"></div>
        <h2 className="px-6 text-2xl font-bold text-blue-900 uppercase tracking-wide">
          Địa chỉ trụ sở
        </h2>
        <div className="grow h-px bg-slate-200"></div>
      </div>

      <DiaChi />
    </div>
  );
};

export default LienHe;
