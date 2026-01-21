"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { StallData, StallStatus } from "../types";

interface StallContextType {
  stalls: StallData[];
}

const StallContext = createContext<StallContextType | undefined>(undefined);

// Mock veri üretimi
const animalNames = [
  "Daisy",
  "Bella",
  "Molly",
  "Luna",
  "Rosie",
  "Chloe",
  "Milka",
  "Lola",
  "Sophie",
  "Ruby",
  "Lily",
  "Zoe",
];

const generateInitialStalls = (): StallData[] => {
  return Array.from({ length: 8 }, (_, i) => {
    const statuses: StallStatus[] = ["empty", "milking", "completed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: i + 1,
      status: randomStatus,
      milkAmount:
        randomStatus === "milking"
          ? Math.random() * 10
          : randomStatus === "completed"
          ? 15 + Math.random() * 15
          : 0,
      animalTag:
        randomStatus !== "empty"
          ? `TR${1000 + Math.floor(Math.random() * 9000)}`
          : undefined,
      animalName:
        randomStatus !== "empty"
          ? animalNames[Math.floor(Math.random() * animalNames.length)]
          : undefined,
      duration: randomStatus !== "empty" ? Math.floor(Math.random() * 600) : 0,
    };
  });
};

export function StallProvider({ children }: { children: ReactNode }) {
  const [stalls, setStalls] = useState<StallData[]>(generateInitialStalls());

  // Gerçek zamanlı veri simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setStalls((prevStalls) =>
        prevStalls.map((stall) => {
          // Boş bölmeler değişmesin
          if (stall.status === "empty") {
            // %5 ihtimalle yeni sağım başlasın
            if (Math.random() < 0.05) {
              return {
                ...stall,
                status: "milking",
                milkAmount: 0,
                animalTag: `TR${1000 + Math.floor(Math.random() * 9000)}`,
                animalName:
                  animalNames[Math.floor(Math.random() * animalNames.length)],
                duration: 0,
              };
            }
            return stall;
          }

          // Tamamlanmış bölmeler
          if (stall.status === "completed") {
            // %3 ihtimalle boşalsın
            if (Math.random() < 0.03) {
              return {
                ...stall,
                status: "empty",
                milkAmount: 0,
                animalTag: undefined,
                duration: 0,
              };
            }
            return stall;
          }

          // Sağım yapılanlar
          if (stall.status === "milking") {
            const newDuration = stall.duration + 2; // Her 2 saniyede güncelleme
            const newAmount = stall.milkAmount + (0.05 + Math.random() * 0.1); // Artan süt miktarı

            // Sağım tamamlandı mı?
            if (newAmount >= 25 || newDuration >= 600) {
              return {
                ...stall,
                status: "completed",
                milkAmount: newAmount,
                duration: newDuration,
              };
            }

            return {
              ...stall,
              milkAmount: newAmount,
              duration: newDuration,
            };
          }

          return stall;
        })
      );
    }, 2000); // Her 2 saniyede güncelle

    return () => clearInterval(interval);
  }, []);

  return (
    <StallContext.Provider value={{ stalls }}>{children}</StallContext.Provider>
  );
}

export function useStalls() {
  const context = useContext(StallContext);
  if (context === undefined) {
    throw new Error("useStalls must be used within a StallProvider");
  }
  return context;
}
