'use client';

export function Header() {
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 px-8 py-4 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Süt Yönetimi</h1>
          <p className="text-sm text-gray-300 mt-1">Canlı Takip Paneli</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-white">{currentTime}</div>
          <div className="text-sm text-gray-300">{currentDate}</div>
        </div>
      </div>
    </div>
  );
}

