import InputError from "@/components/common/input-error";
import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export function NewLoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onSuccess: () => {
        reset("username");
        reset("password");
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden ">
        <CardContent className="grid p-0 h-[450px] md:grid-cols-2">
          <div className="relative hidden bg-muted md:flex md:justify-center md:items-center ">
            <img
              src="/mesh.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            <div className="flex flex-col items-center gap-2 z-20">
              <h1 className="text-5xl font-bold">Welcome</h1>
              <img src="/bpr-bonding.png" alt="" className="flex-shrink-0 h-[60px] w-[120px]" />
            </div>
            <h1 className="absolute bottom-2 font-bold">A Member Of APG</h1>
          </div>
          <form id="login-form" onSubmit={submit} className="px-12 flex flex-col items-center justify-center">
            <div className="flex min-w-[260px] flex-col gap-6 ">
              <div className=" text-start">
                <h1 className="text-2xl font-bold">Hello! </h1>
                <p className="  text-muted-foreground">Good Morning</p>
              </div>
              <h1 className="text-xl text-center font-bold">Login Your Account </h1>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukan Username"
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
                  placeholder="Masukan Password"
                  onChange={(e) => setData("password", e.target.value)}
                />
                <InputError message={errors.password} className="mt-1" />
              </div>
              <Button form="login-form" className="w-full" disabled={processing}>
                <Loading isLoading={processing} className="mr-1" /> Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Enter your credentials correctly. If you forget your password, please contact the Admin.
      </div>
    </div>
  );
}
