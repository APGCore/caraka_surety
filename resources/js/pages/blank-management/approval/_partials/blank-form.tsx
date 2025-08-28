import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/_shadcn-ui/alert-dialog";
import { Button } from "@/components/_shadcn-ui/button";
import { Card, CardContent } from "@/components/_shadcn-ui/card";
import { Input } from "@/components/_shadcn-ui/input";
import Loading from "@/components/atoms/loading";
import InputLabel from "@/components/molecules/input/label-input";
import axios from "axios";
import React, { useState } from "react";

interface BlankFormProps {
  blanksUnApproved: any;
  links: any;
}

const BlankForm: React.FC<BlankFormProps> = ({ blanksUnApproved, links }) => {
  const [qtyBlank, setQtyBlank] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const submit = () => {
    setIsLoading(true);
    const blankApprove = blanksUnApproved.slice(0, qtyBlank);
    axios
      .post(route(links.approve), { blanks: blankApprove })
      .then(() => {
        setOpen(false);
        setQtyBlank(0);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="success" onClick={() => setOpen(true)}>
          Terima Blangko
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Terima Blangko</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-4 grid gap-2">
          <p className="text-[14pt]">Tuliskan Jumlah Blangko yang di setujui?</p>
          <p className="text-[11pt]">Jumlah Blangko yang belum di terima {blanksUnApproved.length}</p>

          <Card className="mt-2">
            <CardContent className="p-2">
              <div className="flex gap-x-2 justify-around">
                <div className="text-center space-y-2">
                  <h3>Blangko Pertama</h3>
                  <h3>{blanksUnApproved[0]?.number || "??"}</h3>
                </div>
                <div className="space-y-2">
                  <InputLabel htmlFor="qtyBlank" value="Jumlah" />

                  <Input
                    id="qtyBlank"
                    className="mt-1 block w-full"
                    type="number"
                    min={0}
                    max={blanksUnApproved.length}
                    value={qtyBlank}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      if (qty > blanksUnApproved.length) {
                        setQtyBlank(blanksUnApproved.length);
                      } else if (qty < 0) {
                        setQtyBlank(0);
                      } else {
                        setQtyBlank(qty);
                      }
                    }}
                    autoFocus
                    autoComplete="qtyBlank"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3>Blangko Terakhir</h3>
                  <h3>{blanksUnApproved[qtyBlank - 1]?.number || "??"}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-x-2 justify-end mt-7">
            <Button type="button" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="success" onClick={submit}>
              Terima <Loading isLoading={isLoading} />
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlankForm;
