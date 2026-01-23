import { Header } from "./components/Header";
import { StallGrid } from "./components/StallGrid";
import { StallProvider } from "./contexts/StallContext";

export default function Home() {
  return (
    <StallProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <Header />
        <main className="pt-[100px]">
          <StallGrid />
        </main>
      </div>
    </StallProvider>
  );
}
