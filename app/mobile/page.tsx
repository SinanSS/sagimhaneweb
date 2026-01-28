import { MobileStallGrid } from "../components/MobileStallGrid";
import { StallProvider } from "../contexts/StallContext";

export default function MobilePage() {
  return (
    <StallProvider>
      <main className="w-full h-screen overflow-hidden">
        <MobileStallGrid />
      </main>
    </StallProvider>
  );
}
