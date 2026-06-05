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
    accent: "#C9A227",
    iconClassName: "text-[#E3C45A]",
    glowClassName: "shadow-[#C9A227]/20 hover:shadow-[#C9A227]/40",
  },
  {
    title: "Trusted Platform",
    description: "Integrated bonding operations platform.",
    icon: BadgeCheck,
    accent: "#C9A227",
    iconClassName: "text-[#E3C45A]",
    glowClassName: "shadow-[#C9A227]/20 hover:shadow-[#C9A227]/40",
  },
  {
    title: "Professional Service",
    description: "Reliable surety and guarantee support.",
    icon: BriefcaseBusiness,
    accent: "#C9A227",
    iconClassName: "text-[#E3C45A]",
    glowClassName: "shadow-[#C9A227]/20 hover:shadow-[#C9A227]/40",
  },
];

const CorporateLoginShell: React.FC<CorporateLoginShellProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        "grid min-h-[100dvh] h-[100dvh] overflow-hidden w-full bg-[#F8FAFC] text-[#1F2937] lg:grid-cols-2",
        className,
      )}>
      <style>{`
        html, body, #app, #root { height: 100%; margin: 0; overflow: hidden; }
        #phpdebugbar, .phpdebugbar { display: none !important; }
      `}</style>
      <aside className="relative hidden h-[100dvh] overflow-hidden lg:flex">
        <img
          src="/login-business-meeting.jpg"
          alt="Professional business meeting"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(2,6,23,0.56)_0%,rgba(15,23,42,0.38)_48%,rgba(2,6,23,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.03)_0%,rgba(2,6,23,0.09)_48%,rgba(2,6,23,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,162,39,0.15),transparent_30%),radial-gradient(circle_at_72%_28%,rgba(227,196,90,0.12),transparent_28%)]" />

        <div className="absolute left-[clamp(2rem,4vw,4.5rem)] top-[clamp(1.5rem,3vh,3rem)] z-20 inline-flex items-center rounded-xl border border-white/80 bg-white/95 px-4 py-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm 2xl:px-4 2xl:py-3">
          <img
            src="/bpr-bonding.png"
            alt="BPR Bonding"
            className="h-[clamp(2.5rem,5vh,3rem)] w-auto object-contain 2xl:h-14"
          />
        </div>

        <div className="absolute right-[clamp(2rem,4vw,4.5rem)] top-[clamp(1.5rem,3vh,3rem)] z-20">
          <img
            src="/Logo-jastan-ts1.png"
            alt="Business Partner Of Asuransi Jastan"
            className="h-[clamp(2.5rem,5vh,3rem)] w-auto object-contain drop-shadow-xl 2xl:h-14"
          />
        </div>

        <div className="absolute bottom-[clamp(1.5rem,3vh,2.5rem)] left-[clamp(2rem,4vw,4.5rem)] z-20">
          <img
            src="/Logo-APG-transparan.png"
            alt="APG Ardana Perkasa Group"
            className="h-[clamp(2.5rem,5vh,3rem)] w-auto object-contain drop-shadow-xl 2xl:h-14"
          />
        </div>

        <div className="relative z-10 flex h-[100dvh] w-full flex-col justify-center px-[clamp(2rem,4vw,4.5rem)] py-[clamp(2rem,5vh,6rem)]">
          <div className="max-w-[920px] text-white">
            <p className="text-[clamp(0.75rem,1.5vh,0.9375rem)] font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_2px_8px_rgba(2,6,23,0.72)] 2xl:text-base">
              Enterprise Access
            </p>
            <h1
              className="mt-[clamp(0.5rem,2vh,1.25rem)] max-w-[920px] bg-[linear-gradient(90deg,#F7D774_0%,#E0B84A_30%,#FF8A3D_60%,#E11D2E_100%)] bg-clip-text pb-2 text-[clamp(2.5rem,4vw,4.75rem)] font-black leading-[1.14] tracking-normal text-transparent drop-shadow-[0_10px_22px_rgba(2,6,23,0.82)]"
              style={{
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "0.65px rgba(255,255,255,0.18)",
              }}>
              BPR Bonding Core System
            </h1>
            <p className="mt-[clamp(0.75rem,2.5vh,1.75rem)] max-w-[720px] text-[clamp(1rem,1.5vw,1.25rem)] font-semibold leading-[1.5] text-white/92 drop-shadow-[0_2px_10px_rgba(2,6,23,0.76)] 2xl:text-2xl">
              Digital Platform for Surety Bond &amp; Bank Guarantee Management.
            </p>
          </div>

          <div className="relative z-30 mt-[clamp(1rem,4vh,2rem)]">
            <div className="grid max-w-[900px] gap-[clamp(0.5rem,1.5vh,1rem)] min-[1180px]:grid-cols-3">
              {features.map(({ title, description, icon: Icon, accent, iconClassName, glowClassName }) => (
                <div
                  key={title}
                  className={cn(
                    "flex min-h-[clamp(100px,12vh,142px)] flex-col justify-center rounded-lg border bg-[rgba(15,23,42,0.45)] px-[clamp(1rem,1.5vw,1.25rem)] py-[clamp(0.75rem,2vh,1rem)] text-white shadow-2xl shadow-slate-950/25 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-[rgba(15,23,42,0.56)]",
                    glowClassName,
                  )}
                  style={{ borderColor: accent }}>
                  <div
                    className="flex h-[clamp(2rem,4vh,2.75rem)] w-[clamp(2rem,4vh,2.75rem)] shrink-0 items-center justify-center rounded-lg border bg-white/[0.08] shadow-lg"
                    style={{ borderColor: `${accent}66` }}>
                    <Icon
                      className={cn("h-[clamp(1rem,2vh,1.25rem)] w-[clamp(1rem,2vh,1.25rem)]", iconClassName)}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-[clamp(0.5rem,1.5vh,1rem)] text-[clamp(0.875rem,1.1vw,1.125rem)] font-bold leading-tight text-white drop-shadow-[0_1px_6px_rgba(2,6,23,0.65)]">
                    {title}
                  </p>
                  <p className="mt-[clamp(0.25rem,1vh,0.5rem)] text-[clamp(0.75rem,0.9vw,0.875rem)] font-medium leading-[1.5] text-slate-200/90">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="relative flex h-[100dvh] items-center justify-center bg-white px-5 py-[clamp(1rem,3vh,2rem)] sm:px-8">
        <div className="flex w-full max-w-[480px] flex-col justify-center">
          <div className="mb-[clamp(1rem,3vh,2rem)] flex justify-center lg:hidden">
            <img src="/bpr-bonding.png" alt="BPR Bonding" className="h-[clamp(3rem,6vh,4rem)] w-auto object-contain" />
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-white p-[clamp(1.25rem,4vh,2rem)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-[clamp(1.5rem,4vh,2.5rem)]">
            {children}
          </div>
        </div>

        <footer className="absolute bottom-[clamp(1rem,3vh,2rem)] left-5 right-5 text-center text-xs leading-6 text-slate-500">
          <div className="font-semibold text-slate-700">&copy; BPR Bonding</div>
          <div>A Member of APG</div>
        </footer>
      </main>
    </section>
  );
};

export default CorporateLoginShell;
