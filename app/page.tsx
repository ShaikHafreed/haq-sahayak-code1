import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import SampleResultCard from "../components/landing/SampleResultCard";
import SchemesBand from "../components/landing/SchemesBand";

// Full-bleed: escapes layout's max-w-md <main> so only the landing page is wide.
export default function LandingPage() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <Hero sample={<SampleResultCard />} />
      <HowItWorks />
      <SchemesBand />
    </div>
  );
}
