import { useState } from "react";
import Layout from "components/Layout";
import { Table, Button, Input, Pagination, Modal, Badge } from "components/ui/components";
import { Clipboard, Globe } from "lucide-react";
import AddClinicSessionForm from "components/modules/clinic-session/forms/AddClinicSessionForm";
import { useListClinicSession } from "hooks/clinic-session";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { getBadgeColorByStatus } from "utils";

const ClinicSessionPage = () => {
    const siteUrl = import.meta.env.VITE_SITE_URL;
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [openAdd, setOpenAdd] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 300);

    const { data: response, isLoading, isError }: any = useListClinicSession({
        params: { q: search, page: currentPage, limit: itemsPerPage }
    })

    const list = response?.data?.data || []; 
    const totalItems = response?.data?.meta?.pagination?.total || 0; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const onViewHandler = (id: string) => {
        navigate(`/clinic-sessions/${id}`);
    };
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold pb-3">Clinic Sessions</h1>

            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search by reference number..."
                    onChange={handleSearchChange}
                    className="w-[300px]"
                />
                <Button variant="primary" className="px-4 py-2" onClick={() => setOpenAdd(true)}>+ Add Clinic Session</Button>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {isError && (
                <div role="alert" className="toast toast-top toast-end">
                    <div className="alert alert-error">
                    <span>Something went wrong. Please try again.</span>
                    </div>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                <Table
                    headers={["Reference #", "Title", "Description", "Session Date", "Time", "Max Slot", "Status", "Created Date", "Actions"]}
                    headerColor="bg-gray-200"
                    borderColor="border-gray-300"
                    bordered
                    rounded
                    className="bg-white"
                >
                    {list.map((item: any) => {
                        return (<tr key={item.id}>
                            <td className="font-bold">{item?.attributes?.refno || 'N/A'}</td>
                            <td className="font-medium">{item?.attributes?.title || 'N/A'}</td>
                            <td className="font-medium">{item?.attributes?.description || 'N/A'}</td>
                            <td className="font-medium">{item?.attributes?.formatted_session_date || 'N/A'}</td>
                            <td className="font-medium">{`${item?.attributes?.formatted_start_time || ''} - ${item?.attributes?.formatted_end_time || ''}`}</td>
                            <td className="font-medium">{item?.attributes?.max_slots || 0}</td>
                            <td className="font-medium">
                                <Badge type={getBadgeColorByStatus(item?.attributes?.status?.code)} label={item?.attributes?.status?.label || 'N/A'} />
                            </td>
                            <td className="font-medium">{item?.attributes?.created_at || 'N/A'}</td>
                            <td className="flex items-center">
                                <Button
                                    variant="ghost"
                                    className="btn-sm text-orange-500 hover:bg-orange-100"
                                    tooltip="Manage"
                                    onClick={() => onViewHandler(item.id)}
                                >
                                    <Clipboard className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    tooltip="Open Session"
                                    className="btn-sm text-black hover:bg-red-100"
                                    onClick={() => window.open(`${siteUrl}/sessions/${item?.attributes?.refno}`, "_blank")}
                                >
                                    <Globe className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>)
                    })}
                </Table>

                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    size="sm"
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                />
                </>
            )}

            <Modal
                id="add-clinic-session-modal"
                title="Add Clinic Session"
                closeButton
                closeOnBackdrop
                isOpen={openAdd}
                size="sm"
                onClose={() => setOpenAdd(false)}
                headerColor="blue"
            >
                {openAdd && <AddClinicSessionForm onClose={() => setOpenAdd(false)} />}
            </Modal>
        </Layout>
    );
};

export default ClinicSessionPage;
