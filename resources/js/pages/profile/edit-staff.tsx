import { Roles } from "@/common/types/roles";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./partials/update-password-form";
import UpdateProfileInformationForm from "./partials/update-profile-information-form";

export default function Edit({
  mustVerifyEmail,
  status,
  auth,
  roles,
  roles_names
}: PageProps<{
  mustVerifyEmail: boolean;
  status?: string;
  auth: object;
  roles: Roles;
  roles_names: object;
}>) {
  const propsData = {
    mustVerifyEmail,
    status,
    auth,
    roles,
    roles_names
  };
  return (
    <RoleBasedLayout propsData={propsData}>
      <Head title="Profile" />

      <div className="flex justify-center pt-2">
        <div className="pt-5 pb-12 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 max-w-xl w-full">
            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 max-w-xl w-full">
            <UpdatePasswordForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
}
