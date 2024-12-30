import { makeData } from "./types";

const defaultData = makeData(10_000);

export const fetchQueryData = async (page: number, pageSize: number) => {
    console.log('fetchQueryData', page, pageSize);
    const startNdx = page * pageSize;
    const endNdx = startNdx + pageSize;
    const dataSlice = defaultData.slice(startNdx, endNdx);

    return Promise.resolve({
        data: dataSlice,
        metadata: {
            total: defaultData.length,
            page,
            limit: pageSize,
            hasMore: endNdx < defaultData.length,
        }
    });
};

export type FetchQueryDataResponse = Awaited<ReturnType<typeof fetchQueryData>>;
