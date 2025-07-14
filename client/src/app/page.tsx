import Counter from "@/components/Counter/Counter";
import ClinicalHomepage from "@/components/Home/Home";
import Work from '@/components/Work/Work'
import Features from "@/components/Features/Features";
import FAQs from "@/components/FAQs/FAQs";
export default function Home() {
  return (
  <div>
   <ClinicalHomepage />
   <Counter />
   <Work />
   <Features />
   <FAQs />
  </div>
  );
}
