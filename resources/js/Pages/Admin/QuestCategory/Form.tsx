import { InputLabel, TextField } from "@mui/material";
import { Controller, UseFormReturn } from 'react-hook-form';
import React from "react";
import { QuestCategoryModel } from "@/Models/QuestCategory";
import InputError from "@/Components/Jetstream/InputError";
interface Props extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    form: UseFormReturn<QuestCategoryModel>;
}

export default function Form(props: Props) {
    const { form } = props;
    return (
        <div className={`flex-col gap-5 ${props.className}`}>
            <div className="form-control w-full mt-4">
                <TextField
                    {...form.register('name')}
                    label="Nama"
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    defaultValue={form.formState.defaultValues?.name}
                    error={form.formState.errors?.name != null}
                    helperText={form.formState.errors.name?.message}
                />
            </div>
            <div className="form-control w-full mt-4">
                <InputLabel htmlFor="description">Deskripsi</InputLabel>
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <>
                            <textarea
                                {...field}
                                id="description"
                                name="description"
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={form.formState.errors.description?.message}
                                className="mt-2"
                            />
                        </>
                    )}
                />
            </div>
        </div>
    )
}
