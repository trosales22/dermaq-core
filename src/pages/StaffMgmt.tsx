import { useState } from "react";
import Layout from "components/Layout";
import { Table, Button, Input, Pagination, Modal, Badge } from "components/ui/components";
import { Pencil, Trash } from "lucide-react";
import { debounce } from "lodash";
import { getBadgeColorByStatus } from "utils";
import AppLogo from 'assets/images/app-logo.png'
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteStaffMutation, useListStaff } from "hooks/staff";
import AddStaffForm from "components/modules/staff-mgmt/AddStaffForm";
import UpdateStaffForm from "components/modules/staff-mgmt/UpdateStaffForm";

const StaffMgmtPage: React.FC = () => {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<any>(null);

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 300);

    const { data: response, isLoading, isError }: any = useListStaff({
        params: { q: search, page: currentPage, limit: itemsPerPage }
    })

    const list = response?.data?.data || []; 
    const totalItems = response?.data?.meta?.pagination?.total || 0; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const { mutate: deleteStaff, isPending: isDeleteStaffLoading } = useDeleteStaffMutation({
        onSuccess: () => {
            toast.success("Deleted staff successfully.");
            queryClient.invalidateQueries({ queryKey: ['STAFF_LIST'] });
            setOpenDelete(false);
        },
        onError: () => {}
    });

    const onShowEditHandler = (staffId: string | undefined | null) => {
        setSelectedStaffId(staffId)
        setOpenEdit(true)
    };

    const onShowDeleteConfirmation = (staffId: string | undefined | null) => {
        setOpenDelete(true);
        setSelectedStaffId(staffId);
    };

    const onDeleteStaffHandler = () => {
        deleteStaff(selectedStaffId)
    }
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold pb-3">Staff Management</h1>

            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="w-[300px]"
                />
                <Button variant="primary" className="px-4 py-2" onClick={() => setOpenAdd(true)}>+ Add Staff</Button>
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
                    headers={["Photo", "Name", "Email", "Mobile Number", "Status", "Created Date", "Actions"]}
                    headerColor="bg-sky-100"
                    borderColor="border-gray-300"
                    bordered
                    rounded
                    className="bg-white"
                >
                    {list.map((item: any) => {
                        return (<tr key={item.id}>
                            <td className="font-bold">
                                {item.attributes?.photo_url ? (
                                    <img src={item.attributes?.photo_url} alt={item?.attributes?.name} className="w-12 h-12 object-cover rounded" />
                                ): (
                                    <img src={AppLogo} alt={item?.attributes?.name} className="w-12 h-12 object-cover rounded" />
                                )}
                            </td>
                            <td className="font-medium">
                                {`${item?.attributes?.firstname} ${item?.attributes?.lastname}`} <code>({item?.attributes?.username})</code>
                            </td>
                            <td className="font-medium">{item?.attributes?.email || 'N/A'}</td>
                            <td className="font-medium">{item?.attributes?.mobile || 'N/A'}</td>
                            <td className="font-medium">
                                <Badge type={getBadgeColorByStatus(item?.attributes?.status?.code)} label={item?.attributes?.status?.label || 'N/A'} />
                            </td>
                            <td className="font-medium">{item?.attributes?.created_at || 'N/A'}</td>
                            <td className="flex items-center">
                                <Button
                                    variant="ghost"
                                    className="btn-sm text-orange-500 hover:bg-orange-100"
                                    tooltip="Edit"
                                    onClick={() => onShowEditHandler(item.id)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    tooltip="Delete"
                                    className="btn-sm text-red-500 hover:bg-red-100"
                                    onClick={() => onShowDeleteConfirmation(item.id)}
                                >
                                    <Trash className="w-4 h-4" />
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
                id="add-staff-modal"
                title="Add Staff"
                closeButton
                closeOnBackdrop
                isOpen={openAdd}
                size="lg"
                onClose={() => setOpenAdd(false)}
                headerColor="blue"
            >
                {openAdd && <AddStaffForm onClose={() => setOpenAdd(false)} />}
            </Modal>

            <Modal
                id="update-staff-modal"
                title="Edit Staff"
                closeButton
                closeOnBackdrop
                isOpen={openEdit}
                size="lg"
                onClose={() => setOpenEdit(false)}
                headerColor="blue"
            >
                {openEdit && <UpdateStaffForm staffId={selectedStaffId} onClose={() => setOpenEdit(false)} />}
            </Modal>

            <Modal
                id="delete-staff-modal"
                title="Confirm Deletion"
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                headerColor="red"
            >
                <p>Are you sure you want to delete this staff?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" onClick={() => setOpenDelete(false)}>No</Button>
                    <Button variant="danger" className="text-white" onClick={onDeleteStaffHandler}>{isDeleteStaffLoading ? 'Deleting..' : 'Delete'}</Button>
                </div>
            </Modal>
        </Layout>
    );
};

export default StaffMgmtPage;
