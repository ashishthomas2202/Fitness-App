import React from "react";
import { HeroSection } from "@/app/(root)/_components/HeroSection";
import { MarqueeBar } from "@/app/(root)/_components/MarqueeBar";
import { LearnSection } from "@/app/(root)/_components/LearnSection";
import { ConnectedSection } from "@/app/(root)/_components/ConnectedSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <MarqueeBar />
      <LearnSection />
      <ConnectedSection />
    </div>
  );
}
