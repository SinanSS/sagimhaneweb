"use client";

import { Lock, Milk, Tag, Timer, User } from "lucide-react";
import { StallData } from "../types";

interface StallCardProps {
  stall: StallData;
}

const getStatusConfig = (status: StallData["status"]) => {
  switch (status) {
    case "empty":
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        badge: "bg-gray-400 text-white",
        label: "Boş",
      };
    case "milking":
      return {
        bg: "bg-blue-50",
        border: "border-blue-500",
        badge: "bg-blue-600 text-white",
        label: "Sağım Yapılıyor",
      };
    case "completed":
      return {
        bg: "bg-green-50",
        border: "border-green-500",
        badge: "bg-green-600 text-white",
        label: "Tamamlandı",
      };
    case "error":
      return {
        bg: "bg-red-50",
        border: "border-red-500",
        badge: "bg-red-600 text-white",
        label: "Hata",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        badge: "bg-gray-400 text-white",
        label: "Boş",
      };
  }
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export function StallCard({ stall }: StallCardProps) {
  const config = getStatusConfig(stall.status);
  const isActive = stall.status === "milking" || stall.status === "completed";

  return (
    <div
      className={`
        relative flex flex-col
        rounded-lg border-2 p-5 transition-all shadow-md
        ${config.bg} ${config.border}
        h-full
      `}
    >
      {/* Üst Kısım: Bölme No ve Durum Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Milk className="w-5 h-5 text-gray-600" />
          <span className="text-gray-900 font-semibold text-lg">
            Bölme {stall.id}
          </span>
        </div>
        <div
          className={`
          px-4 py-2 rounded-full text-sm font-semibold tracking-wide
          ${config.badge}
          shadow-sm
        `}
        >
          {config.label}
        </div>
      </div>

      {/* Orta Kısım: Süt Miktarı */}
      <div className="text-center mb-4 py-4">
        <div className="flex items-end justify-center gap-2">
          <span className="text-6xl font-bold text-gray-900 leading-none">
            {stall.milkAmount.toFixed(2)}
          </span>
          <span className="text-2xl font-medium text-gray-600 pb-1">L</span>
        </div>

        {/* Sağım ilerlemesi göstergesi */}
        {stall.status === "milking" && (
          <div className="w-full mt-4 px-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000 rounded-full"
                style={{
                  width: `${Math.min((stall.milkAmount / 25) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Alt Kısım: Küpe No / Adı / Süre */}
      {isActive && (
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            {/* Küpe No */}
            {stall.animalTag && (
              <div className="flex flex-col items-center justify-center bg-white/60 rounded-lg py-2 px-1 border border-gray-200 min-h-[72px]">
                <Tag className="w-4 h-4 text-gray-500 mb-0.5 shrink-0" />
                <span className="text-md text-gray-500">Küpe No</span>
                <span className="font-bold text-gray-900 text-lg text-center leading-tight">
                  {stall.animalTag}
                </span>
              </div>
            )}

            {/* Adı */}
            {stall.animalName && (
              <div className="flex flex-col items-center justify-center bg-white/60 rounded-lg py-2 px-1 border border-gray-200 min-h-[72px]">
                <User className="w-4 h-4 text-gray-500 mb-0.5 shrink-0" />
                <span className="text-md text-gray-500">Adı</span>
                <span className="font-bold text-gray-900 text-lg text-center leading-tight truncate w-full">
                  {stall.animalName}
                </span>
              </div>
            )}

            {/* Süre */}
            <div className="flex flex-col items-center justify-center bg-white/60 rounded-lg py-2 px-1 border border-gray-200 min-h-[72px]">
              <Timer className="w-4 h-4 text-gray-500 mb-0.5 shrink-0" />
              <span className="text-md text-gray-500">Süre</span>
              <span className="font-mono font-bold text-gray-900 text-xl leading-tight">
                {formatDuration(stall.duration)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Boş durum */}
      {stall.status === "empty" && (
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500 font-medium text-sm">Bekleniyor</div>
          </div>
        </div>
      )}
    </div>
  );
}
