"use client";

import { useCallback, useRef } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { PhotoUpload } from "@/components/photo-upload";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Page() {
  const uploadRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = useCallback(() => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen">
      <Header onScrollToUpload={scrollToUpload} />
      <main>
        <Hero onScrollToUpload={scrollToUpload} />
        <Features />
        <HowItWorks />
        <PhotoUpload ref={uploadRef} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
