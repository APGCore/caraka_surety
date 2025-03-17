import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BranchGuarantorForm from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-form";
import BranchGuarantorHeader from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-header";
import { BranchGuarantorUtils } from "@/pages/admin/guarantor-management/branch-guarantor/branch-guarantor.utils";
import { BranchGuarantorEditPageProps } from "@/pages/admin/guarantor-management/branch-guarantor/edit/branch-guarantor-edit-page.type";

const BranchGuarantorEditPage: BranchGuarantorEditPageProps = ({ branchGuarantor }) => {
    return (
        <Card className="w-[800px] mx-auto">
            <CardHeader>
                <CardTitle>Mengubah Data Cabang Asuransi</CardTitle>
                <CardDescription>Untuk mengubah data cabang asuransi</CardDescription>
            </CardHeader>
            <CardContent>
                <BranchGuarantorForm
                    guarantor={branchGuarantor.head}
                    branchGuarantor={branchGuarantor}
                    routeSubmit={route(BranchGuarantorUtils.link.update, branchGuarantor.id)}
                    routeBack={route(BranchGuarantorUtils.link.index, { guarantor: branchGuarantor.headquarter_id })}
                />
            </CardContent>
        </Card>
    );
};

export default BranchGuarantorEditPage;

BranchGuarantorEditPage.layout = (page: any) => {
    const pagePropsData = page.props;
    const params = { guarantor: pagePropsData.branchGuarantor.headquarter_id };

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <BranchGuarantorHeader
                title={pagePropsData?.page_settings?.title}
                route={route(BranchGuarantorUtils.link.index, params)}
            />
            {page}
        </RoleBasedLayout>
    );
};
