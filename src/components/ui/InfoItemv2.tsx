import type { FunctionComponent } from "react";

interface InfoItemv2Props {
  label: string;
  value: string | number | null;
}

const InfoItemv2: FunctionComponent<InfoItemv2Props> = ({ label, value }) => (
  <div>
    <p className="text-cyan-100 text-[10px] uppercase mb-0.5">{label}</p>
    <p className="font-semibold text-sm">{value}</p>
  </div>
);

export default InfoItemv2;
