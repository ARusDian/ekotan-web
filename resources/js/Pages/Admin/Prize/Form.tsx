import { Button, FormControlLabel, InputLabel, Modal, Switch, TextField } from "@mui/material";
import { Controller, UseFormReturn } from 'react-hook-form';
import React, { ChangeEvent, useState } from "react";
import MapAreaSelect from '@/Components/MapAreaSelect';
import InputError from "@/Components/Jetstream/InputError";
import { BaseDocumentFileModel, getStorageFileUrl } from "@/Models/FileModel";
import { asset } from "@/Models/Helper";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { LatLngExpression } from 'leaflet';
import { Location } from '@/Models/SharedModel';
import useTypedPage from "@/Hooks/useTypedPage";
import { MapContainer, TileLayer } from 'react-leaflet';
import Select from "react-select";
import { PrizeModel } from "@/Models/Prize";

interface Props extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    form: UseFormReturn<PrizeModel>;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    p: 4,
};

export default function Form(props: Props) {
    const { form } = props;
    const page = useTypedPage<{ location: Location }>()

    const [cropperModalOpen, setCropperModalOpen] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [cropper, setCropper] = useState<any>();

    const getNewImageUrl = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const getCropData = async () => {
        if (cropper) {
            const file = await fetch(cropper.getCroppedCanvas().toDataURL())
                .then(res => res.blob())
                .then(blob => {
                    return new File([blob], 'newAvatar.png', { type: 'image/png' });
                });
            if (file) {
                form.setValue('image', {
                    file: file,
                    disk: 'public',
                });

                setCropperModalOpen(false);
            }
        }
    };

    return (
        <div className={`flex-col gap-5 ${props.className}`}>
            <div className="flex justify-center w-full">
                <div className="form-control mt-4">
                    <InputLabel htmlFor="image">Foto Hadiah</InputLabel>
                    <Controller
                        control={form.control}
                        name="image"
                        render={({ field }) => {
                            return (
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <img
                                            className="object-cover h-40 max-w-full w-auto"
                                            src={
                                                form.getValues('image')?.file
                                                    ? getStorageFileUrl(
                                                        form.getValues('image') as BaseDocumentFileModel,
                                                    )!
                                                    : form.formState.defaultValues?.image
                                                        ? asset(
                                                            'public',
                                                            form.formState.defaultValues
                                                                ?.image?.path as string,
                                                        )
                                                        : asset('root', 'assets/image/default-image.jpg')
                                            }
                                            alt={form.formState.defaultValues?.name}
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        ref={field.ref}
                                        onChange={e => {
                                            getNewImageUrl(e);
                                            setCropperModalOpen(true);
                                        }}
                                    />
                                </div>
                            );
                        }}
                    />
                    <InputError
                        message={form.formState.errors.image?.message}
                        className="mt-2"
                    />
                </div>
           </div>
            <div className="form-control w-full mt-4">
                <TextField
                    {...form.register('name')}
                    label="Nama"
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    style={{ width: '100%' }}
                    autoFocus
                    defaultValue={form.formState.defaultValues?.name}
                    error={form.formState.errors?.name != null}
                    helperText={form.formState.errors.name?.message}
                />
            </div>
            <div className="form-control w-full mt-4">
                <TextField
                    {...form.register('stock')}
                    label="Stok"
                    type="number"
                    id="stock"
                    name="stock"
                    autoComplete="stock"
                    style={{ width: '100%' }}
                    autoFocus
                    defaultValue={form.formState.defaultValues?.stock}
                    error={form.formState.errors?.stock != null}
                    helperText={form.formState.errors.stock?.message}
                />
            </div>
            <div className="form-control w-full mt-4">
                <TextField
                    {...form.register('price')}
                    label="Harga"
                    type="number"
                    id="price"
                    name="price"
                    autoComplete="price"
                    style={{ width: '100%' }}
                    autoFocus
                    defaultValue={form.formState.defaultValues?.price}
                    error={form.formState.errors?.price != null}
                    helperText={form.formState.errors.price?.message}
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
            <Modal
                open={cropperModalOpen}
                onClose={() => setCropperModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{ ...style }}>
                    <div className="p-4 bg-white flex-col gap-5">
                        <Cropper
                            src={image!}
                            minCropBoxHeight={100}
                            minCropBoxWidth={100}
                            guides={false}
                            checkOrientation={false}
                            onInitialized={instance => {
                                setCropper(instance);
                            }}
                        />
                        <div className="flex justify-end mt-5">
                            <Button variant="contained" color="primary" onClick={getCropData}>
                                Simpan
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </div>
    )
}
