export type StallStatus = 'empty' | 'milking' | 'completed' | 'error';

export interface StallData {
  id: number;
  status: StallStatus;
  milkAmount: number; // Litre
  animalTag?: string; // Küpe No
  animalName?: string; // İnek Adı
  duration: number; // Saniye
}

