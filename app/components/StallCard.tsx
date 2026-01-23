"use client";

import { AlertCircle, CheckCircle2, Milk, Tag, Timer } from "lucide-react";
import { StallData } from "../types";

interface StallCardProps {
  stall: StallData;
}

const getStatusConfig = (status: StallData["status"]) => {
  switch (status) {
    case "empty":
      return {
        bg: "bg-gradient-to-br from-gray-50 to-gray-100",
        border: "border-gray-300",
        badge: "bg-gray-400 text-white",
        glow: "",
        label: "Boş",
      };
    case "milking":
      return {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        border: "border-green-500 shadow-green-200",
        badge: "bg-green-600 text-white",
        glow: "shadow-lg shadow-green-200",
        label: "Sağım Yapılıyor",
      };
    case "completed":
      return {
        bg: "bg-gradient-to-br from-red-50 to-red-100",
        border: "border-red-500 shadow-red-200",
        badge: "bg-red-600 text-white",
        glow: "shadow-md shadow-red-200",
        label: "Tamamlandı",
      };
    case "error":
      return {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100",
        border: "border-orange-500 shadow-orange-200",
        badge: "bg-orange-600 text-white animate-pulse",
        glow: "shadow-lg shadow-orange-200",
        label: "Hata",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        badge: "bg-gray-400 text-white",
        glow: "",
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
  const hasAnimal = stall.animal !== undefined;

  return (
    <div
      className={`
        relative flex flex-col
        rounded-xl border-2 p-3 transition-all duration-300
        ${config.bg} ${config.border} ${config.glow}
        h-full min-h-[280px] hover:scale-[1.02]
      `}
    >
      {/* Üst Kısım: Bölme No ve Durum */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Milk className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900 font-bold text-base">
              #{stall.id}
            </span>
          </div>

          {/* Durum İkonu */}
          {stall.status === "empty" && !hasAnimal && (
            <span className="text-2xl">🔒</span>
          )}
          {stall.status === "milking" && <span className="text-2xl">🥛</span>}
          {stall.status === "completed" && (
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          )}
          {stall.status === "error" && (
            <AlertCircle className="w-7 h-7 text-orange-600" />
          )}
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

      {/* Hayvan Emoji */}
      {hasAnimal && (
        <div className="flex items-center justify-center mb-2">
          <span className="text-4xl">🐄</span>
        </div>
      )}

      {/* Süt Miktarı */}
      <div className="text-center mb-2">
        <div className="flex items-end justify-center gap-1">
          <span
            className={`font-bold text-gray-900 leading-none ${
              hasAnimal ? "text-2xl" : "text-3xl"
            }`}
          >
            {stall.milkAmount.toFixed(1)}
          </span>
          <span className="text-sm font-medium text-gray-600 pb-0.5">L</span>
        </div>

        {/* Sağım ilerlemesi */}
        {stall.status === "milking" && (
          <div className="w-full mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 rounded-full"
                style={{
                  width: `${Math.min((stall.milkAmount / 30) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hayvan Bilgileri */}
      {hasAnimal && (
        <div className="mt-auto space-y-1.5">
          {/* Küpe No */}
          <div className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2 py-1 border border-gray-200">
            <Tag className="w-3 h-3 text-gray-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">Küpe</div>
              <div className="font-bold text-xs text-gray-900 truncate">
                {stall.animal?.tag}
              </div>
            </div>
          </div>

          {/* Adı */}
          <div className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2 py-1 border border-gray-200">
            <span className="text-sm shrink-0">🐮</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500">İsim</div>
              <div className="font-bold text-xs text-gray-900 truncate">
                {stall.animal?.name}
              </div>
            </div>
          </div>

          {/* Irk */}
          {stall.animal?.breed && (
            <div className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2 py-1 border border-gray-200">
              <span className="text-sm shrink-0">🏷️</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500">Irk</div>
                <div className="font-bold text-xs text-gray-900 truncate">
                  {stall.animal.breed}
                </div>
              </div>
            </div>
          )}

          {/* Süre */}
          {stall.duration > 0 && (
            <div className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2 py-1 border border-gray-200">
              <Timer className="w-3 h-3 text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500">Süre</div>
                <div className="font-mono font-bold text-xs text-gray-900">
                  {formatDuration(stall.duration)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Boş durum - Hayvan yok */}
      {stall.status === "empty" && !hasAnimal && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2">🔒</div>
            <div className="text-gray-500 font-medium text-xs">
              Hayvan Bekleniyor
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
