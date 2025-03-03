import { cn } from "@/common/utils/cn";
import { Button } from "@/components/_shadcn-ui/button";
import { Card, CardContent } from "@/components/_shadcn-ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/_shadcn-ui/hover-card";
import { Input, PasswordInput } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import Loading from "@/components/atoms/loading";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useEffect } from "react";
import useLoginForm from "./login-form.hook";
import { greetingBasedOnDate } from "./login-form.util";

interface LoginFormProps extends React.ComponentProps<"div"> {
  guarantors: any[];
  guarantorSelected: number;
  className?: string;
  setTab: (tab: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ className, guarantors, guarantorSelected, setTab, ...props }) => {
  const { data, errors, handleLogin, processing, setData } = useLoginForm();
  const guarantor = guarantors.find((guarantor) => guarantor.id === guarantorSelected);
  const handleSelectGuarantor = (guarantorId: number) => {
    setData("guarantor_id", guarantorId);
    router.get(route("login"), pickBy({ guarantor_id: guarantorId }), { preserveState: true, preserveScroll: true });
  };

  useEffect(() => {
    setData("guarantor_id", guarantorSelected);
  }, []);

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden ">
        <CardContent className="grid p-0 h-max md:grid-cols-2">
          <div className="relative hidden bg-muted md:flex md:justify-center md:items-center ">
            <img
              src="/mesh.png"
              alt="Image"
              className="absolute flex-shrink-0 inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            <div className="flex flex-col items-center gap-10 z-20">
              <h1 className="text-5xl font-bold">Welcome</h1>
              <div className="flex flex-col items-center gap-1">
                <img src="/bpr-bonding.png" alt="" className="flex-shrink-0 h-[88px] w-[180px]" />
                <h1 className="text-1xl font-bold">X</h1>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    {guarantor?.picture ? (
                      <img
                        src={"storage/" + guarantor.picture}
                        alt=""
                        className="flex-shrink-0 h-auto w-auto cursor-pointer"
                      />
                    ) : (
                      <h1 className="text-1xl font-bold cursor-pointer">{guarantor?.name || "Asuransi"}</h1>
                    )}
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <Combobox
                      datas={guarantors}
                      labelKey={"name"}
                      valueKey={"name"}
                      defaultValue={guarantorSelected}
                      placeholder={"Pilih Asuransi"}
                      className={"min-w-[160px]"}
                      onSelect={(value) => handleSelectGuarantor(value.id)}
                    />
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
            <h1 className="absolute bottom-2 font-bold">A Member Of APG</h1>
          </div>
          <form id="login-form" onSubmit={handleLogin} className="px-12 flex flex-col items-center justify-center">
            <div className="flex min-w-[260px] flex-col gap-6 pb-4">
              <div className="text-start mt-6">
                <h1 className="text-2xl font-bold">Hello!</h1>
                <p className="text-muted-foreground">{greetingBasedOnDate()}</p>
              </div>
              <div>
                <h1 className="text-l text-start font-bold">Please enter your Credentials</h1>
                <h1 className="text-xs text-start text-black/60">with your username and password.</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter Username"
                  required
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                />
                <InputError message={errors.username} className="mt-1" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <PasswordInput
                  id="password"
                  type="password"
                  required
                  value={data.password}
                  placeholder="Enter Password"
                  onChange={(e) => setData("password", e.target.value)}
                />
                <InputError message={errors.password} className="mt-1" />
              </div>
              <div className="grid gap-2">
                <Button form="login-form" className="w-full" disabled={processing}>
                  <Loading isLoading={processing} className="mr-1" /> Login
                </Button>
                <Button type="button" onClick={() => setTab("admin")}>
                  Login Admin
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Enter your credentials correctly. If you forget your password, please contact the Admin.
      </div>
    </div>
  );
};

export default LoginForm;
