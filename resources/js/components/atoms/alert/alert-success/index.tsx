import { CircleCheck } from "lucide-react";
import React from "react";
import AlertBase, { AlertBaseProps } from "../alert-base";

const AlertSuccess: React.FC<AlertBaseProps> = ({ title, desc, isShow = true }) => {
  return (
    <AlertBase
      className="border-green-500 border-2 bg-green-500/10 mb-4"
      isShow={isShow}
      title={title}
      desc={desc}
      icon={CircleCheck}
      iconProps={{ className: "stroke-green-950" }}
    />
  );
};

export default AlertSuccess;
