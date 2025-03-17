import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllGuarantor = () => {
    const [guarantors, setGuarantors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        axios
            .get(route("references.guarantor.all"))
            .then((response) => {
                if (!ignore) {
                    setGuarantors(response.data.data);
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

    return { guarantors, loading, error };
};

export default useGetAllGuarantor;
