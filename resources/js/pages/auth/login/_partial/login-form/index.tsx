import { cn } from "@/common/utils/cn";
import { Button } from "@/components/_shadcn-ui/button";
import Loading from "@/components/atoms/loading";
import InputError from "@/components/molecules/input/error-input";
import { Link } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import CorporateLoginShell from "../corporate-login-shell";
import useLoginForm from "./login-form.hook";

interface LoginFormProps extends React.ComponentProps<"div"> {
  guarantors: any[];
  guarantorSelected: number;
  className?: string;
  setTab: (tab: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ className, guarantors, guarantorSelected, setTab, ...props }) => {
  const { data, errors, handleLogin, processing, setData } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <CorporateLoginShell className={className}>
      <div {...props}>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0B3B8C]">BPR Bonding</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#1F2937] sm:text-4xl">Welcome Back!</h2>
          <p className="mt-3 text-base text-slate-500">Silakan masuk ke akun Anda</p>
        </div>

        <form id="login-form" onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
              User ID
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              value={data.username}
              onChange={(e) => setData("username", e.target.value)}
              aria-invalid={errors.username ? "true" : "false"}
              className={cn(
                "h-12 w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 text-sm text-[#1F2937] shadow-sm transition placeholder:text-slate-400 focus:border-[#0B3B8C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B3B8C]/10",
                errors.username && "border-[#D71920] focus:border-[#D71920] focus:ring-[#D71920]/10",
              )}
              placeholder="Masukkan User ID"
            />
            <InputError message={errors.username} className="mt-2" />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                aria-invalid={errors.password ? "true" : "false"}
                className={cn(
                  "h-12 w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 pr-12 text-sm text-[#1F2937] shadow-sm transition placeholder:text-slate-400 focus:border-[#0B3B8C] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B3B8C]/10",
                  errors.password && "border-[#D71920] focus:border-[#D71920] focus:ring-[#D71920]/10",
                )}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#0B3B8C] focus:outline-none focus:ring-4 focus:ring-[#0B3B8C]/10">
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <InputError message={errors.password} className="mt-2" />
          </div>

          <Button
            form="login-form"
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#D71920] to-[#B9151B] text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#D71920]/25 transition duration-300 hover:-translate-y-0.5 hover:from-[#B9151B] hover:to-[#D71920] hover:shadow-xl hover:shadow-[#D71920]/30 focus:ring-4 focus:ring-[#D71920]/20"
            disabled={processing}>
            <Loading isLoading={processing} className="mr-2" /> Masuk
          </Button>

          <p className="text-center text-xs leading-5 text-slate-500">
            Enter your credentials correctly. If you forget your password, please contact the{" "}
            <Link href={route("login.adminn")} className="font-semibold text-[#D71920] transition hover:text-[#0B3B8C]">
              Admin
            </Link>
            .
          </p>
        </form>
      </div>
    </CorporateLoginShell>
  );
};

export default LoginForm;
