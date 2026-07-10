import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/Marquee";
import { Benefits } from "@/components/sections/Benefits";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WhyMe } from "@/components/sections/WhyMe";
import { Engagement } from "@/components/sections/Engagement";
import { LiveDemo } from "@/components/sections/LiveDemoLazy";
import { About } from "@/components/sections/About";
import { ProofWall } from "@/components/sections/ProofWall";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Benefits />
      <SelectedWork />
      <div className="section-alt w-full">
        <WhyMe />
      </div>
      <LiveDemo />
      <About />
      <Engagement />
      <ProofWall />
      <Writing />
      <div className="section-alt w-full">
        <Contact />
      </div>
    </>
  );
}
