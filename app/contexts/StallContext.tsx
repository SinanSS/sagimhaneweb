"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { PARLOR_CONFIG } from "../config/parlor.config";
import { SessionStats, StallData } from "../types";

interface StallContextType {
  stalls: StallData[];
  stats: SessionStats;
  totalStalls: number;
}

const StallContext = createContext<StallContextType | undefined>(undefined);

// SSE Backend URL
const SSE_URL = "http://localhost:3005/live";

// SSE Event Tipleri
interface SSEStartEvent {
  type: "START";
  kayitId: number;
  hayvanId: number;
  kupeNo: string;
  ozelTakipNo?: string;
  baslangic: string;
}

interface SSEUpdateEvent {
  type: "UPDATE";
  kayitId: number;
  hayvanId: number;
  kupeNo: string;
  ozelTakipNo?: string;
  pulse: number;
  litre: number;
  sure: number;
}

interface SSEStopEvent {
  type: "STOP";
  kayitId: number;
  hayvanId: number;
  kupeNo: string;
  toplamLitre: number;
  toplamSure: number;
}

type SSEEvent = SSEStartEvent | SSEUpdateEvent | SSEStopEvent;

// Hayvan ID'sine göre stall ID hesapla
function getStallIdFromAnimalId(hayvanId: number): number {
  const stallId = (hayvanId % PARLOR_CONFIG.totalStalls) || PARLOR_CONFIG.totalStalls;
  return stallId;
}

// Stall ID'sine göre side ve position hesapla
function getStallSideAndPosition(stallId: number): { side: "left" | "right"; position: number } {
  const { stallsPerSide } = PARLOR_CONFIG;
  
  if (stallId <= stallsPerSide) {
    return { side: "left", position: stallId };
  } else {
    return { side: "right", position: stallId - stallsPerSide };
  }
}

// Başlangıç stall'ları oluştur (hepsi waiting durumunda)
function initializeStalls(): StallData[] {
  const stalls: StallData[] = [];
  
  for (let i = 1; i <= PARLOR_CONFIG.totalStalls; i++) {
    const { side, position } = getStallSideAndPosition(i);
    
    stalls.push({
      id: i,
      status: "waiting",
      milkAmount: 0,
      duration: 0,
      side,
      position,
      lastUpdate: Date.now(),
    });
  }
  
  return stalls;
}

export function StallProvider({ children }: { children: ReactNode }) {
  const [totalStalls] = useState(PARLOR_CONFIG.totalStalls);
  const [stalls, setStalls] = useState<StallData[]>(initializeStalls());
  const [stats, setStats] = useState<SessionStats>({
    totalMilk: 0,
    activeStalls: 0,
    completedCount: 0,
    averageDuration: 0,
    currentGroup: 1,
  });

  // SSE Event Handlers
  const handleStartEvent = (event: SSEStartEvent) => {
    const stallId = getStallIdFromAnimalId(event.hayvanId);
    
    setStalls((prevStalls) =>
      prevStalls.map((stall) =>
        stall.id === stallId
          ? {
              ...stall,
              status: "milking",
              milkAmount: 0,
              duration: 0,
              animal: {
                tag: event.kupeNo,
                name: event.ozelTakipNo || "-",
              },
              milkingStartTime: Date.now(),
              lastUpdate: Date.now(),
            }
          : stall
      )
    );

    console.log(`🟢 Sağım başladı | Hayvan: ${event.hayvanId} | Stall: ${stallId} | Küpe: ${event.kupeNo}`);
  };

  const handleUpdateEvent = (event: SSEUpdateEvent) => {
    const stallId = getStallIdFromAnimalId(event.hayvanId);
    
    setStalls((prevStalls) =>
      prevStalls.map((stall) =>
        stall.id === stallId
          ? {
              ...stall,
              milkAmount: event.litre,
              duration: event.sure,
              lastUpdate: Date.now(),
            }
          : stall
      )
    );
  };

  const handleStopEvent = (event: SSEStopEvent) => {
    const stallId = getStallIdFromAnimalId(event.hayvanId);
    
    // Sağım bitti ama verileri koru - yeni hayvan gelene kadar
    setStalls((prevStalls) =>
      prevStalls.map((stall) =>
        stall.id === stallId
          ? {
              ...stall,
              status: "waiting",
              // milkAmount, duration, animal bilgileri KORUNUYOR
              lastUpdate: Date.now(),
            }
          : stall
      )
    );

    // Toplam sağım sayısını artır
    setStats((prev) => ({
      ...prev,
      completedCount: prev.completedCount + 1,
    }));

    console.log(`🔴 Sağım bitti | Hayvan: ${event.hayvanId} | Stall: ${stallId} | Toplam: ${event.toplamLitre}L`);
  };

  // SSE Bağlantısı
  useEffect(() => {
    console.log("🔌 SSE bağlantısı kuruluyor...", SSE_URL);
    
    const eventSource = new EventSource(SSE_URL);

    eventSource.onopen = () => {
      console.log("✅ SSE bağlantısı başarılı");
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        
        switch (data.type) {
          case "START":
            handleStartEvent(data);
            break;
          case "UPDATE":
            handleUpdateEvent(data);
            break;
          case "STOP":
            handleStopEvent(data);
            break;
          default:
            console.warn("⚠️ Bilinmeyen event tipi:", data);
        }
      } catch (error) {
        console.error("❌ SSE event parse hatası:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("❌ SSE bağlantı hatası:", error);
    };

    // Cleanup
    return () => {
      console.log("🔌 SSE bağlantısı kapatılıyor...");
      eventSource.close();
    };
  }, []);

  // Stats'ı gerçek zamanlı hesapla
  useEffect(() => {
    const activeStalls = stalls.filter((s) => s.status === "milking").length;
    const totalMilk = stalls.reduce((sum, s) => sum + s.milkAmount, 0);
    
    const activeDurations = stalls
      .filter((s) => s.status === "milking")
      .map((s) => s.duration);
    
    const averageDuration =
      activeDurations.length > 0
        ? Math.round(
            activeDurations.reduce((sum, d) => sum + d, 0) / activeDurations.length
          )
        : 0;

    setStats((prev) => ({
      ...prev,
      totalMilk,
      activeStalls,
      averageDuration,
    }));
  }, [stalls]);

  return (
    <StallContext.Provider
      value={{
        stalls,
        stats,
        totalStalls,
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
