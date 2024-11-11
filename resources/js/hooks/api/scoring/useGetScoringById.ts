import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetScoringById {
  selectedScoringId?: number | string | null;
}

const useGetScoringById = ({ selectedScoringId }: IUseGetScoringById) => {
  const [scorings, setScorings] = useState<
    Array<{
      id: string;
      name: string;
      questions: Array<{
        id: string;
        name: string;
        options: Array<{
          id: string;
          name: string;
          point: string;
        }>;
      }>;
    }>
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (selectedScoringId) {
      axios
        .get(route("staff-scoring-get.byId", { scoring: selectedScoringId }))
        .then((response) => {
          if (!ignore) {
            setScorings(response.data.categories);
          }
        })
        .catch((error) => {
          setError(error);
          console.log("ERROR GET SCORING BY ID ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [selectedScoringId]);

  return { scorings, loading, error };
};

export default useGetScoringById;
