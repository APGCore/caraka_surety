import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllObligee = () => {
  const [obligees, setObligees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    axios
      .get(route("staff-obligee-get.all"))
      .then((response) => {
        if (!ignore) {
          setObligees(response.data.data);
          console.log("GET ALL OBLIGEES: ", response.data.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.log("ERROR GET ALL OBLIGEES: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { obligees, loading, error };
};

export default useGetAllObligee;
