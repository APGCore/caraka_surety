import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StaffLayoutPage from "@/layouts/staff";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import SubmissionCreateHeader from "./_partials/create-page-header";
import { SubmissionCreatePageProps } from "./create-page.type";

const stepperDatas = [
  {
    id: 1,
    name: "Data Perusahaan",
  },
  {
    id: 2,
    name: "Dokumen Pendukung",
  },
  {
    id: 3,
    name: "Pengajuan Kontrak",
  },
  {
    id: 4,
    name: "Skoring",
  },
];

const SteppedProgress = () => {
  const [stepsComplete, setStepsComplete] = useState(0);
  const numSteps = stepperDatas.length;

  const handleSetStep = (num) => {
    if ((stepsComplete === 0 && num === -1) || (stepsComplete === numSteps && num === 1)) {
      return;
    }

    setStepsComplete((pv) => pv + num);
  };

  return (
    <div className="px-4 py-14 bg-white">
      <div className="p-8 bg-white shadow-lg rounded-md w-full max-w-2xl mx-auto">
        <Steps steps={stepperDatas} stepsComplete={stepsComplete} />
        <div className="p-2 my-6 h-48 bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg"></div>
        <div className="flex items-center justify-end gap-2">
          <button className="px-4 py-1 rounded hover:bg-gray-100 text-black" onClick={() => handleSetStep(-1)}>
            Prev
          </button>
          <button className="px-4 py-1 rounded bg-black text-white" onClick={() => handleSetStep(1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const Steps = ({ steps, stepsComplete }) => {
  return (
    <div className="flex items-center  justify-between gap-3">
      {steps.map((step, index) => {
        const isActive = step.id <= stepsComplete;
        return (
          <React.Fragment key={step.id}>
            <Step num={step.id} name={step.name} isActive={isActive} />
            {index !== steps.length - 1 && (
              <div className="w-full h-1 -mt-14 rounded-full bg-gray-200 relative">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full"
                  animate={{ width: isActive ? "100%" : 0 }}
                  transition={{ ease: "easeIn", duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Step = ({ num, name, isActive }) => {
  return (
    <div className="relative text-center flex flex-col items-center justify-start  h-[100px]">
      <div
        className={`w-10 h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-sm relative z-10 transition-colors duration-300 ${
          isActive ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 text-gray-300"
        }`}>
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.svg
              key="icon-marker-check"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1.6em"
              width="1.6em"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}>
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path>
            </motion.svg>
          ) : (
            <motion.span
              key="icon-marker-num"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}>
              {num}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="text-sm mt-2">{name}</div>
      {/* {isActive && <div className="absolute z-0 -inset-1.5 bg-indigo-100 rounded-full animate-pulse" />} */}
    </div>
  );
};

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  return (
    <div className="w-[800px] mt-[50px] mx-auto ">
      <SteppedProgress />
      {/* <form className="grid gap-6">
        <div className="grid gap-[5px]">
          <Label className="text-md">Nama</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">NPWP</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">No. Telepon</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">NIB</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">SIUP/SIUJK</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Nama Direksi</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Jabatan</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Nomor Handphone</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Komisaris</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Perusahaan Berdiri Tahun</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Akte Perubahan Terakhir</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Alamat</Label>
          <Textarea className="text-md" />
        </div>
      </form> */}
    </div>
  );
};

export default SubmissionCreatePage;

SubmissionCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <StaffLayoutPage user={pagePropsData?.auth?.user}>
      <SubmissionCreateHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </StaffLayoutPage>
  );
};
