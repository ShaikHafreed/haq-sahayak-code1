import ComingNext from "../components/landing/ComingNext";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import SampleButtons from "../components/landing/SampleButtons";
import TrustStrip from "../components/landing/TrustStrip";

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 pb-10">
      <Hero />
      <HowItWorks />
      <SampleButtons />
      <TrustStrip />
      <ComingNext />
    </div>
  );
}
