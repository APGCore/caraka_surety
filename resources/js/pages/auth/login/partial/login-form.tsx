import InputError from "@/components/common/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler } from "react";

const LoginForm = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onSuccess: () => {
        reset("email");
        reset("password");
      },
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} id="login-form" className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukan email"
              required
              value={data.email}
              onChange={(e: any) => setData("email", e.target.value)}
            />
            <InputError message={errors.email} className="mt-2" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              type="password"
              required
              value={data.password}
              placeholder="Masukan password"
              onChange={(e: any) => setData("password", e.target.value)}
            />
            <InputError message={errors.password} className="mt-2" />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button form="login-form" className="w-full" disabled={processing}>
          {processing && <RotateCw className="animate-spin mr-2" />}
          Sign in
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
