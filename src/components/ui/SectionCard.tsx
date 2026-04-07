const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
      <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

export default SectionCard;
