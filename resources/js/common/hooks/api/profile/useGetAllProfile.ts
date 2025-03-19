import axios from "axios";
import { useEffect, useState } from "react";

/* Profile this mean Branch*/
const useGetAllProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    axios
      .get(route("references.profile.all"))
      .then((response) => {
        if (!ignore) {
          setProfiles(response.data.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.log("ERROR GET ALL PROFILES: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { profiles, loading, error };
};

export default useGetAllProfile;
