import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { QuestCreateModel } from '@/Models/Quest';
import { QuestCategoryModel } from '@/Models/QuestCategory';

interface Props {
	questCategories: QuestCategoryModel[];
}

export default function Create(props: Props) {
	let form = useForm<QuestCreateModel>({
		defaultValues: {
			title: '',
			description: '',
			location: '',
			isQuantity: false,
			isCoordinate: false,
			quantity: 0,
			point: 0,
			duration: 0,
		},
	});

	async function onSubmit(value: any) {
		await Api.postAsync({ route: route('quest.store'), value, form });
	}

	return (
		<AdminFormLayout
			title="Tambah Kategori Quest"
			backRoute={route('quest.index')}
			backRouteTitle="Kembali"
		>
			<form
				className="flex-col gap-5 py-5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Form
					form={form}
					className="my-5 mx-2"
					categories={props.questCategories}
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
