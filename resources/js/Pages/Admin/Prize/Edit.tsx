import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { PrizeModel } from '@/Models/Prize';

interface Props {
    prize: PrizeModel;
}

export default function Edit(props: Props) {
    let prize = props.prize;
    let form = useForm<PrizeModel>({
        defaultValues: prize,
    });

    async function onSubmit(value: any) {
        await Api.postAsync({
            route: route('prize.update', prize.id),
            value: {
                ...value,
                _method: 'PUT',
            },
            form,
        });
    }

    return (
        <AdminFormLayout
            title="Edit Hadiah Quest"
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
                        color="warning"
                        size="large"
                        disabled={form.formState.isSubmitting}
                    >
                        Update
                    </Button>
                </div>
            </form>
        </AdminFormLayout>
    );
}
