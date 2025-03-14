import { InfoIcon } from "lucide-react";
import React from "react";
import AlertBase, { AlertBaseProps } from "../alert-base";

const AlertInfo: React.FC<AlertBaseProps> = ({ title, desc, isShow = true }) => {
  return (
    <AlertBase
      className="border-blue-500 border-2 bg-blue-500/10"
      isShow={isShow}
      title={title}
      desc={desc}
      icon={InfoIcon}
      iconProps={{ className: "stroke-blue-950" }}
    />
  );
};

export default AlertInfo;
