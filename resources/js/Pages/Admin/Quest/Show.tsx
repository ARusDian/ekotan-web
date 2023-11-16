import React from 'react';
import route from 'ziggy-js';
import { router } from '@inertiajs/react';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { asset } from '@/Models/Helper';
import { Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { QuestModel } from '@/Models/Quest';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';

interface Props {
    quest: QuestModel;
}

export default function Show(props: Props) {
    const quest = props.quest;

    return (
        <AdminShowLayout
            title={`Quest ${quest.title}`}
            headerTitle={'Data User'}
            backRoute={route('quest.index')}
            backRouteTitle="Kembali"
            editRoute={route('quest.edit', [quest.id])}
            editRouteTitle="Edit"
            onDelete={() => {
                router.delete(route('quest.destroy', [quest.id]));
            }}
            deleteTitle={"Hapus"}
            onDeleteMessage={
                `Ini akan menghapus Quest ${quest.title}`
            }
        >
            <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/5 flex flex-col gap-5">
                <div className="flex justify-center">
                    <img
                        className="h-40 object-cover"
                        src={
                            asset('public', quest.photo.path)
                        }
                        alt={quest.title}
                    />
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b py-3 border-black">
                            <th className="">Properti</th>
                            <th className="">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Judul</td>
                            <td className="py-3 text-center">{quest.title}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Dibuat Pada</td>
                            <td className="py-3 text-center">{new Date(quest.created_at).toLocaleString('id')}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Berlaku Hingga</td>
                            <td className="py-3 text-center">{new Date(quest.expired_at).toLocaleString('id') ?? '-'}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Kategori</td>
                            <td className="py-3 text-center">{quest.category.name}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Point</td>
                            <td className="py-3 text-center">{quest.point}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Jumlah</td>
                            <td className="py-3 text-center">{quest.quantity ?? "-"}</td>
                        </tr>

                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Lokasi</td>
                            <td className="py-3 text-center">{quest.location}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Deskripsi</td>
                            <td className="py-3 text-center">{quest.description}</td>
                        </tr>

                        {quest.latitude && quest.longitude && (
                            <>
                                <tr className="border-b py-3 border-black font-bold">
                                    <td className="py-3 text-center">Koordinat Bujur</td>
                                    <td className="py-3 text-center">Koordinat Lintang</td>
                                </tr>
                                <tr className="border-b py-3 border-black">
                                    <td className="py-3 text-center">{quest.longitude ?? "-"}</td>
                                    <td className="py-3 text-center">{quest.latitude ?? "-"}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
                {quest.latitude && quest.longitude && (
                    <>
                        <p className='text-lg font-bold'>Peta Event</p>
                        <MapContainer
                            center={[quest.latitude, quest.longitude]}
                            attributionControl={false}
                            zoom={13}
                            // @ts-ignore
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

                            <Marker
                                position={[quest.latitude, quest.longitude]}
                            >
                                <Tooltip>{quest.title}</Tooltip>
                            </Marker>
                        </MapContainer>
                    </>
                )}
            </div>
        </AdminShowLayout>
    );
}
