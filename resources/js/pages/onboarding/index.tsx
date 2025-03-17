import { Button } from "@/components/_shadcn-ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import NewCombobox from "@/components/atoms/next-combobox";
import GuestLayoutPage from "@/layouts/guest";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useState } from "react";

interface IGuarantor {
    id?: number;
    name?: string;
    picture?: string;
}

interface OnboardingPageProps {
    guarantors: IGuarantor[];
}

type OnboardingPages = React.FC<OnboardingPageProps> & {
    layout?: (page: any) => JSX.Element;
};

const OnboardingPage: OnboardingPages = ({ guarantors }) => {
    const [selectedItem, setSelectedItem] = useState<number | undefined>(undefined);

    const { data, setData, post, processing, errors, reset } = useForm<{
        guarantor_id: number;
        guarantor_name: string;
    }>({
        guarantor_name: "",
        guarantor_id: 0,
    });

    const handleSubmit = () => {
        post(route("onboarding.set-guarantor"), {
            onSuccess: () => {},
        });
    };

    return (
        <Card className="p-0 w-[365px]">
            <CardHeader>
                <CardTitle className="text-center">Welcome to APG CORE</CardTitle>
                <CardDescription className="text-center">Pilih Asuransi</CardDescription>
            </CardHeader>
            <CardContent className="h-[120px] space-y-4 items-center flex flex-col">
                <NewCombobox
                    valueKey="id"
                    labelKey="name"
                    placeholder="Pilih asuransi..."
                    searchPlaceholder="Cari asuransi"
                    notFoundText="Asuransi tidak ditemukan..."
                    data={guarantors}
                    isLoading={false}
                    defaultValue={selectedItem ? selectedItem : undefined} // specify with valueKey
                    onSelect={(item) => {
                        // it will return full obj of selected item
                        console.log(item);
                        setSelectedItem(item ? item.id : null);
                        setData("guarantor_id", item ? item.id : null);
                        setData("guarantor_name", item ? item.name : "");
                    }}
                />

                <Button
                    disabled={!selectedItem}
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="w-max uppercase  bg-red-700 hover:bg-red-500">
                    Submit
                </Button>
            </CardContent>
            <CardFooter className="justify-center">
                <Link
                    href={route("login.adminn")}
                    className="text-sm text-center hover:text-red-500  text-red-700 font-semibold underline underline-offset-2">
                    Anda sebagai Admin?
                </Link>
            </CardFooter>
        </Card>
    );
};

export default OnboardingPage;

OnboardingPage.layout = (page: any) => {
    const pagePropsData = page.props;
    return (
        <GuestLayoutPage>
            <Head title={pagePropsData?.page_settings?.title ?? "Onboarding"} />
            {page}
        </GuestLayoutPage>
    );
};
