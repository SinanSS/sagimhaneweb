"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  MILKING_SETTINGS,
  MOCK_ANIMALS,
  PARLOR_CONFIG,
} from "../config/parlor.config";
import { AnimalData, SessionStats, StallData } from "../types";

interface StallContextType {
  stalls: StallData[];
  stats: SessionStats;
  startNewGroup: () => void;
  clearStall: (stallId: number) => void;
  updateAnimalPhoto: (stallId: number, photoUrl: string) => void;
  totalStalls: number;
  addStalls: (count: number) => void;
  removeStalls: (count: number) => void;
}

const StallContext = createContext<StallContextType | undefined>(undefined);

// Yeni hayvan grubu oluştur (20 hayvan)
const generateAnimalGroup = (groupNumber: number): AnimalData[] => {
  return Array.from({ length: PARLOR_CONFIG.totalStalls }, (_, i) => {
    const mockAnimal =
      MOCK_ANIMALS[Math.floor(Math.random() * MOCK_ANIMALS.length)];
    return {
      tag: `TR${(groupNumber * 1000 + i + 1).toString().padStart(5, "0")}`,
      name: mockAnimal.name,
      breed: mockAnimal.breed,
      photoUrl: undefined, // Kullanıcı yükleyebilecek
    };
  });
};

// İlk bölmeleri oluştur (20 bölme: üstte 10, altta 10)
const generateInitialStalls = (): StallData[] => {
  return Array.from({ length: PARLOR_CONFIG.totalStalls }, (_, i) => {
    const id = i + 1;
    const side: "left" | "right" = i < 10 ? "left" : "right";
    const position = (i % 10) + 1;

    return {
      id,
      status: "empty",
      milkAmount: 0,
      duration: 0,
      side,
      position,
      lastUpdate: Date.now(),
    };
  });
};

