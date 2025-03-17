import { AlertTriangle } from "lucide-react";
import React from "react";
import AlertBase, { AlertBaseProps } from "../alert-base";

const AlertWarning: React.FC<AlertBaseProps> = ({ title, desc, isShow = true }) => {
    return (
        <AlertBase
            className="border-yellow-500 border-2 bg-yellow-500/10"
            isShow={isShow}
            title={title}
            desc={desc}
            icon={AlertTriangle}
            iconProps={{ className: "stroke-yellow-950" }}
        />
    );
};

export default AlertWarning;
