import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const SCORING_QUERY_KEY = {
  SCORING: "scoring",
};

interface ScoringCategories {
  id: string;
  name: string;
  max_point: string;
  questions: {
    id: string;
    name: string;
    options: Array<{
      id: string;
      name: string;
      point: string;
    }>;
  }[];
}

interface Scoring {
  id: number | null;
  min_point: number | null;
  name: string;
  updated_at: string;
  created_at: string;
  deleted_at: null;
}

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
