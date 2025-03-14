import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetProfileLimit {
    guarantor_id: number;
    product_type_id: number;
    job_group: string;
    job_type: string;
}

const useGetProfileLimit = ({ guarantor_id, product_type_id, job_group, job_type }: IUseGetProfileLimit) => {
    const [profileLimit, setProfileLimit] = useState<{ limit: number }>({ limit: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        if (!ignore && guarantor_id && product_type_id && job_group && job_type) {
            axios
                .get(
                    route("api.guarantor-management.guarantor-product-type-limit.show", {
                        guarantor_id,
                        product_type_id,
                        job_group,
                        job_type
                    })
                )
                .then((response) => {
                    setProfileLimit(response.data.data);
                })
                .catch((error) => {
                    setError(error);
                    console.log("ERROR GET PROFILE LIMIT: ", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        return () => {
            ignore = true;
        };
    }, [guarantor_id, product_type_id, job_group, job_type]);

    return { profileLimit, loading, error };
};

export default useGetProfileLimit;
