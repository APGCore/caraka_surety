import InputError from "@/components/common/input-error";
import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
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
    <form id="login-form" onSubmit={submit} className="mt-8 flex flex-col gap-6 ">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Masukan Username"
          required
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        <InputError message={errors.email} className="mt-1" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          type="password"
          required
          value={data.password}
          placeholder="Masukan password"
          onChange={(e) => setData("password", e.target.value)}
        />
        <InputError message={errors.password} className="mt-1" />
      </div>
      <Button form="login-form" className="w-full" disabled={processing}>
        <Loading isLoading={processing} className="mr-1" /> Masuk
      </Button>
    </form>
  );
};

export default LoginForm;
