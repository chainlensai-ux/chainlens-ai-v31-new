import FeatureBar from "@/components/FeatureBar";
import ClarkChat from "@/components/ClarkChat";
import ClarkRadar from "@/components/ClarkRadar";

export default function TerminalPage() {
  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      <FeatureBar />
      <main className="flex-1 flex flex-col">
        <ClarkChat />
        <ClarkRadar />
      </main>
    </div>
  );
}
