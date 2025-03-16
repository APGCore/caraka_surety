import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const SOURCE_OF_FUND_QUERY_KEY = {
    SOURCE_OF_FUND: "source_of_fund",
};

export const useGetAllSourceOfFund = (querySetting?: QueryOptions) => {
    return useQuery({
        queryKey: [SOURCE_OF_FUND_QUERY_KEY.SOURCE_OF_FUND],
        queryFn: async () => {
            const response = await axios.get(route("api.source-of-fund.source-of-fund.all"));
            return response.data.data;
        },
        ...querySetting,
    });
};
