import { cn } from "@/common/utils/cn";
import { BadgeCheck, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import React from "react";

type CorporateLoginShellProps = {
  children: React.ReactNode;
  className?: string;
};

const features = [
  {
    title: "Secure Access",
    description: "Secure enterprise access for BPR Bonding.",
    icon: ShieldCheck,
    accent: "#F58220",
    iconClassName: "text-[#F58220]",
    glowClassName: "shadow-[#F58220]/25",
  },
  {
    title: "Trusted Platform",
    description: "Integrated bonding operations platform.",
    icon: BadgeCheck,
    accent: "#21C7C7",
    iconClassName: "text-[#21C7C7]",
    glowClassName: "shadow-[#21C7C7]/25",
  },
  {
    title: "Professional Service",
    description: "Reliable surety and guarantee support.",
    icon: BriefcaseBusiness,
    accent: "#2563EB",
    iconClassName: "text-[#2563EB]",
    glowClassName: "shadow-[#2563EB]/25",
  },
];

const CorporateLoginShell: React.FC<CorporateLoginShellProps> = ({ children, className }) => {
  return (
    <section className={cn("grid min-h-svh w-full bg-[#F8FAFC] text-[#1F2937] lg:grid-cols-2", className)}>
      <style>{`#phpdebugbar, .phpdebugbar { display: none !important; }`}</style>
      <aside className="relative hidden min-h-svh overflow-hidden lg:flex">
        <img
          src="/login-business-meeting.jpg"
          alt="Professional business meeting"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(2,6,23,0.56)_0%,rgba(15,23,42,0.38)_48%,rgba(2,6,23,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.03)_0%,rgba(2,6,23,0.09)_48%,rgba(2,6,23,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(33,199,199,0.2),transparent_30%),radial-gradient(circle_at_72%_28%,rgba(245,130,32,0.16),transparent_28%)]" />

        <div className="absolute left-[72px] top-12 z-20 inline-flex items-center rounded-xl border border-white/80 bg-white/95 px-4 py-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm 2xl:left-[88px] 2xl:px-4 2xl:py-3">
          <img src="/bpr-bonding.png" alt="BPR Bonding" className="h-12 w-auto object-contain 2xl:h-14" />
        </div>

        <div className="absolute right-14 top-12 z-20 2xl:right-[72px]">
          <img
            src="/Logo-jastan-ts1.png"
            alt="Business Partner Of Asuransi Jastan"
            className="h-12 w-auto object-contain drop-shadow-xl 2xl:h-14"
          />
        </div>

        <div className="absolute bottom-10 left-[72px] z-20 2xl:bottom-12 2xl:left-[88px]">
          <img
            src="/Logo-APG-transparan.png"
            alt="APG Ardana Perkasa Group"
            className="h-12 w-auto object-contain drop-shadow-xl 2xl:h-14"
          />
        </div>

        <div className="relative z-10 flex min-h-svh w-full flex-col justify-center px-[72px] pb-[132px] pr-14 pt-[132px] 2xl:px-[88px] 2xl:pr-[72px]">
          <div className="max-w-[920px] text-white">
            <p className="text-[15px] font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_2px_8px_rgba(2,6,23,0.72)] 2xl:text-base">
              Enterprise Access
            </p>
            <h1
              className="mt-5 max-w-[920px] bg-gradient-to-r from-[#F58220] via-[#21C7C7] to-[#2563EB] bg-clip-text pb-2 text-[clamp(3rem,4.15vw,4.75rem)] font-black leading-[1.14] tracking-normal text-transparent drop-shadow-[0_10px_22px_rgba(2,6,23,0.82)]"
              style={{
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "0.65px rgba(255,255,255,0.18)",
              }}>
              BPR Bonding Core System
            </h1>
            <p className="mt-7 max-w-[720px] text-xl font-semibold leading-[1.5] text-white/92 drop-shadow-[0_2px_10px_rgba(2,6,23,0.76)] 2xl:text-2xl">
              Digital Platform for Surety Bond &amp; Bank Guarantee Management.
            </p>
          </div>

          <div className="relative z-30 mt-8">
            <div className="grid max-w-[900px] gap-4 2xl:gap-5 min-[1180px]:grid-cols-3">
              {features.map(({ title, description, icon: Icon, accent, iconClassName, glowClassName }) => (
                <div
                  key={title}
                  className={cn(
                    "flex min-h-[142px] flex-col rounded-lg border bg-[rgba(15,23,42,0.45)] px-5 py-4 text-white shadow-2xl shadow-slate-950/25 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[rgba(15,23,42,0.56)] 2xl:min-h-[152px] 2xl:px-6 2xl:py-5",
                    glowClassName,
                  )}
                  style={{ borderColor: accent }}>
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-white/[0.08] shadow-lg 2xl:h-12 2xl:w-12"
                    style={{ borderColor: `${accent}66` }}>
                    <Icon className={cn("h-5 w-5", iconClassName)} aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-base font-bold leading-tight text-white drop-shadow-[0_1px_6px_rgba(2,6,23,0.65)] 2xl:text-lg">
                    {title}
                  </p>
                  <p className="mt-2 text-[13px] font-medium leading-[1.5] text-slate-200/90 2xl:text-sm">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="relative flex min-h-svh items-center justify-center bg-white px-5 py-8 sm:px-8">
        <div className="flex w-full max-w-[480px] -translate-y-6 flex-col sm:-translate-y-8 lg:-translate-y-10 2xl:-translate-y-12">
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/bpr-bonding.png" alt="BPR Bonding" className="h-16 w-auto object-contain" />
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">
            {children}
          </div>
        </div>

        <footer className="absolute bottom-6 left-5 right-5 text-center text-xs leading-6 text-slate-500 sm:bottom-8">
          <div className="font-semibold text-slate-700">&copy; BPR Bonding</div>
          <div>A Member of APG</div>
        </footer>
      </main>
    </section>
  );
};

export default CorporateLoginShell;
