import { useQuery } from "@tanstack/react-query";
import { getTopBuyers } from "../api/topBuyerApi";

export function useTopBuyers(size = 100) {
    return useQuery({
        queryKey: ["top-buyers", size],
        queryFn: () => getTopBuyers(size),
    });
}
