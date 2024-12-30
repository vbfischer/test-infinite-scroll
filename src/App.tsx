import React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInView } from 'react-intersection-observer';

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
    const scrollRef = React.useRef<HTMLTableSectionElement>(null)

    const { data: personData, fetchNextPage } = usePersonData();
    const table = useReactTable({
        data: personData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 45,
        overscan: 5
    })

    const { ref, inView } = useInView();

    React.useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage, personData])

    return (
        <main className="flex flex-col items-center gap-8 py-16 max-w-[1280px] mx-auto">
            <h1 className="text-4xl font-bold">Hello, world!</h1>
            <div className="h-dvh"><table className="table">
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
                <tbody ref={scrollRef}>
                    {virtualizer.getVirtualItems().map((virtualRow, index) => {
                        const row = rows[virtualRow.index];

                        return (
                            <tr key={row.id} style={{
                                height: `${virtualRow.size}px`,
                            }}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )
                    })}
                    <tr ref={ref}>
                        <td colSpan={columns.length}>Loading More....</td>
                    </tr>

                </tbody>
            </table></div>
        </main >
    );
}

export default App;
