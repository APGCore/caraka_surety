import { cn } from "@/common/utils/cn";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/_shadcn-ui/alert-dialog";
import { buttonVariants } from "@/components/_shadcn-ui/button";
import { Combobox } from "@/components/molecules/combobox";
import React from "react";

export type IBranchOfficeTypeModal = "initial" | "add-pairing-guarantor" | "add-pairing-branch-guarantor";

interface IModalBranchOffice {
    isOpen: boolean;
    handleOpen: (value: boolean) => void;
    type: IBranchOfficeTypeModal;
    guarantors?: any;
    branchGuarantors?: any;
    handleSelectGuarantor?: (value: any) => void;
    handleSelectBranchGuarantor?: (value: any) => void;
    handleCloseAction?: () => void;
}

const ModalBranchOffice: React.FC<IModalBranchOffice> = ({
    type,
    isOpen,
    handleOpen,
    guarantors,
    handleSelectGuarantor,
    branchGuarantors,
    handleSelectBranchGuarantor,
    handleCloseAction,
}) => {
    switch (type) {
        case "add-pairing-guarantor": {
            return (
                <AlertDialog open={isOpen} onOpenChange={handleOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tambah Asuransi Pairing</AlertDialogTitle>
                            <AlertDialogDescription>Aksi ini menambah Asuransi Pairing.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div>
                            <Combobox
                                datas={guarantors}
                                labelKey="name"
                                valueKey="name"
                                placeholder="Pilih Asuransi"
                                checkedWithCondition={true}
                                notFoundText="Asuransi tidak ditemukan!"
                                onSelect={(guarantor) => {
                                    if (guarantor) {
                                        handleSelectGuarantor?.(guarantor);
                                    }
                                }}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                className={cn(
                                    buttonVariants({
                                        variant: "destructive",
                                    }),
                                )}>
                                Batal
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        }
        case "add-pairing-branch-guarantor": {
            return (
                <AlertDialog open={isOpen} onOpenChange={handleOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tambah Cabang Asuransi Pairing</AlertDialogTitle>
                            <AlertDialogDescription>Aksi ini menambah Cabang Asuransi Pairing.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div>
                            <Combobox
                                datas={branchGuarantors}
                                labelKey="name"
                                valueKey="name"
                                placeholder="Pilih Cabang Asuransi Pairing"
                                checkedWithCondition={true}
                                notFoundText="Cabang Asuransi tidak ditemukan!"
                                onSelect={(branchGuarantor) => {
                                    if (branchGuarantor) {
                                        handleSelectBranchGuarantor?.(branchGuarantor);
                                    }
                                }}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                className={cn(
                                    buttonVariants({
                                        variant: "destructive",
                                    }),
                                )}
                                onClick={() => {
                                    handleCloseAction?.();
                                }}>
                                Batal
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        }

        default: {
            return null;
        }
    }
};

export default ModalBranchOffice;
