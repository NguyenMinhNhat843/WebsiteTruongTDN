interface SectionWrapperProps {
  children?: React.ReactNode;
  title?: string;
  Icon?: React.ElementType;
}

const SectionWrapper = ({ children, title, Icon }: SectionWrapperProps) => {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-100">
        {Icon && <Icon className="w-5 h-5 text-cyan-600" />}
        <h3 className="font-bold text-gray-800 text-sm">
          {title || "Tiêu đề phần"}
        </h3>
      </div>

      <div className="w-full p-6">{children}</div>
    </section>
  );
};

export default SectionWrapper;
