import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QuestCategoryModel } from '@/Models/QuestCategory';
import { Paginated } from '@/Models/Helper';
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';
import React from 'react';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';

interface Props {
    questCategories: Paginated<QuestCategoryModel>;
}

export default function Index(props: Props) {
    const { questCategories } = props;

    const confirm = useConfirm();

    const [columnFilters, setColumnFilters] =
        useState<MRT_ColumnFiltersState>([]);

    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: questCategories.current_page - 1,
        pageSize: questCategories.per_page,
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

    const dataColumns = useMemo<MRT_ColumnDef<QuestCategoryModel>[]>(
        () => [
            {
                header: 'Nama',
                accessorKey: 'name',
            },
            {
                header: 'Jumlah Quest',
                accessorKey: 'quests_count',
            }
        ]
        , [JSON.stringify(questCategories.data)]);

    const data = useMemo<QuestCategoryModel[]>(() => questCategories.data, [
        JSON.stringify(questCategories.data),
    ]);

    const table = useMaterialReactTable({
        columns: dataColumns,
        data: data,
        rowCount: questCategories.total,
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
                    color="warning"
                    href={route('quest-category.edit', row.original.id)}
                >
                    <EditIcon />Edit
                </MuiInertiaLinkButton>
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={() => {
                        confirm({
                            title: 'Hapus Data',
                            description:
                                'Apakah anda yakin ingin menghapus data ini?',
                            cancellationText: 'Batal',
                            confirmationText: 'Hapus',
                        }).then(() => {
                            router.post(
                                route(
                                    'quest-category.destroy',
                                    row.original.id,
                                ),
                                {
                                    _method: 'DELETE',
                                },
                            );
                        });
                    }}
                >
                    <DeleteIcon /> Hapus
                </Button>
            </div>
        ),
    });

    return (
        <AdminTableLayout
            title="Kategori Quest"
            addRoute={route('quest-category.create')}
            addRouteTitle="Tambah Kategori Quest"
        >
            <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
                <MaterialReactTable table={table} />
            </div>
        </AdminTableLayout>
    )
}
