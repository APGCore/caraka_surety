import axios from "axios";
import { useEffect, useState } from "react";

const useGetSourceOfFund = () => {
  const [sourceOfFunds, setSourceOfFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    axios
      .get(route("references.source-of-funds.all"))
      .then((response) => {
        if (!ignore) {
          setSourceOfFunds(response.data.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.log("ERROR GET ALL SOURCE OF FUND: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { sourceOfFunds, loading, error };
};

export default useGetSourceOfFund;
