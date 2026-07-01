const InfoItemVertical = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="text-sm">
    <span className="text-gray-400 text-xs">{label}: </span>
    <span className="font-semibold text-gray-800 block sm:inline">
      {value || "---"}
    </span>
  </div>
);
export default InfoItemVertical;
