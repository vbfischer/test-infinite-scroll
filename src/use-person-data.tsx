import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchQueryData } from "./api";

export const usePersonData = () => {
    const { data: queryData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["person"],
        queryFn: ({ pageParam }) => fetchQueryData(pageParam, 10),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.metadata.hasMore) {
                return lastPage.metadata.page + 1;
            }

            return undefined;
        },
    });

    const [personData, setPersonData] = useState(queryData?.pages.flatMap(p => p.data) ?? []);

    useEffect(() => {
        setPersonData(
            queryData?.pages.flatMap(p => p.data) ?? []
        )
    }, [queryData])

    return {
        data: personData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    };
};

