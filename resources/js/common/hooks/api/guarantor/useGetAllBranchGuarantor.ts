import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllBranchGuarantor = () => {
    const [branchGuarantors, setBranchGuarantors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        axios
            .get(route("references.guarantor.all-branch"))
            .then((response) => {
                if (!ignore) {
                    setBranchGuarantors(response.data.data);
                }
            })
            .catch((error) => {
                setError(error);
                console.log("ERROR GET ALL GUARANTOR: ", error);
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    return { branchGuarantors, loading, error };
};

export default useGetAllBranchGuarantor;
