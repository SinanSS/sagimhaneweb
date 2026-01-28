"use client";

import { memo } from "react";
import { StallData } from "../types";

interface MobileStallCardProps {
  stall: StallData;
}

const getStatusConfig = (status: StallData["status"]) => {
  switch (status) {
    case "milking":
      return {
        bg: "bg-green-100",
        border: "border-green-500",
        text: "text-green-900",
        label: "Sağılıyor",
      };
    case "waiting":
      return {
        bg: "bg-amber-50",
        border: "border-amber-400",
        text: "text-amber-900",
        label: "Beklemede",
      };
    case "ignored":
      return {
        bg: "bg-red-50",
        border: "border-red-400",
        text: "text-red-900",
        label: "İhmal",
      };
    case "completed":
      return {
        bg: "bg-blue-100",
        border: "border-blue-500",
        text: "text-blue-900",
        label: "Tamamlandı",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-900",
        label: "Bilinmiyor",
      };
  }
};



export const MobileStallCard = memo(function MobileStallCard({ stall }: MobileStallCardProps) {
  const config = getStatusConfig(stall.status);

  return (
    <div
      className={`
        flex flex-col justify-between
        h-full w-full
        rounded-lg border-2 p-2
        ${config.bg} ${config.border}
      `}
    >
      {/* Üst Satır: Stall No - Saat Kaldırıldı */}
      <div className="flex items-center justify-start w-full">
        <span className={`text-xl font-bold ${config.text} opacity-80`}>
          #{stall.id}
        </span>
      </div>

      {/* Orta: Büyük Litre Değeri */}
      <div className="flex items-end justify-center py-1">
        <span className={`text-6xl font-black tracking-tighter ${config.text} leading-none`}>
          {stall.milkAmount.toFixed(1)}
        </span>
        <span className={`text-2xl font-bold mb-1 ml-1 ${config.text} opacity-70`}>L</span>
      </div>

      {/* Alt: Hayvan Bilgisi (Küpe No) */}
      <div className="flex items-center justify-center w-full bg-white/60 rounded px-2 py-1">
        <span className={`text-xl font-bold truncate ${config.text}`}>
          {stall.animal?.tag || "---"}
        </span>
      </div>
    </div>
  );
});
