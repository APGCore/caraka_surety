import { CircleX } from "lucide-react";
import AlertBase, { AlertBaseProps } from "../alert-base";

const AlertError: React.FC<AlertBaseProps> = ({ title, desc, isShow = true }) => {
    return (
        <AlertBase
            className="border-red-500 border-2 bg-red-500/10"
            isShow={isShow}
            title={title}
            desc={desc}
            icon={CircleX}
            iconProps={{ className: "stroke-red-950" }}
        />
    );
};

export default AlertError;
