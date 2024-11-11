"use client";

import React, { useEffect } from "react";
import { HeroSection } from "@/app/(root)/_components/HeroSection";
import { MarqueeBar } from "@/app/(root)/_components/MarqueeBar";
import { LearnSection } from "@/app/(root)/_components/LearnSection";
import { ConnectedSection } from "@/app/(root)/_components/ConnectedSection";
import { TestimonialSection } from "@/app/(root)/_components/TestimonialSection";
import { NewsletterSection } from "@/app/(root)/_components/NewsletterSection";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  useEffect(() => {
    console.log(session);
  }, [session]);
  return (
    <div>
      <HeroSection />
      <MarqueeBar />
      <LearnSection />
      <ConnectedSection />
      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
}
