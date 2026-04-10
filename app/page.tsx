import NavBar from "@/components/NavBar";
import HeroClark from "@/components/HeroClark";
import Waitlist from "@/components/Waitlist";
import ClarkBot from "@/components/ClarkBot";
import GhostTrade from "@/components/GhostTrade";
import LiveFeed from "@/components/LiveFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <NavBar />
      <HeroClark />
      <Waitlist />
      <ClarkBot />
      <GhostTrade />
      <LiveFeed />
      <Footer />
    </main>
  );
}
