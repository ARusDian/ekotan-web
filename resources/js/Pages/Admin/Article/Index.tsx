import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paginated, asset } from '@/Models/Helper';
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';
import React from 'react';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import ArticleModel from '@/Models/Article';

interface Props {
    articles: Paginated<ArticleModel>;
}

export default function Index(props: Props) {
    const { articles } = props;

    const confirm = useConfirm();

    const [columnFilters, setColumnFilters] =
        useState<MRT_ColumnFiltersState>([]);

    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: articles.current_page - 1,
        pageSize: articles.per_page,
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
            only: ['articles'],
            onFinish: () => {
                setIsLoading(false);
            },
        });
    }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

    const dataColumns = useMemo<MRT_ColumnDef<ArticleModel>[]>(
        () => [
            {
                id: 'title',
                header: 'Judul Artikel',
                accessorFn: row => row.title,
                Cell: ({ renderedCellValue, row }) => (
                    <div className="flex gap-3">
                        <img
                            className="h-20 w-20 object-scale-down"
                            src={
                                asset('public', row.original.image.path ?? 'assets/image/default-image.jpg')
                            }
                            alt={`${row.original.title} image}`}
                        />
                        <p className="my-auto font-semibold">{renderedCellValue}</p>
                    </div>
                ),
            },
            {
                header: 'Publisher',
                accessorKey: 'user.name',
            },
        ]
        , [JSON.stringify(articles.data)]);

    const data = useMemo<ArticleModel[]>(() => articles.data, [
        JSON.stringify(articles.data),
    ]);

    const table = useMaterialReactTable({
        columns: dataColumns,
        data: data,
        rowCount: articles.total,
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
                    <div className="font-bold">Konten :</div>
                    <div>{row.original.content}</div>
                </div>
            </div>
        ),
        renderRowActions: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <MuiInertiaLinkButton
                    color="warning"
                    href={route('article.edit', row.original.id)}
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
                                    'article.destroy',
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
            title="Artikel"
            addRoute={route('article.create')}
            addRouteTitle="Tambah Artikel"
        >
            <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
                <MaterialReactTable table={table} />
            </div>
        </AdminTableLayout>
    )
}
