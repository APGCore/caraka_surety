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
    icon: ShieldCheck,
  },
  {
    title: "Trusted Platform",
    icon: BadgeCheck,
  },
  {
    title: "Professional Service",
    icon: BriefcaseBusiness,
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B3B8C]/90 via-[#0B3B8C]/58 to-[#D71920]/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.22),transparent_30%),linear-gradient(160deg,rgba(11,59,140,0.2),rgba(215,25,32,0.18))]" />

        <div className="absolute left-8 top-8 z-20 xl:left-12 xl:top-10">
          <img
            src="/logo-corebprbonding2.png"
            alt="BPR Bonding Core System"
            className="h-12 w-auto object-contain drop-shadow-xl xl:h-14"
          />
        </div>

        <div className="absolute right-8 top-8 z-20 xl:right-12 xl:top-10">
          <img
            src="/logo-jastan-ts1.png"
            alt="Business Partner Of Asuransi Jastan"
            className="h-12 w-auto object-contain drop-shadow-xl xl:h-14"
          />
        </div>

        <div className="absolute bottom-6 left-8 z-20 xl:bottom-8 xl:left-10">
          <img
            src="/Logo-APG-transparan.png"
            alt="A Member Of APG Ardana Perkasa Group"
            className="h-11 w-auto object-contain drop-shadow-xl xl:h-14"
          />
        </div>

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          <div className="pt-36 xl:pt-40">
            <div className="max-w-xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Enterprise Access</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">BPR Bonding Core System</h1>
              <p className="mt-5 max-w-lg text-xl font-medium leading-relaxed text-white/88">
                Digital Platform for Surety Bond &amp; Bank Guarantee Management
              </p>
            </div>
          </div>

          <div className="relative z-30 pb-20 xl:pb-24">
            <div className="grid gap-4 xl:grid-cols-3">
              {features.map(({ title, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/24 bg-white/14 p-4 text-white shadow-2xl shadow-slate-950/15 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="relative flex min-h-svh items-center justify-center bg-white px-5 py-8 sm:px-8 lg:bg-white">
        <div className="flex w-full max-w-[480px] flex-col">
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/logo-corebprbonding2.png" alt="BPR Bonding Core System" className="h-16 w-auto object-contain" />
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">
            {children}
          </div>
        </div>

        <footer className="absolute bottom-6 left-5 right-5 text-center text-xs leading-6 text-slate-500 sm:bottom-8">
          <div className="font-semibold text-slate-700">&copy; BPR Bonding</div>
          <div>A Member of APG Group</div>
        </footer>
      </main>
    </section>
  );
};

export default CorporateLoginShell;
