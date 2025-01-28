import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layouts/admin";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./partials/update-password-form";
import UpdateProfileBprInformationForm from "./partials/update-profile-bpr-information-form";
import UpdateProfileInformationForm from "./partials/update-profile-information-form";

export default function Edit({
  mustVerifyEmail,
  status,
  auth,
  profile,
}: PageProps<{
  mustVerifyEmail: boolean;
  status?: string;
  auth: object;
  profile: object;
}>) {
  return (
    <AdminLayout user={auth?.user}>
      <Head title="Profile" />

      <div className="flex justify-center pt-2">
        <Tabs defaultValue="information" className="w-[100%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="information">Informasi BPR</TabsTrigger>
            <TabsTrigger value="account">Akun</TabsTrigger>
          </TabsList>
          <TabsContent value="information">
            <div className="pt-5 pb-12 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 flex items-center justify-center">
              <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 max-w-xl w-full">
                <UpdateProfileBprInformationForm profile={profile} className="max-w-xl" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="account">
            <div className="pt-5 pb-12 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
              <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 max-w-xl w-full">
                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
              </div>

              <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 max-w-xl w-full">
                <UpdatePasswordForm className="max-w-xl" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
