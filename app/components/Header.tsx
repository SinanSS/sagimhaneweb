"use client";

import { Activity, CheckCircle, Clock, Milk, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useStalls } from "../contexts/StallContext";

export function Header() {
  const { stats, totalStalls, addStalls, removeStalls } = useStalls();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 backdrop-blur-sm border-b-2 border-blue-500/50 px-6 py-3 z-10 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        {/* Sol: Başlık */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Milk className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Sağımhane Yönetim Sistemi
              <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">
                CANLI
              </span>
            </h1>
            <p className="text-xs text-gray-300">
              20 Bölmeli Otomatik Sağım Sistemi
            </p>
          </div>
        </div>

        {/* Orta: İstatistikler ve Kontroller */}
        <div className="flex items-center gap-3">
          {/* Hayvan Sayısı Kontrolü */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center gap-2">
              <div>
                <div className="text-xs text-gray-300">Bölme Sayısı</div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => removeStalls(1)}
                    disabled={totalStalls <= 1}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded p-1 transition-colors"
                    title="1 Bölme Azalt"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-lg font-bold text-white min-w-[40px] text-center">
                    {totalStalls}
                  </span>
                  <button
                    onClick={() => addStalls(1)}
                    disabled={totalStalls >= 40}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded p-1 transition-colors"
                    title="1 Bölme Ekle"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Toplam Süt */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center gap-2">
              <Milk className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-300">Toplam Süt</div>
                <div className="text-lg font-bold text-white">
                  {stats.totalMilk.toFixed(1)} L
                </div>
              </div>
            </div>
          </div>

          {/* Aktif Sağım */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-300">Aktif</div>
                <div className="text-lg font-bold text-white">
                  {stats.activeStalls}/{totalStalls}
                </div>
              </div>
            </div>
          </div>

          {/* Tamamlanan */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs text-gray-300">Tamamlanan</div>
                <div className="text-lg font-bold text-white">
                  {stats.completedCount}
                </div>
              </div>
            </div>
          </div>

          {/* Ort. Süre */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-300">Ort. Süre</div>
                <div className="text-lg font-bold text-white font-mono">
                  {formatDuration(stats.averageDuration)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ: Tarih ve Saat */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold text-white font-mono">
              {currentTime}
            </div>
            <div className="text-xs text-gray-300">{currentDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
