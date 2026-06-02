import GuestLayoutPage from "@/layouts/guest";
import LoginAdminForm from "@/pages/auth/login/_partial/login-admin-form";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { LoginPageProps } from "../login-page.type";

const LoginPage: LoginPageProps = ({ status, guarantors, guarantorSelected }) => {
  const [tab, setTab] = useState<string>("");

  return (
    <>
      {status && (
        <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-[#10B981] shadow-lg">
          {status}
        </div>
      )}
      <LoginAdminForm setTab={setTab} />
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
