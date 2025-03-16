import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllBank = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        axios
            .get(route("staff-bank-get.all"))
            .then((response) => {
                if (!ignore) {
                    setBanks(response.data.data);
                }
            })
            .catch((error) => {
                setError(error);
                console.log("ERROR GET ALL BANK: ", error);
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, []);

    return { banks, loading, error };
};

export default useGetAllBank;
