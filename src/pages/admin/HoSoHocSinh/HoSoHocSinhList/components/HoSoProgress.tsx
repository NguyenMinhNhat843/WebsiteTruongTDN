import ProgressBar from "../../../../../components/ui/ProgressBar";

interface HoSoProgressProps {
  nop: number;
  chuaNop: number;
}
const HoSoProgress: React.FC<HoSoProgressProps> = ({ nop, chuaNop }) => {
  const total = nop + chuaNop;
  const pct = total === 0 ? 100 : Math.round((nop / total) * 100);
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <ProgressBar value={pct} max={100} />
    </div>
  );
};

export default HoSoProgress;
