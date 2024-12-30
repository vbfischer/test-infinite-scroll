import React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from '@tanstack/react-virtual'

import { usePersonData } from "./use-person-data";
import { Person } from "./types";

const columnHelper = createColumnHelper<Person>();

const columns = [
    columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
        cell: (info) => info.getValue(),
    }),
];

function App() {
    const parentRef = React.useRef(null)

    const { data: personData, fetchNextPage, isFetchingNextPage, hasNextPage } = usePersonData();
    const table = useReactTable({
        data: personData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 45,
        overscan: 5
    })

    const virtualItems = virtualizer.getVirtualItems();

    React.useEffect(() => {
        const [lastItem] = [...virtualItems].reverse()

        if (!lastItem) {
            return
        }

        if (
            lastItem.index >= rows.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage()
        }
    }, [
        hasNextPage,
        fetchNextPage,
        rows.length,
        isFetchingNextPage,
        virtualItems,
    ])

    return (
        <main className="flex flex-col items-center gap-8 py-16 max-w-[1280px] mx-auto" ref={parentRef}>
            <h1 className="text-4xl font-bold">Hello, world!</h1>
            <table className="table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {virtualizer.getVirtualItems().map((virtualRow, index) => {
                        const isLoaderRow = virtualRow.index > rows.length - 1
                        const row = rows[virtualRow.index];

                        return (
                            <tr key={row.id} style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start - index * virtualRow.size
                                    }px)`,
                            }}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </main >
    );
}

export default App;
