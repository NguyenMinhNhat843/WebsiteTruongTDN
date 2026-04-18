import { CheckCircle, Download, Upload, XCircle } from "lucide-react";
import { useHoSoTuyenSinhOneContext } from "../HoSoTuyenSinhOneProvider";
import SectionWrapper from "../../../../../components/ui/SectionWrapper";

const SectionHoSoDinhKem = () => {
  const { applicant } = useHoSoTuyenSinhOneContext();
  if (!applicant) {
    return null;
  }
  return (
    <SectionWrapper title="Hồ sơ đính kèm" Icon={Upload}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {applicant.documents.map((doc, index) => (
          <div
            key={index}
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
              doc.uploaded
                ? "bg-white border-gray-100 hover:border-cyan-200"
                : "bg-red-50 border-red-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${doc.uploaded ? "bg-green-50 text-green-600" : "bg-red-100 text-red-600"}`}
              >
                {doc.uploaded ? (
                  <CheckCircle size={18} />
                ) : (
                  <XCircle size={18} />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {doc.name}
              </span>
            </div>
            {doc.uploaded && (
              <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default SectionHoSoDinhKem;
