"use client";

import { useStalls } from "../contexts/StallContext";
import { StallCard } from "./StallCard";

export function StallGrid() {
  const { stalls, totalStalls } = useStalls();

  // Dinamik olarak üst ve alt sırayı hesapla
  const topRowCount = Math.ceil(totalStalls / 2); // Tek sayıda üste fazla ver
  const bottomRowCount = Math.floor(totalStalls / 2);

  // Bölmeleri dinamik olarak ayır
  const topRow = stalls.slice(0, topRowCount);
  const bottomRow = stalls.slice(topRowCount);

  // Grid sütun sayısını dinamik hesapla (maksimum her sırada gösterilecek)
  const topCols = topRowCount;
  const bottomCols = bottomRowCount > 0 ? bottomRowCount : 1;

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-[calc(100vh-120px)]">
      {/* Üst Sıra - Dinamik */}
      <div
        className="grid gap-3 w-full"
        style={{
          gridTemplateColumns: `repeat(${topCols}, minmax(0, 1fr))`,
        }}
      >
        {topRow.map((stall) => (
          <StallCard key={stall.id} stall={stall} />
        ))}
      </div>

      {/* Ayırıcı - sadece alt sıra varsa göster */}
      {bottomRowCount > 0 && (
        <div className="border-t-2 border-gray-300 my-2"></div>
      )}

      {/* Alt Sıra - Dinamik */}
      {bottomRowCount > 0 && (
        <div
          className="grid gap-3 w-full"
          style={{
            gridTemplateColumns: `repeat(${bottomCols}, minmax(0, 1fr))`,
          }}
        >
          {bottomRow.map((stall) => (
            <StallCard key={stall.id} stall={stall} />
          ))}
        </div>
      )}
    </div>
  );
}
