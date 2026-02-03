"use client";

import { Tag, Timer } from "lucide-react";
import { StallData } from "../types";

interface StallCardProps {
  stall: StallData;
}

const getStatusConfig = (status: StallData["status"]) => {
  switch (status) {
    case "milking":
      return {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        border: "border-green-500 shadow-green-200",
        badge: "bg-green-600 text-white",
        glow: "shadow-sm shadow-green-200",
        label: "Sağılıyor",
      };
    case "waiting":
      return {
        bg: "bg-gradient-to-br from-amber-50 to-amber-100",
        border: "border-amber-500 shadow-amber-200",
        badge: "bg-amber-600 text-white",
        glow: "shadow-sm shadow-amber-200",
        label: "Beklemede",
      };
    case "ignored":
      return {
        bg: "bg-gradient-to-br from-red-50 to-red-100",
        border: "border-red-500 shadow-red-200",
        badge: "bg-red-600 text-white",
        glow: "shadow-sm shadow-red-200",
        label: "İhmal Edilecek",
      };
    case "completed":
      return {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100",
        border: "border-blue-500 shadow-blue-200",
        badge: "bg-blue-600 text-white",
        glow: "shadow-sm shadow-blue-200",
        label: "Tamamlandı",
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
  const isWaiting = stall.status === "waiting";

  return (
    <div
      className={`
        relative flex flex-col
        rounded-xl p-3 border-1 transition-all duration-300
        ${config.bg} ${config.border} ${config.glow}
        h-full min-h-[280px] hover:scale-[1.02]
      `}
    >
      {/* Üst Kısım: Bölme No ve Durum */}
      <div className={`flex flex-col gap-2 mb-2 border-b ${config.border}/20 pb-2`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-gray-900 font-bold text-lg">
            #{stall.id}
          </span>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-white/70">
            <Timer className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            <span className="font-mono font-bold text-sm text-gray-900 whitespace-nowrap">
              {stall.duration > 0 ? formatDuration(stall.duration) : "-"}
            </span>
          </div>

          {/* Durum Badge */}
          <div
            className={`
              px-2 py-1 rounded-lg text-xs font-bold text-center
              ${config.badge}
            `}
          >
            {config.label}
          </div>
        </div>
      </div>

      {/* Süt Miktarı */}
      <div className="text-center">
        <div className="flex items-end justify-center gap-1">
          <span className="font-bold text-gray-900 leading-none text-3xl">
            {stall.milkAmount.toFixed(1)}
          </span>
          <span className="text-md font-medium text-gray-600 pb-0.5">L</span>
        </div>
      </div>

      {/* Sağmal Görseli */}
      <div className="flex justify-center items-center my-2">
        <img 
          src="sagmal.png" 
          alt="Sağmal" 
          className="w-full h-auto max-h-38 object-contain"
        />
      </div>

      {/* Hayvan Bilgileri - Basit ve Kompakt */}
      <div className="mt-auto space-y-2">
        {/* Küpe, İsim, Süre - Responsive */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Küpe */}
          <div className="flex items-center gap-1.5 bg-white/70 rounded px-2 py-1">
            <Tag className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            <span className="font-bold text-sm text-gray-900 whitespace-nowrap">
              {stall.animal?.tag || "-"}
            </span>
          </div>

          {/* İsim - Minimum genişlik garantili */}
          <div className="flex items-center gap-1.5 bg-white/70 rounded px-2 py-1 flex-1 min-w-[80px]">
            <span className="text-sm shrink-0">🐮</span>
            <span className="font-bold text-sm text-gray-900 truncate">
              {stall.animal?.name || "-"}
            </span>
          </div>
        </div>  

        {/* Otomatik Kayan Bilgi Bandı (Marquee) */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg h-8">
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
            `
          }} />
          <div 
            className="absolute whitespace-nowrap flex items-center h-full"
            style={{
              animation: 'marquee 25s linear infinite',
              willChange: 'transform',
            }}
          >
            {/* Orijinal İçerik */}
            <div className="inline-flex items-center gap-1.5 px-4">
              <span className="text-xs font-semibold text-blue-700">Son Sağım:</span>
              <span className="text-xs font-bold text-blue-900">
                {isWaiting ? "-" : `${stall.animal?.lastMilkAmount?.toFixed(1) || "22.5"} L`}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-300 mx-2" />
            <div className="inline-flex items-center gap-1.5 px-4">
              <span className="text-xs font-semibold text-blue-700">Haftalık Ort:</span>
              <span className="text-xs font-bold text-blue-900">
                {isWaiting ? "-" : `${stall.animal?.weeklyAverage?.toFixed(1) || "24.8"} L`}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-300 mx-2" />
            <div className="inline-flex items-center gap-1.5 px-4">
              <span className="text-xs font-semibold text-blue-700">Laktasyon:</span>
              <span className="text-xs font-bold text-blue-900">
                {isWaiting ? "-" : stall.animal?.lactationNumber || "3"}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-300 mx-2" />
            
            {/* Seamless loop için duplike içerik */}
            <div className="inline-flex items-center gap-1.5 px-4">
              <span className="text-xs font-semibold text-blue-700">Son Sağım:</span>
              <span className="text-xs font-bold text-blue-900">
                {isWaiting ? "-" : `${stall.animal?.lastMilkAmount?.toFixed(1) || "22.5"} L`}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-300 mx-2" />
            <div className="inline-flex items-center gap-1.5 px-4">
              <span className="text-xs font-semibold text-blue-700">Haftalık Ort:</span>
              <span className="text-xs font-bold text-blue-900">
                {isWaiting ? "-" : `${stall.animal?.weeklyAverage?.toFixed(1) || "24.8"} L`}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-300 mx-2" />
            <div className="inline-flex items-center gap-1.5 px-4">
              <span className="text-xs font-semibold text-blue-700">Laktasyon:</span>
              <span className="text-xs font-bold text-blue-900">
                {isWaiting ? "-" : stall.animal?.lactationNumber || "3"}
              </span>
            </div>
            <div className="w-px h-4 bg-blue-300 mx-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