export function StallProvider({ children }: { children: ReactNode }) {
  const [totalStalls, setTotalStalls] = useState(PARLOR_CONFIG.totalStalls);
  const [stalls, setStalls] = useState<StallData[]>(generateInitialStalls());
  const [currentGroup, setCurrentGroup] = useState(1);
  const [stats, setStats] = useState<SessionStats>({
    totalMilk: 0,
    activeStalls: 0,
    completedCount: 0,
    averageDuration: 0,
    currentGroup: 1,
  });

  // Yeni grup başlat
  const startNewGroup = () => {
    const newGroup = currentGroup + 1;
    const animals = generateAnimalGroup(newGroup);
    const now = Date.now();

    setStalls((prevStalls) =>
      prevStalls.map((stall, index) => {
        // Her inek için farklı özellikler - SİMÜLASYON İÇİN HIZLANDIRILMIŞ
        const targetMilk = 10 + Math.random() * 15; // 10-25 litre arası
        const flowRate =
          MILKING_SETTINGS.milkFlowRate.min +
          Math.random() *
            (MILKING_SETTINGS.milkFlowRate.max -
              MILKING_SETTINGS.milkFlowRate.min);
        const estimatedDuration = targetMilk / flowRate; // Tahmini süre
        const startDelay = Math.random() * 10000; // 0-10 saniye arası başlama gecikmesi

        return {
          ...stall,
          status: "empty" as const, // İlk başta boş, sonra milking'e geçecek
          animal: animals[index],
          milkAmount: 0,
          duration: 0,
          milkingStartTime: now + startDelay,
          lastUpdate: now,
          targetMilkAmount: targetMilk,
          milkFlowRate: flowRate,
          estimatedDuration: estimatedDuration,
        };
      })
    );

    setCurrentGroup(newGroup);
  };

  // Tek bir bölmeyi temizle
  const clearStall = (stallId: number) => {
    setStalls((prevStalls) =>
      prevStalls.map((stall) =>
        stall.id === stallId
          ? {
              ...stall,
              status: "empty",
              animal: undefined,
              milkAmount: 0,
              duration: 0,
              milkingStartTime: undefined,
              lastUpdate: Date.now(),
            }
          : stall
      )
    );
  };

  // Hayvan fotoğrafını güncelle
  const updateAnimalPhoto = (stallId: number, photoUrl: string) => {
    setStalls((prevStalls) =>
      prevStalls.map((stall) =>
        stall.id === stallId && stall.animal
          ? {
              ...stall,
              animal: {
                ...stall.animal,
                photoUrl,
              },
            }
          : stall
      )
    );
  };

  // Bölme ekle (tekli)
  const addStalls = (count: number = 1) => {
    const newTotal = totalStalls + count;
    setTotalStalls(newTotal);

    setStalls((prevStalls) => {
      const newStalls = Array.from({ length: count }, (_, i) => {
        const newId = prevStalls.length + i + 1;
        const topRowCount = Math.ceil(newTotal / 2);
        const side: "left" | "right" = newId <= topRowCount ? "left" : "right";
        const position = side === "left" ? newId : newId - topRowCount;

        return {
          id: newId,
          status: "empty" as const,
          milkAmount: 0,
          duration: 0,
          side,
          position,
          lastUpdate: Date.now(),
        };
      });

      return [...prevStalls, ...newStalls];
    });
  };

  // Bölme çıkar (tekli)
  const removeStalls = (count: number = 1) => {
    if (totalStalls - count < 1) return; // En az 1 bölme kalsın

    const newTotal = totalStalls - count;
    setTotalStalls(newTotal);

    setStalls((prevStalls) => {
      // Son bölmeleri çıkar
      return prevStalls.slice(0, newTotal);
    });
  };

  // İlk grup yükle
  useEffect(() => {
    const timer = setTimeout(() => {
      startNewGroup();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gerçek zamanlı veri simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setStalls((prevStalls) =>
        prevStalls.map((stall) => {
          // Boş ama hayvanı var ve zamanı gelmiş mi? (sağım başlamalı)
          if (
            stall.status === "empty" &&
            stall.animal &&
            stall.milkingStartTime &&
            now >= stall.milkingStartTime
          ) {
            return {
              ...stall,
              status: "milking",
              lastUpdate: now,
            };
          }

          // Sağım yapılanlar
          if (stall.status === "milking") {
            const elapsed = (now - stall.milkingStartTime!) / 1000;
            const newDuration = Math.floor(elapsed);

            // Her ineğin kendi akış hızı ile süt artışı
            const flowRate = stall.milkFlowRate || 0.4;
            const newAmount = stall.milkAmount + flowRate; // 1 saniye aralıklı

            // Her ineğin kendi hedef miktarına ulaştı mı?
            const targetMilk = stall.targetMilkAmount || 25;
            if (
              newAmount >= targetMilk ||
              newDuration >= MILKING_SETTINGS.maxDuration
            ) {
              return {
                ...stall,
                status: "completed",
                milkAmount: Math.min(newAmount, targetMilk),
                duration: newDuration,
                lastUpdate: now,
              };
            }

            return {
              ...stall,
              milkAmount: newAmount,
              duration: newDuration,
              lastUpdate: now,
            };
          }

          // Tamamlanmış bölmeler - otomatik grup değiştirme
          if (stall.status === "completed") {
            if (MILKING_SETTINGS.autoGroupChange) {
              const allCompleted = prevStalls.every(
                (s) => s.status === "completed"
              );

              // Tüm bölmeler tamamlandıysa, belirli bir süre sonra yeni grup başlat
              if (
                allCompleted &&
                now - stall.lastUpdate! >=
                  MILKING_SETTINGS.groupChangeDelay * 1000
              ) {
                return stall; // Yeni grup startNewGroup ile başlatılacak
              }
            }
          }

          return stall;
        })
      );

      // Tüm bölmeler tamamlandı mı kontrol et
      setStalls((prevStalls) => {
        const allCompleted = prevStalls.every((s) => s.status === "completed");
        if (allCompleted && MILKING_SETTINGS.autoGroupChange) {
          const firstStall = prevStalls[0];
          if (
            firstStall.lastUpdate &&
            now - firstStall.lastUpdate >=
              MILKING_SETTINGS.groupChangeDelay * 1000
          ) {
            // Yeni grup başlat
            setTimeout(() => startNewGroup(), 500);
          }
        }
        return prevStalls;
      });
    }, MILKING_SETTINGS.updateInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // İstatistikleri güncelle
  useEffect(() => {
    const totalMilk = stalls.reduce((sum, s) => sum + s.milkAmount, 0);
    const activeStalls = stalls.filter((s) => s.status === "milking").length;
    const completedStalls = stalls.filter((s) => s.status === "completed");
    const completedCount = completedStalls.length;
    const averageDuration =
      completedCount > 0
        ? completedStalls.reduce((sum, s) => sum + s.duration, 0) /
          completedCount
        : 0;

    setStats({
      totalMilk,
      activeStalls,
      completedCount,
      averageDuration,
      currentGroup,
    });
  }, [stalls, currentGroup]);

  return (
    <StallContext.Provider
      value={{
        stalls,
        stats,
        startNewGroup,
        clearStall,
        updateAnimalPhoto,
        totalStalls,
        addStalls,
        removeStalls,
      }}
    >
      {children}
    </StallContext.Provider>
  );
}

export function useStalls() {
  const context = useContext(StallContext);
  if (context === undefined) {
    throw new Error("useStalls must be used within a StallProvider");
  }
  return context;
}
