import React from "react";
import { LaporanUdara } from "../types/cuaca";

interface Props {
  laporan: LaporanUdara;
}

const warnaUntukTingkat = (tingkat: LaporanUdara["tingkat"]) => {
  switch (tingkat) {
    case "BAIK":
      return "#2E7D32";
    case "SEDANG":
      return "#F9A825";
    case "TIDAK_SEHAT":
      return "#D84315";
    case "BERBAHAYA":
      return "#B71C1C";
    default:
      return "#000000";
  }
};

export const IndikatorAQI: React.FC<Props> = ({ laporan }) => {
  const { tingkat, indeksAQI } = laporan;
  const warna = warnaUntukTingkat(tingkat);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: warna,
          display: "inline-block",
        }}
        aria-hidden
      />
      <span style={{ color: warna }}>
        {tingkat.replace("_", " ")} — AQI: {indeksAQI}
      </span>
    </div>
  );
};

export default IndikatorAQI;
