import { cn } from "@/common/utils/cn";
import { Button } from "@/components/_shadcn-ui/button";
import { Card, CardContent } from "@/components/_shadcn-ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/_shadcn-ui/hover-card";
import { Input, PasswordInput } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { InputField } from "@/components/atoms/input-field";
import Loading from "@/components/atoms/loading";
import { PasswordInputField } from "@/components/atoms/password-input-field";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import { Link, router, useForm } from "@inertiajs/react";
import { pickBy } from "lodash";
import { Eye, EyeOff } from "lucide-react";
import React, { ComponentPropsWithRef, forwardRef, useEffect, useState } from "react";
import useLoginForm from "./login-form.hook";
import { greetingBasedOnDate } from "./login-form.util";

// text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70

interface LoginFormProps extends React.ComponentProps<"div"> {
  guarantors: any[];
  guarantorSelected: number;
  className?: string;
  setTab: (tab: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ className, guarantors, guarantorSelected, setTab, ...props }) => {
  const { data, errors, handleLogin, processing, setData } = useLoginForm();

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden rounded-none">
        <CardContent className="grid p-0 h-[450px] md:grid-cols-2">
          <div className="relative hidden bg-muted md:flex md:justify-center md:items-center ">
            <img
              src="/bpr-jastan.png"
              // src="/apg-core.png"
              alt="Image"
              className="absolute flex-shrink-0 inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            {/* <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                {guarantor?.picture ? (
                  <img
                    src={"storage/" + guarantor.picture}
                    alt=""
                    className="flex-shrink-0 h-auto w-auto cursor-pointer"
                  />
                ) : (
                  <h1 className="mt-[96px] text-1xl font-bold cursor-pointer z-30">{guarantor?.name || "Asuransi"}</h1>
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
            </HoverCard> */}
          </div>
          <div className="w-[360px] border-l-[1.4px] border-blue-950">
            <form id="login-form" onSubmit={handleLogin} className="px-6 flex flex-col mt-[30px]">
              <div className="flex min-w-[260px] flex-col gap-7 pb-4">
                <div className="text-start">
                  <h1 className="text-2xl font-bold">Hello!</h1>
                  <p className="text-2xl font-bold text-red-700 ">{greetingBasedOnDate()}</p>
                </div>
                <div className="grid gap-2">
                  <InputField
                    id="username"
                    label="User ID"
                    name="username"
                    required
                    value={data.username}
                    onChange={(e) => {
                      setData("username", e.target.value);
                    }}
                  />
                  <InputError message={errors.username} className="mt-1" />
                </div>
                <div className="grid gap-2">
                  <PasswordInputField
                    id="password"
                    label="Password"
                    required
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <InputError message={errors.password} className="mt-1" />
                </div>
                <div className="grid gap-2 mt-2">
                  <Button
                    form="login-form"
                    className="w-full uppercase  bg-red-700 hover:bg-red-500"
                    disabled={processing}>
                    <Loading isLoading={processing} className="mr-1 " /> Login
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-red-700 [&_span]:underline [&_span]:underline-offset-4 hover:[&_span]:text-red-700 [&_span]:cursor-pointer">
        Enter your credentials correctly. If you forget your password, please contact the{" "}
        <Link href={route("login.adminn")}>Admin</Link>.
        {/* or
        <span
          onClick={(e) => {
            e.preventDefault();
            handleDeleteSession();
          }}>
          Reset the session
        </span>
        . */}
      </div>
    </div>
  );
};

export default LoginForm;
