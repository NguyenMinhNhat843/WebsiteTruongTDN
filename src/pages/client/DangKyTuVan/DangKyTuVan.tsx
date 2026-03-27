import CauHoiThuongGap from "./components/CauHoiThuongGap";
import ConsultationForm from "./components/ConsulationForm";

const DangKyTuVan = () => {
  return (
    <section className="relative min-h-screen bg-slate-50 py-16 px-4 md:px-8 overflow-hidden">
      {/* Decor mờ phía sau */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-6">
            <CauHoiThuongGap />
          </div>

          <div className="lg:col-span-6">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DangKyTuVan;
