export type StallStatus = 'milking' | 'waiting' | 'ignored' | 'completed';

export interface AnimalData {
  tag: string; // RFID Küpe No
  name: string; // İnek Adı
  photoUrl?: string; // Hayvan Fotoğrafı
  breed?: string; // Irk
  lastMilkAmount?: number; // Son Sağımda Verdiği Süt (Litre)
  weeklyAverage?: number; // Haftalık Ortalama Süt (Litre)
  lactationNumber?: number; // Laktasyon Sayısı
}

export interface StallData {
  id: number;
  status: StallStatus;
  milkAmount: number; // Litre
  animal?: AnimalData; // Hayvan Bilgisi
  duration: number; // Saniye
  side: 'left' | 'right'; // Sol veya Sağ Taraf
  position: number; // Taraftaki pozisyon (1-10)
  milkingStartTime?: number; // Sağım başlangıç zamanı
  lastUpdate?: number; // Son güncelleme
  targetMilkAmount?: number; // Hedef süt miktarı (her inek farklı)
  milkFlowRate?: number; // Süt akış hızı (her inek farklı)
  estimatedDuration?: number; // Tahmini sağım süresi
}

export interface MilkingParlor {
  id: string;
  name: string;
  totalStalls: number; // Toplam bölme sayısı
  stallsPerSide: number; // Her taraftaki bölme sayısı
  sides: number; // Taraf sayısı (genelde 2)
}

export interface SessionStats {
  totalMilk: number;
  activeStalls: number;
  completedCount: number;
  averageDuration: number;
  currentGroup: number;
}

