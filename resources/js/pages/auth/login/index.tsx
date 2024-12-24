import GuestLayoutPage from "@/layouts/guest";
import { Head } from "@inertiajs/react";
import { LoginPageProps } from "./login-page.type";
import { NewLoginForm } from "./partial/new-login-form";

const LoginPage: LoginPageProps = ({ status }) => {
  return (
    <>
      {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <NewLoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

LoginPage.layout = (page: any) => {
  const pagePropsData = page.props;
  return (
    <GuestLayoutPage>
      <Head title={pagePropsData?.page_settings?.title ?? "Login"} />
      {page}
    </GuestLayoutPage>
  );
};
