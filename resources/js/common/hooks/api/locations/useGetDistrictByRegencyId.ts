import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetDistrictByRegencyId {
  regency_id?: number | string | null;
}

const useGetDistrictByRegencyId = ({ regency_id }: IUseGetDistrictByRegencyId) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (regency_id) {
      let ignore = false;

      axios
        .get(
          route("references.district.by-regency", {
            regency_id: regency_id,
          }),
        )
        .then((response) => {
          if (!ignore) {
            setDistricts(response.data);
          }
        })
        .catch((error) => {
          setError(error);
          console.log("ERROR GET DISTRICT BY REGENCY: ", error);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => {
        ignore = true;
      };
    }
  }, [regency_id]);

  return { districts, loading, error };
};

export default useGetDistrictByRegencyId;
