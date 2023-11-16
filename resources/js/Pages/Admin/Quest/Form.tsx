import { Button, FormControlLabel, InputLabel, Modal, Switch, TextField } from "@mui/material";
import { Controller, UseFormReturn } from 'react-hook-form';
import React, { ChangeEvent, useEffect, useState } from "react";
import MapAreaSelect from '@/Components/MapAreaSelect';
import InputError from "@/Components/Jetstream/InputError";
import { QuestCreateModel } from "@/Models/Quest";
import { QuestCategoryModel } from "@/Models/QuestCategory";
import { BaseDocumentFileModel, getStorageFileUrl } from "@/Models/FileModel";
import { asset } from "@/Models/Helper";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { LatLngExpression } from 'leaflet';
import { Location } from '@/Models/SharedModel';
import useTypedPage from "@/Hooks/useTypedPage";
import { MapContainer, TileLayer } from 'react-leaflet';
import Select from "react-select";

interface Props extends React.HTMLAttributes<HTMLElement> {
	className?: string;
	form: UseFormReturn<QuestCreateModel>;
	categories: QuestCategoryModel[];
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
				form.setValue('photo', {
					file: file,
					disk: 'public',
				});

				setCropperModalOpen(false);
			}
		}
	};

	const centerPosition = (): LatLngExpression => {
		const lat = form.getValues('latitude');
		const lng = form.getValues('longitude');

		if (lat && lng) {
			return [lat, lng];
		} else {
			return page.props.location.center
		}
	};

	const [currentLocation, setCurrentLocation] = React.useState<LatLngExpression>(
		centerPosition
	);

	const [map, setMap] = React.useState(null);

	React.useEffect(() => {
		if (!map) return;

	}, [map]);

	function formatPositionValue(value: number) {
		if (!isNaN(value) && value != null) {
			return value;
		} else {
			return 0;
		}
	}

	return (
		<div className={`flex-col gap-5 ${props.className}`}>
			<div className="form-control w-full mt-4">
				<InputLabel htmlFor="photo">Foto Quest</InputLabel>
				<Controller
					control={form.control}
					name="photo"
					render={({ field }) => {
						return (
							<div className="flex flex-col gap-3">
								<div>
									<img
										className="object-cover h-40 max-w-full w-auto"
										src={
											form.getValues('photo')?.file
												? getStorageFileUrl(
													form.getValues('photo') as BaseDocumentFileModel,
												)!
												: form.formState.defaultValues?.photo
													? asset(
														'public',
														form.formState.defaultValues
															?.photo?.path as string,
													)
													: asset('root', 'assets/image/default-image.jpg')
										}
										alt={form.formState.defaultValues?.title}
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
					message={form.formState.errors.photo?.message}
					className="mt-2"
				/>
			</div>
			<div className="form-control w-full mt-4">
				<TextField
					{...form.register('title')}
					label="Nama"
					type="text"
					id="title"
					name="title"
					autoComplete="title"
					style={{ width: '100%' }}
					autoFocus
					defaultValue={form.formState.defaultValues?.title}
					error={form.formState.errors?.title != null}
					helperText={form.formState.errors.title?.message}
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
			<div className="form-control w-full mt-4 z-50">
				<Controller
					control={form.control}
					name="category"
					render={({ field }) => {
						return (
							<>
								<InputLabel htmlFor="roles">Kategori Quest</InputLabel>
								<Select
									ref={field.ref}
									options={props.categories}
									getOptionValue={it => it.id!.toString()}
									getOptionLabel={it => it.name}
									value={field.value}
									onChange={value => {
										form.setValue('category', value!);
										form.setValue('category_id', value!.id);
									}}
								/>
								<InputError
									message={form.formState.errors.category?.message}
									className="mt-2"
								/>
							</>
						);
					}}
				/>
			</div>
			<div className="form-control w-full mt-4">
				<TextField
					{...form.register('point')}
					label="Poin"
					type="number"
					id="point"
					name="point"
					autoComplete="point"
					style={{ width: '100%' }}
					autoFocus
					defaultValue={form.formState.defaultValues?.point}
					error={form.formState.errors?.point != null}
					helperText={form.formState.errors.point?.message}
				/>
			</div>
			<div className="form-control w-full mt-4">
				<TextField
					{...form.register('location')}
					label="Lokasi"
					type="text"
					id="location"
					name="location"
					autoComplete="location"
					style={{ width: '100%' }}
					autoFocus
					defaultValue={form.formState.defaultValues?.location}
					error={form.formState.errors?.location != null}
					helperText={form.formState.errors.location?.message}
				/>
			</div>
			<FormControlLabel control={<Switch
				{...form.register('isCoordinate')}
				defaultChecked={form.formState.defaultValues?.isCoordinate}
				name="isCoordinate"
				inputProps={{ 'aria-label': 'controlled' }}
			/>} label="Detail Koordinat Lokasi" />
			{form.watch('isCoordinate') && (
				<div className="form-control w-full mt-4">
					<MapContainer
						center={currentLocation}
						attributionControl={false}
						zoom={13}
						// @ts-ignore
						whenCreated={setMap}
						style={{
							height: '70vh',
							zIndex: 1,
						}}
					>

						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							maxZoom={25}
							maxNativeZoom={19}
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						<MapAreaSelect
							position={[form.watch('latitude') ?? 0, form.watch('longitude') ?? 0] || [0, 0]}
							onChange={(it) => {
								form.setValue('latitude', formatPositionValue(it.lat));
								form.setValue('longitude', formatPositionValue(it.lng));
							}}
						/>
					</MapContainer>
					<div className="flex justify-around gap-3 my-5">
						<Controller
							control={form.control}
							name="latitude"
							render={({ field }) => {
								return (
									<div className="flex flex-col w-full">
										<InputLabel htmlFor="description">Koordinat Bujur</InputLabel>
										<input
											{...field}
											type="number"
											step={0.0000000}
											className="form-control w-full"
											placeholder="Latitude"
											value={field.value ?? 0}
											onChange={(e) => {
												form.setValue('latitude', formatPositionValue(parseFloat(e.target.value)));
											}}
										/>
									</div>
								);
							}}
						/>
						<Controller
							control={form.control}
							name="longitude"
							render={({ field }) => {
								return (
									<div className="flex flex-col w-full">
										<InputLabel htmlFor="description">Koordinat Lintang</InputLabel>
										<input
											{...field}
											type="number"
											step={0.0000000}
											className="form-control w-full "
											placeholder="Longitude"
											value={field.value ?? 0}
											onChange={(e) => {
												form.setValue('longitude', formatPositionValue(parseFloat(e.target.value)));
											}}
										/>
									</div>
								);
							}}
						/>
					</div>
				</div>
			)}
			<div className="form-control w-full mt-4">
				<TextField
					{...form.register('expired_at')}
					label="Masa Akhir Berlaku"
					type="datetime-local"
					id="expired_at"
					name="expired_at"
					autoComplete="expired_at"
					style={{ width: '100%' }}
					autoFocus
					defaultValue={form.formState.defaultValues?.expired_at}
					error={form.formState.errors?.expired_at != null}
					helperText={form.formState.errors.expired_at?.message}
				/>
			</div>
			<FormControlLabel control={<Switch
				{...form.register('isQuantity')}
				defaultChecked={form.formState.defaultValues?.isQuantity}
				name="isQuantity"
				inputProps={{ 'aria-label': 'controlled' }}
			/>} label="Jumlah Quest Berhasil Maksimal" />
			{form.watch('isQuantity') && (
				<div className="form-control w-full mt-4">
					<TextField
						{...form.register('quantity')}
						label="Jumlah Quest Berhasil Maksimal"
						type="number"
						id="quantity"
						name="quantity"
						autoComplete="quantity"
						style={{ width: '100%' }}
						autoFocus
						defaultValue={form.formState.defaultValues?.quantity}
						error={form.formState.errors?.quantity != null}
						helperText={form.formState.errors.quantity?.message}
					/>
				</div>
			)}
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
