import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { PrizeModel } from '@/Models/Prize';

interface Props {
}

export default function Create(props: Props) {
    let form = useForm<PrizeModel>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
        },
    });

    async function onSubmit(value: any) {
        await Api.postAsync({ route: route('prize.store'), value, form });
    }

    return (
        <AdminFormLayout
            title="Tambah Hadiah Quest"
            backRoute={route('prize.index')}
            backRouteTitle="Kembali"
        >
            <form
                className="flex-col gap-5 py-5"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <Form
                    form={form}
                    className="my-5 mx-2"
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={form.formState.isSubmitting}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </AdminFormLayout>
    );
}
