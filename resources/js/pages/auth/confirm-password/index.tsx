import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import PrimaryButton from "@/components/common/primary-button";
import TextInput from "@/components/common/text-input";
import GuestLayout from "@/layouts/guest-layout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { ConfirmPasswordPageProps } from "./confirm-password-page.type";

const ConfirmPasswordPage: ConfirmPasswordPageProps = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.confirm"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <>
      <div className="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password before continuing.
      </div>
      <form onSubmit={submit}>
        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            isFocused={true}
            onChange={(e) => setData("password", e.target.value)}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>
        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Confirm
          </PrimaryButton>
        </div>
      </form>
    </>
  );
};

export default ConfirmPasswordPage;

ConfirmPasswordPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <GuestLayout>
      <Head title={pagePropsData?.page_settings?.title ?? "Confirm Password"} />
      {page}
    </GuestLayout>
  );
};
