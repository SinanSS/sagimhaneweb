"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { PARLOR_CONFIG } from "../config/parlor.config";
import { SessionStats, StallData } from "../types";

// ==========================================
// TİPLER VE SABİTLER
// ==========================================

interface StallContextType {
  stalls: StallData[];
  stats: SessionStats;
  totalStalls: number;
}

const StallContext = createContext<StallContextType | undefined>(undefined);

const API_URL = "/api/live";
const POLLING_INTERVAL = 1000; // 1 saniye

interface MeasurementData {
  kayitId: number;
  hayvanId: number;
  kupeNo: string;
  ozelTakipNo?: string;
  pulse: number;
  litre: number;
  sure: number;
  baslangic: string;
}

interface ApiResponse {
  status: "idle" | "active";
  measurements: MeasurementData[];
}

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

// Hayvan ID'sine göre stall ID hesapla
function getStallIdFromAnimalId(hayvanId: number): number {
  return (hayvanId % PARLOR_CONFIG.totalStalls) || PARLOR_CONFIG.totalStalls;
}

// Stall ID'sine göre side ve position hesapla
function getStallSideAndPosition(stallId: number): { side: "left" | "right"; position: number } {
  const { stallsPerSide } = PARLOR_CONFIG;
  return stallId <= stallsPerSide
    ? { side: "left", position: stallId }
    : { side: "right", position: stallId - stallsPerSide };
}

// Başlangıç stall'ları oluştur
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

// ==========================================
// PROVIDER
// ==========================================

export function StallProvider({ children }: { children: ReactNode }) {
  // Temel State'ler
  const [totalStalls] = useState(PARLOR_CONFIG.totalStalls);
  const [stalls, setStalls] = useState<StallData[]>(initializeStalls());
  const [completedDurations, setCompletedDurations] = useState<number[]>([]);

  // Referanslar (Önceki ölçümleri takip etmek için)
  const previousMeasurementsRef = useRef<Map<number, MeasurementData>>(new Map());

  // --------------------------------------------------------
  // İstatistikleri Hesapla (Derived State)
  // --------------------------------------------------------
  const stats = useMemo<SessionStats>(() => {
    const activeStalls = stalls.filter((s) => s.status === "milking").length;
    const totalMilk = stalls.reduce((sum, s) => sum + s.milkAmount, 0);

    const averageDuration =
      completedDurations.length > 0
        ? Math.round(
          completedDurations.reduce((sum, d) => sum + d, 0) / completedDurations.length
        )
        : 0;

    // currentGroup mantığı statik kalmış, gerekirse buraya eklenebilir.
    // Şimdilik varsayılan 1 dönüyoruz.
    return {
      totalMilk,
      activeStalls,
      completedCount: completedDurations.length,
      averageDuration,
      currentGroup: 1,
    };
  }, [stalls, completedDurations]);

  // --------------------------------------------------------
  // Veri İşleme Mantığı
  // --------------------------------------------------------
  const processMeasurements = useCallback((measurements: MeasurementData[]) => {
    const currentMap = new Map<number, MeasurementData>();
    const measurementsByStallId = new Map<number, MeasurementData>();

    // 1. Gelen veriyi map'le
    measurements.forEach((m) => {
      currentMap.set(m.kayitId, m);
      const sId = getStallIdFromAnimalId(m.hayvanId);
      measurementsByStallId.set(sId, m);
    });

    // 2. Biten sağımları tespit et (Önceki map'te olup şimdikinde olmayanlar)
    const previousMap = previousMeasurementsRef.current;
    const finishedMeasurements: MeasurementData[] = [];

    previousMap.forEach((m, kayitId) => {
      if (!currentMap.has(kayitId)) {
        finishedMeasurements.push(m);
        console.log(`🔴 Sağım bitti | Hayvan: ${m.hayvanId} | Toplam: ${m.litre}L`);
      }
    });

    // Bitenlerin sürelerini kaydet
    if (finishedMeasurements.length > 0) {
      setCompletedDurations((prev) => [
        ...prev,
        ...finishedMeasurements.map((m) => m.sure),
      ]);
    }

    // 3. Stalls durumunu güncelle (Tek bir state update)
    setStalls((prevStalls) =>
      prevStalls.map((stall) => {
        const activeMeasurement = measurementsByStallId.get(stall.id);

        if (activeMeasurement) {
          // --- AKTİF SAĞIM ---
          const isNewStart = stall.status !== "milking";
          if (isNewStart) {
            console.log(
              `🟢 Sağım başladı | Hayvan: ${activeMeasurement.hayvanId} | Stall: ${stall.id}`
            );
          }

          return {
            ...stall,
            status: "milking",
            milkAmount: activeMeasurement.litre,
            duration: activeMeasurement.sure,
            animal: {
              tag: activeMeasurement.kupeNo,
              name: activeMeasurement.ozelTakipNo || "-",
            },
            // Zaten milking ise başlangıç zamanını koru, değilse yeni zaman ata
            milkingStartTime: isNewStart ? Date.now() : stall.milkingStartTime,
            lastUpdate: Date.now(),
          };
        } else {
          // --- BOŞ STALL ---
          // Eğer önceden doluyduysa şimdi boşalmalı (waiting)
          if (stall.status === "milking") {
            return {
              ...stall,
              status: "waiting",
              // Son verileri ekranda göstermek için koruyoruz
              lastUpdate: Date.now(),
            };
          }
          // Zaten boşsa değişiklik yok
          return stall;
        }
      })
    );

    // 4. Ref'i güncelle
    previousMeasurementsRef.current = currentMap;
  }, []);

  // --------------------------------------------------------
  // API Polling
  // --------------------------------------------------------
  useEffect(() => {
    console.log("🔌 API polling başlatılıyor...", API_URL);

    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data: ApiResponse = await response.json();

        if (data.status === "idle") {
          // Aktif ölçüm yok -> Hepsini durdur (boş liste gönder)
          processMeasurements([]);
        } else {
          processMeasurements(data.measurements);
        }
      } catch (error) {
        console.error("❌ API fetch hatası:", error);
      }
    };

    // İlk çağrı
    fetchData();

    // Periyodik çağrı
    const interval = setInterval(fetchData, POLLING_INTERVAL);

    return () => {
      console.log("🔌 API polling durduruluyor...");
      clearInterval(interval);
    };
  }, [processMeasurements]);

  return (
    <StallContext.Provider value={{ stalls, stats, totalStalls }}>
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