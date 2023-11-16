import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { QuestCategoryModel } from '@/Models/QuestCategory';
import { QuestCreateModel, QuestModel } from '@/Models/Quest';

interface Props {
    quest: QuestModel;
    questCategories: QuestCategoryModel[];
}

export default function Edit(props: Props) {
    let quest = props.quest;
    let form = useForm<QuestCreateModel>({
        defaultValues: {
            ...quest,
            isQuantity: quest.quantity != null,
            isCoordinate: quest.latitude != null && quest.longitude != null,
        },
    });

    async function onSubmit(value: any) {
        await Api.postAsync({
            route: route('quest.update', quest.id),
            value: {
                ...value,
                _method: 'PUT',
            },
            form,
        });
    }

    return (
        <AdminFormLayout
            title="Edit User"
            backRoute={route('quest.index')}
            backRouteTitle="Kembali"
        >
            <form
                className="flex-col gap-5 py-5"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <Form
                    form={form}
                    categories={props.questCategories}
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
