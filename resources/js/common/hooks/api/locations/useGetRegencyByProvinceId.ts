import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetRegencyByProvinceId {
    province_id?: number | string | null;
}

const useGetRegencyByProvinceId = ({ province_id }: IUseGetRegencyByProvinceId) => {
    const [regencies, setRegencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (province_id) {
            let ignore = false;

            axios
                .get(
                    route("references.regency.by-province", {
                        province_id: province_id,
                    }),
                )
                .then((response) => {
                    if (!ignore) {
                        setRegencies(response.data);
                    }
                })
                .catch((error) => {
                    setError(error);
                    console.log("ERROR GET REGENCY BY PROVINCE: ", error);
                })
                .finally(() => {
                    setLoading(false);
                });

            return () => {
                ignore = true;
            };
        }
    }, [province_id]);

    return { regencies, loading, error };
};

export default useGetRegencyByProvinceId;
