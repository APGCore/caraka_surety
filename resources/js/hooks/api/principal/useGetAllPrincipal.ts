import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllPrincipal = () => {
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    axios
      .get(route("references.principal.all"))
      .then((response) => {
        if (!ignore) {
          setPrincipals(response.data.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.log("ERROR GET ALL PRINCIPALS: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { principals, loading, error };
};

export default useGetAllPrincipal;
