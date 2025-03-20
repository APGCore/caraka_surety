import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const SCORING_QUERY_KEY = {
  SCORING: "scoring",
};

export const useGetScoringById = (scoringId?: string | number, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [SCORING_QUERY_KEY.SCORING, scoringId],
    queryFn: async () => {
      const response = await axios.get(route("api.scoring-management.scoring.get-by-id", { scoring: scoringId }));
      const categories = response?.data?.categories;
      const quiz = response?.data;

      return {
        scorings: categories,
        scoring: quiz,
      };
    },
    enabled: !!scoringId,
    ...querySetting,
  });
};
