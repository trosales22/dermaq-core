import { useQueryClient } from "@tanstack/react-query";
import Layout from "components/Layout";
import CsDetailReservationSection from "components/modules/clinic-session/tabs/CsDetailReservationSection";
import { Button, Breadcrumbs, Tabs, Modal, Badge } from "components/ui/components";
import { useShowClinicSessionById, useDeleteClinicSessionMutation } from "hooks/clinic-session";
import { Calendar, CalendarCheck, Clock, Hash, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import UpdateClinicSessionForm from "components/modules/clinic-session/forms/UpdateClinicSessionForm";
import { getBadgeColorByStatus } from "utils";
import CsDetailQueueMgmtSection from "components/modules/clinic-session/tabs/CsDetailQueueMgmtSection";

const ClinicSessionDetailPage: React.FC = () => {
    const { uuid } = useParams();
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { data: response }: any = useShowClinicSessionById({
        clinicSessionId: uuid
    })
    const detail = response?.data?.data || null; 

    const breadcrumbItems = [
        { label: 'Clinic Sessions', href: '/clinic-sessions' },
        { label: detail?.attributes?.refno, href: `/businesses/${uuid}` }
    ];

    const tabData = [
        { label: 'Reservations', content: <CsDetailReservationSection clinicSessionId={uuid} /> },
        { label: 'Queue Management', content: <CsDetailQueueMgmtSection clinicSessionId={uuid} /> }
    ];

    const { mutate: deleteClinicSession, isPending: isDeleteClinicSessionLoading } = useDeleteClinicSessionMutation({
        onSuccess: () => {
            toast.success("Deleted clinic session successfully.");

            queryClient.invalidateQueries({ queryKey: ['CLINIC_SESSION_LIST'] });
            queryClient.invalidateQueries({ queryKey: ['CLINIC_SESSION_SHOW'] });

            setOpenDelete(false);

            navigate('/clinic-sessions');
        },
        onError: () => {
            setOpenDelete(false);
        }
    });

    const onDeleteBusinessHandler = () => {
        deleteClinicSession(uuid)
    };

    return (
        <Layout>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex flex-row">
                <div className="flex items-center justify-center rounded-full bg-gray-300 text-white font-bold w-[150px] h-[150px] text-center text-[50px] mr-5">
                    <CalendarCheck className="w-[70px] h-[70px] text-white" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">
                        {detail?.attributes?.title}&nbsp;
                        <Badge 
                            type={getBadgeColorByStatus(detail?.attributes?.status?.code)}
                            label={detail?.attributes?.status?.label || 'N/A'}
                            textSize="lg"
                        />
                    </h1>
                    <div className="flex items-center gap-2">
                        {detail?.attributes?.description}
                    </div>
                    <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{detail?.attributes?.refno}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{detail?.attributes?.session_date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{`${detail?.attributes?.formatted_start_time} - ${detail?.attributes?.formatted_end_time}`}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <b>Created:</b>
                        <span className="font-medium">{detail?.attributes?.created_at}</span>
                    </div>
                </div>

                <div className="justify-end ml-auto">
                    <Button
                        variant="ghost"
                        className="btn-sm text-orange-500 hover:bg-orange-100"
                        tooltip="Edit"
                        onClick={() => setOpenEdit(true)}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="btn-sm text-red-500 hover:bg-red-100 mr-2"
                        tooltip="Delete"
                        onClick={() => setOpenDelete(true)}
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="mt-5">
                <Tabs tabs={tabData} uniqueName="business_detail_tabs" defaultIndex={0} withBorder={true} />
            </div>

            <Modal
                id="edit-clinic-session-modal"
                title="Edit Clinic Session"
                closeButton
                closeOnBackdrop
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                headerColor="blue"
                size="sm"
            >
                <UpdateClinicSessionForm 
                    clinicSessionId={uuid} 
                    clinicSessionDetails={detail?.attributes} 
                    onClose={() => setOpenEdit(false)} 
                />
            </Modal>

            <Modal
                id="delete-clinic-session-modal"
                title="Confirm Deletion"
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                headerColor="red"
            >
                <p>Are you sure you want to delete this clinic session?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" onClick={() => setOpenDelete(false)}>No</Button>
                    <Button variant="danger" className="text-white" onClick={onDeleteBusinessHandler} disabled={isDeleteClinicSessionLoading}>{isDeleteClinicSessionLoading ? 'Deleting..' : 'Yes'}</Button>
                </div>
            </Modal>
        </Layout>
    );
};

export default ClinicSessionDetailPage;
