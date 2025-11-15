// components/SolutionsSection.tsx
import Image from "next/image";
import Link from "next/link";
import SolutionPod from "./SolutionPod";
import {
  Banknote,
  DollarSign,
  Repeat,
  ClipboardCheck,
  Landmark,
  FileClock,
  Search,
  Stamp,
  Home,
} from "lucide-react";

// Placeholder image
const studentImageUrl = "/images/prem-1-400x600.png";

// Data for the pods, now with percentage-based classes for responsiveness
const solutions = [
  {
    icon: <Banknote />,
    label: "GIC Program",
    positionClass: "absolute z-20 top-[5%] left-1/2 -translate-x-1/2",
    iconBgColor: "bg-blue-400",
    iconTextColor: "text-blue-900",
  },
  {
    icon: <DollarSign />,
    label: "Student Loans",
    positionClass: "absolute z-20 top-[20%] left-[5%] sm:left-[15%]",
    iconBgColor: "bg-yellow-400",
    iconTextColor: "text-yellow-900",
  },
  {
    icon: <Repeat />,
    label: "Foreign Exchange",
    positionClass: "absolute z-20 top-[20%] right-[5%] sm:right-[15%]",
    iconBgColor: "bg-green-400",
    iconTextColor: "text-green-900",
  },
  {
    icon: <ClipboardCheck />,
    label: "Language Tests",
    positionClass:
      "absolute z-20 top-1/2 -translate-y-1/2 left-[0%] sm:left-[5%]",
    iconBgColor: "bg-cyan-400",
    iconTextColor: "text-cyan-900",
  },
  {
    icon: <Landmark />,
    label: "Banking",
    positionClass:
      "absolute z-20 top-1/2 -translate-y-1/2 right-[0%] sm:right-[5%]",
    iconBgColor: "bg-purple-400",
    iconTextColor: "text-purple-900",
  },
  {
    icon: <FileClock />,
    label: "Instant Applications",
    positionClass: "absolute z-20 bottom-[20%] left-[5%] sm:left-[15%]",
    iconBgColor: "bg-red-400",
    iconTextColor: "text-red-900",
  },
  {
    icon: <Search />,
    label: "Program Search",
    positionClass: "absolute z-20 bottom-[5%] left-[20%] sm:left-[30%]",
    iconBgColor: "bg-pink-400",
    iconTextColor: "text-pink-900",
  },
  {
    icon: <Stamp />,
    label: "Visa Services",
    positionClass: "absolute z-20 bottom-[20%] right-[5%] sm:right-[15%]",
    iconBgColor: "bg-orange-400",
    iconTextColor: "text-orange-900",
  },
  {
    icon: <Home />,
    label: "Accommodations",
    positionClass: "absolute z-20 bottom-[5%] right-[20%] sm:right-[30%]",
    iconBgColor: "bg-indigo-400",
    iconTextColor: "text-indigo-900",
  },
];

export default function SolutionsSection() {
  return (
    <section className="bg-background text-foreground py-20 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Header Content --- */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <span className="font-semibold" style={{ color: "var(--primary)" }}>
            360 SOLUTIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
            Find Every Solution, From Applications to Accommodations
          </h2>
          <p className="text-lg text-muted-foreground mt-6">
            Access our full 360 Solutions, covering everything from application
            to arrival. Get instant language test vouchers, explore financial
            services, and invest in your future with flexible student loans.
            It&apos;s all here.
          </p>
          <div className="mt-10">
            <Link
              href="/register"
              className="btn btn-primary px-8 py-3 text-base"
            >
              Register Now
            </Link>
          </div>
        </div>

        {/* --- Unified Responsive Visual Layout --- */}
        {/* This container defines the height for the absolute positioning.
          It scales from 500px on mobile to 550px on desktop.
        */}
        <div className="relative w-full max-w-4xl mx-auto h-[500px] sm:h-[550px]">
          {/* Faint Gradient Arc (z-0, behind everything) */}
          {/* Hidden on mobile, appears on medium screens and up */}
          <div className="absolute inset-0 m-auto w-full max-w-lg h-[500px] sm:h-[550px] rounded-[50%] border-2 border-b-0 border-border/30 z-0 hidden md:block"></div>

          {/* Central Image (z-10, behind pods) */}
          {/* Scales from small to large */}
          <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image
              src={studentImageUrl}
              alt="Student"
              width={400}
              height={600}
              className="rounded-t-full object-cover w-48 h-64 sm:w-60 sm:h-80 md:w-72 md:h-96"
            />
          </div>

          {/* Pods (z-20, in front of image) */}
          {solutions.map((pod) => (
            <SolutionPod
              key={pod.label}
              icon={pod.icon}
              label={pod.label}
              className={pod.positionClass} // Uses percentage-based classes
              iconBgColor={pod.iconBgColor}
              iconTextColor={pod.iconTextColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
