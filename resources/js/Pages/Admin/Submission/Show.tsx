import React from 'react';
import route from 'ziggy-js';
import { router } from '@inertiajs/react';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { asset } from '@/Models/Helper';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { SubmissionModel, SubmissionStatusColor } from '@/Models/Submission';
import { Button } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';

interface Props {
    submission: SubmissionModel;
}

export default function Show(props: Props) {
    const submission = props.submission;
    const confirm = useConfirm();

    const handleReview = (type: "REJECT" | "ACCEPT") => {
        confirm({
            description: `Ini akan ${type === "ACCEPT" ? "menerima" : "menolak"} pengumpulan ini. Keputusan tidak dapat diubah.`,
            confirmationButtonProps: { autoFocus: true },
        })
            .then(() => router.post(route(type === "ACCEPT" ? "submission.accept" : "submission.reject", [submission.id])))
            .catch(e => console.log(e, 'Deletion cancelled.'));
    };

    return (
        <AdminShowLayout
            title={`Detail Pengumpulan`}
            headerTitle={'Data User'}
            backRoute={route('submission.index')}
            backRouteTitle="Kembali"
        >
            {submission.status === "SUBMITTED" && (
                <div className="flex justify-between gap-3 flex-row-reverse mx-8 ">
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={() => handleReview("ACCEPT")}
                        >
                            <label htmlFor="my-modal">Terima</label>
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={() => handleReview("REJECT")}
                        >
                            <label htmlFor="my-modal">Tolak</label>
                        </Button>
                    </div>
                </div>
           )}
            <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/5 flex flex-col gap-5">
                <table className="w-full">
                    <thead>
                        <tr className="border-b py-3 border-black">
                            <th className="">Properti</th>
                            <th className="">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Pengguna</td>
                            <td className="py-3 text-center">{submission.user.name}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Quest</td>
                            <td className="py-3 text-center">{submission.quest.title}</td>
                        </tr>
                        <tr className={`border-b py-3 border-black ${SubmissionStatusColor(submission.status)}`}>
                            <td className="py-3 text-center">Status</td>
                            <td className="py-3 text-center">{submission.status}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Batas Pengumpulan</td>
                            <td className="py-3 text-center">{new Date(submission.expired_at).toLocaleString('id') ?? '-'}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td className="py-3 text-center">Dibuat Pada</td>
                            <td className="py-3 text-center">{new Date(submission.created_at).toLocaleString('id')}</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td colSpan={2} className="py-3 text-center text-2xl font-bold">Deskripsi</td>
                        </tr>
                        <tr className="border-b py-3 border-black">
                            <td colSpan={2} className="py-3">{submission.description}</td>
                        </tr>
                        {submission.latitude && submission.longitude && (
                            <>
                                <tr className="border-b py-3 border-black font-bold">
                                    <td className="py-3 text-center">Koordinat Bujur</td>
                                    <td className="py-3 text-center">Koordinat Lintang</td>
                                </tr>
                                <tr className="border-b py-3 border-black">
                                    <td className="py-3 text-center">{submission.longitude ?? "-"}</td>
                                    <td className="py-3 text-center">{submission.latitude ?? "-"}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>

            </div>
            {submission.latitude && submission.longitude && (
                <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/5 flex flex-col gap-5">
                    <p className='text-lg font-bold'>Peta Event</p>
                    <MapContainer
                        center={[submission.latitude, submission.longitude]}
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
                            position={[submission.latitude, submission.longitude]}
                        >
                            <Tooltip>{submission.user.name} - {submission.quest.title}</Tooltip>
                        </Marker>
                    </MapContainer>
                </div>
            )}
            <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/5 flex flex-col gap-5">
                {submission.images.length > 0 ? (
                    <>
                        <p className='text-lg font-bold'>Gambar</p>
                        <div className="flex flex-wrap gap-3">
                            {submission.images.map((image, index) => (
                                <img
                                    key={index}
                                    className="h-20 w-20 object-scale-down"
                                    src={
                                        asset('public', image.path ?? 'public/images/default-image.jpg')
                                    }
                                    alt={`${submission.user.name} - ${submission.quest.title} image}`}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className='text-lg font-bold mx-auto'>Tidak ada dokumen pendukung pengumpulan</p>
                )}
            </div>
        </AdminShowLayout>
    );
}
