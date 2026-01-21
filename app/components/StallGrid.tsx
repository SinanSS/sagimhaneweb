"use client";

import { useStalls } from "../contexts/StallContext";
import { StallCard } from "./StallCard";

export function StallGrid() {
  const { stalls } = useStalls();

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 p-4 w-full h-[calc(100vh-96px)]">
      {stalls.map((stall) => (
        <StallCard key={stall.id} stall={stall} />
      ))}
    </div>
  );
}
