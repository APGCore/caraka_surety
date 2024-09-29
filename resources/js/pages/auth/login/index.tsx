import GuestLayout from "@/layouts/guest";
import { Head } from "@inertiajs/react";
import { LoginPageProps } from "./login-page.type";
import LoginForm from "./partial/login-form";

const LoginPage: LoginPageProps = ({ status }) => {
  return (
    <>
      {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

      <LoginForm />
    </>
  );
};

export default LoginPage;

LoginPage.layout = (page: any) => {
  const pagePropsData = page.props;
  return (
    <GuestLayout>
      <Head title={pagePropsData?.page_settings?.title ?? "Login"} />
      {page}
    </GuestLayout>
  );
};
