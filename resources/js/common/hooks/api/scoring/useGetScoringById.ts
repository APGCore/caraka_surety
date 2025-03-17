import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetScoringById {
    selectedScoringId?: number | string | null;
}

const useGetScoringById = ({ selectedScoringId }: IUseGetScoringById) => {
    const [categories, setCategories] = useState<
        Array<{
            id: string;
            name: string;
            max_point: string;
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
    const [scoring, setScoring] = useState<{
        id: number | null;
        min_point: number | null;
        name: string;
        updated_at: string;
        created_at: string;
        deleted_at: null;
    }>({
        id: null,
        min_point: null,
        name: "",
        updated_at: "",
        created_at: "",
        deleted_at: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        if (selectedScoringId) {
            axios
                .get(route("staff-scoring-get.byId", { scoring: selectedScoringId }))
                .then((response) => {
                    if (!ignore) {
                        setCategories(response.data.categories);
                        setScoring(response.data);
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

    return { scorings: categories, scoring, loading, error };
};

export default useGetScoringById;
