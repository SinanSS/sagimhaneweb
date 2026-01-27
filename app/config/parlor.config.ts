import { MilkingParlor } from "../types";

/**
 * Sağımhane Yapılandırması
 * Farklı sağımhaneler için bu dosyayı düzenleyin
 */
export const PARLOR_CONFIG: MilkingParlor = {
  id: "sagimhane-001",
  name: "Ana Sağımhane",
  totalStalls: 10,
  stallsPerSide: 5,
  sides: 2,
};

/**
 * Sağım Ayarları
 */
export const MILKING_SETTINGS = {
  // Süt akış hızı (litre/saniye) - SİMÜLASYON İÇİN HIZLANDIRILMIŞ
  milkFlowRate: {
    min: 0.3,
    max: 0.6,
  },
  
  // Maksimum süt miktarı (litre)
  maxMilkAmount: 30,
  
  // Maksimum sağım süresi (saniye)
  maxDuration: 120,
  
  // Güncelleme aralığı (milisaniye)
  updateInterval: 1000, // 1 saniye
  
  // Otomatik grup değiştirme
  autoGroupChange: true,
  
  // Grup değiştirme gecikmesi (saniye)
  groupChangeDelay: 3,
};

/**
 * Görsel Ayarları
 */
export const VISUAL_SETTINGS = {
  // Animasyon süreleri (milisaniye)
  animations: {
    cardTransition: 300,
    progressBar: 1000,
    animalEntry: 800,
    animalExit: 600,
  },
  
  // Varsayılan hayvan fotoğrafları (rastgele seçilecek)
  defaultAnimalPhotos: [
    "🐄", // Emoji olarak başlayalım, sonra gerçek fotoğraflar eklenebilir
    "🐮",
  ],
};

/**
 * Mock Hayvan Verileri
 */
export const MOCK_ANIMALS = [
  { name: "Daisy", breed: "Holstein" },
  { name: "Bella", breed: "Jersey" },
  { name: "Molly", breed: "Brown Swiss" },
  { name: "Luna", breed: "Holstein" },
  { name: "Rosie", breed: "Guernsey" },
  { name: "Chloe", breed: "Holstein" },
  { name: "Milka", breed: "Montbeliarde" },
  { name: "Lola", breed: "Jersey" },
  { name: "Sophie", breed: "Holstein" },
  { name: "Ruby", breed: "Ayrshire" },
  { name: "Lily", breed: "Holstein" },
  { name: "Zoe", breed: "Brown Swiss" },
  { name: "Mia", breed: "Jersey" },
  { name: "Emma", breed: "Holstein" },
  { name: "Nala", breed: "Guernsey" },
  { name: "Stella", breed: "Holstein" },
  { name: "Grace", breed: "Montbeliarde" },
  { name: "Hazel", breed: "Jersey" },
  { name: "Ivy", breed: "Holstein" },
  { name: "Willow", breed: "Brown Swiss" },
];

