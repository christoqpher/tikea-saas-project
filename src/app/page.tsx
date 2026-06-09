import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DashboardShowcase } from "@/components/landing/dashboard-showcase";
import { Benefits } from "@/components/landing/benefits";
import { SocialProof } from "@/components/landing/social-proof";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="landing min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <Hero />
        <HowItWorks />
        <DashboardShowcase />
        <Benefits />
        <SocialProof />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
