"use client";

import { useStalls } from "../contexts/StallContext";
import { MobileStallCard } from "./MobileStallCard";

export function MobileStallGrid() {
  const { stalls } = useStalls();

  return (
    <div className="p-2 w-full h-screen bg-gray-50 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full h-full overflow-y-auto pb-4">
        {stalls.map((stall) => (
          <MobileStallCard key={stall.id} stall={stall} />
        ))}
      </div>
    </div>
  );
}
