import InputError from "@/components/common/input-error";
import PrimaryButton from "@/components/common/primary-button";
import TextInput from "@/components/common/text-input";
import GuestLayout from "@/layouts/guest-layout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { ForgotPasswordPageProps } from "./forgot-password-page.type";

const ForgotPassword: ForgotPasswordPageProps = ({ status }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address and we will email you a password reset
        link that will allow you to choose a new one.
      </div>

      {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

      <form onSubmit={submit}>
        <TextInput
          id="email"
          type="email"
          name="email"
          value={data.email}
          className="mt-1 block w-full"
          isFocused={true}
          onChange={(e) => setData("email", e.target.value)}
        />

        <InputError message={errors.email} className="mt-2" />

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Email Password Reset Link
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;

ForgotPassword.layout = (page: any) => {
  const pagePropsData = page.props;
  return (
    <GuestLayout>
      <Head title={pagePropsData?.page_settings?.title ?? "Forgot Password"} />
      {page}
    </GuestLayout>
  );
};
