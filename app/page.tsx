import { Header } from "./components/Header";
import { StallGrid } from "./components/StallGrid";
import { StallProvider } from "./contexts/StallContext";

export default function Home() {
  return (
    <StallProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="pt-24">
          <StallGrid />
        </main>
      </div>
    </StallProvider>
  );
}
