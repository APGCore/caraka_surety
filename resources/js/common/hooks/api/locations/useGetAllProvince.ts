import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllProvince = () => {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    axios
      .get(route("references.province.all"))
      .then((response) => {
        if (!ignore) {
          setProvinces(response.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.log("ERROR GET ALL provinces: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { provinces, loading, error };
};

export default useGetAllProvince;
