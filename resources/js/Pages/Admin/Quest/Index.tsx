import { Paginated, asset } from '@/Models/Helper';
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';
import React from 'react';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { QuestModel } from '@/Models/Quest';

interface Props {
    quests: Paginated<QuestModel>;
}

export default function Index(props: Props) {
    const { quests } = props;

    const [columnFilters, setColumnFilters] =
        useState<MRT_ColumnFiltersState>([]);

    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: quests.current_page - 1,
        pageSize: quests.per_page,
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const url = new URL(route(route().current()!).toString());

        url.searchParams.set('columnFilters', JSON.stringify(columnFilters ?? []));
        url.searchParams.set('page', (pagination.pageIndex + 1).toString());
        url.searchParams.set('perPage', pagination.pageSize.toString());
        // url.searchParams.set('globalFilter', globalFilter ?? '');

        if (window.location.href == url.toString()) {
            return;
        }

        setIsLoading(true);
        router.reload({
            // preserveState: true,
            // preserveScroll: true,
            data: {
                page: pagination.pageIndex + 1,
                perPage: pagination.pageSize,
                columnFilters: JSON.stringify(columnFilters),
                // globalFilter: globalFilter,
            },
            only: ['questCategories'],
            onFinish: () => {
                setIsLoading(false);
            },
        });
    }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

    const dataColumns = useMemo<MRT_ColumnDef<QuestModel>[]>(
        () => [
            {
                id: 'title',
                header: 'nama Quest',
                accessorFn: row => row.title,
                Cell: ({ renderedCellValue, row }) => (
                    <div className="flex gap-3">
                        <img
                            className="h-20 w-20 object-scale-down"
                            src={
                                asset('public', row.original.photo.path)
                            }
                            alt={`${row.original.title} photo}`}
                        />
                        <p className="my-auto font-semibold">{renderedCellValue}</p>
                    </div>
                ),
            },
            {
                header: 'Kategori',
                accessorKey: 'category.name',
            },
            {
                header: 'Poin',
                accessorKey: 'point',
            },
            {
                header: 'Jumlah',
                accessorFn(originalRow) {
                    return originalRow.quantity ?? '-';
                },
            },
            {
                header: 'Berakhir Pada',
                accessorFn(originalRow) {
                    return new Date(originalRow.expired_at).toLocaleString('id') ?? '-';
                },
            }
        ]
        , [JSON.stringify(quests.data)]);

    const data = useMemo<QuestModel[]>(() => quests.data, [
        JSON.stringify(quests.data),
    ]);

    const table = useMaterialReactTable({
        columns: dataColumns,
        data: data,
        rowCount: quests.total,
        enableGlobalFilter: false,
        enableColumnActions: true,
        enableColumnFilters: true,
        enablePagination: true,
        enableSorting: true,
        enableBottomToolbar: true,
        enableTopToolbar: true,
        enableRowActions: true,
        enableRowNumbers: true,
        enableExpanding: true,
        enableExpandAll: true,
        layoutMode: 'semantic',
        positionActionsColumn: 'last',
        muiTableBodyRowProps: { hover: false },
        state: {
            pagination,
            isLoading,
            columnFilters,
        },
        getRowId: it => it.id?.toString(),
        manualPagination: true,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                fontSize: '16px',
            },
        },
        renderDetailPanel: ({ row }) => (
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <div className="font-bold">Deskripsi :</div>
                    <div>{row.original.description}</div>
                </div>
            </div>
        ),
        renderRowActions: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <MuiInertiaLinkButton
                    color="primary"
                    href={route('quest.show', row.original.id)}
                >
                    Show
                </MuiInertiaLinkButton>

            </div>
        ),
    });

    return (
        <AdminTableLayout
            title="Quest"
            addRoute={route('quest.create')}
            addRouteTitle="Tambah Quest"
        >
            <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
                <MaterialReactTable table={table} />
            </div>
        </AdminTableLayout>
    )
}
