import GuestLayoutPage from "@/layouts/guest";
import { Head } from "@inertiajs/react";
import { LoginPageProps } from "./login-page.type";
import LoginForm from "./partial/login-form";

const LoginPage: LoginPageProps = ({ status }) => {
  return (
    <>
      {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

      <section className=" w-screen h-screen">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <aside className="relative block h-16   lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </aside>
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-xl">
              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Welcome APG-Core System</h1>
              <p className="mt-4 leading-relaxed text-gray-500">Please enter your username and password to continue.</p>
              <LoginForm />
            </div>
          </main>
        </div>
      </section>
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
