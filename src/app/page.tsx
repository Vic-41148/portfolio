import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { LiveDemo } from "@/components/sections/LiveDemo";
import { About } from "@/components/sections/About";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <LiveDemo />
      <div className="section-alt w-full">
        <About />
      </div>
      <Writing />
      <div className="section-alt w-full">
        <Contact />
      </div>
    </>
  );
}
