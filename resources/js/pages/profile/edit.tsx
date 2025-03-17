import { Roles } from "@/common/types/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_shadcn-ui/tabs";
import RoleBasedLayout from "@/layouts/role-based-layout";
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
    roles,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    auth: object;
    profile: object;
    roles: Roles;
}>) {
    const propsData = {
        mustVerifyEmail,
        status,
        auth,
        profile,
        roles,
    };
    return (
        <RoleBasedLayout propsData={propsData}>
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
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>

                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 max-w-xl w-full">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleBasedLayout>
    );
}
