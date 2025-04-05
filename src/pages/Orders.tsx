import { useState } from "react";
import Layout from "components/Layout";
import { Table, Button, Input, Pagination, Modal } from "components/ui/components";
import { Clipboard, Trash } from "lucide-react";
import { debounce } from "lodash";
import { formatCurrency } from "utils";
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteOrderMutation, useListOrder } from "hooks/order";
import AddOrderForm from "components/modules/order/AddOrderForm";

const OrdersPage: React.FC = () => {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<any>(null);

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 300);

    const { data: response, isLoading, isError }: any = useListOrder({
        params: { q: search, page: currentPage, limit: itemsPerPage }
    })

    const list = response?.data?.data || []; 
    const totalItems = response?.data?.meta?.pagination?.total || 0; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const { mutate: deleteOrder, isPending: isDeleteOrderLoading } = useDeleteOrderMutation({
        onSuccess: () => {
            toast.info("Deleted order successfully.");
            queryClient.invalidateQueries({ queryKey: ['ORDER_LIST'] });
            setOpenDelete(false);
        },
        onError: () => {}
    });

    const onShowDeleteConfirmation = (orderId: string | undefined | null) => {
        setOpenDelete(true);
        setSelectedOrderId(orderId);
    };

    const onDeleteOrderHandler = () => {
        deleteOrder(selectedOrderId)
    }
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold pb-3">Orders</h1>

            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="w-[300px]"
                />
                <Button variant="primary" className="px-4 py-2" onClick={() => setOpenAdd(true)}>+ Add Order</Button>
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
                    headers={["Reference #", "Customer", "Orders", "Total Amount", "Assistant", "Created Date", "Actions"]}
                    headerColor="bg-sky-100"
                    borderColor="border-gray-300"
                    bordered
                    rounded
                    className="bg-white"
                >
                    {list.map((item: any) => {
                        return (<tr key={item.id}>
                            <td className="font-medium">{item?.attributes?.refno || 'N/A'}</td>
                            <td className="font-medium">{`${item?.attributes?.customer?.fullname}`}</td>
                            <td className="font-medium">
                                <ul className="list-disc pl-4">
                                    {(item?.attributes?.orders || []).map((order: any, index: number) => {
                                        return (
                                            <li key={index}>{order?.product?.name} - ₱{formatCurrency(order?.product?.price || 0)} <b>({order?.quantity || 0})</b></li>
                                        )
                                    })}
                                </ul>
                            </td>
                            <td className="font-medium">&#8369;{formatCurrency(item?.attributes?.total_amount || 0)}</td>
                            <td className="font-medium">{`${item?.attributes?.assistant?.fullname}`}</td>
                            <td className="font-medium">{item?.attributes?.created_at || 'N/A'}</td>
                            <td className="flex items-center">
                                <Button
                                    variant="ghost"
                                    className="btn-sm text-orange-500 hover:bg-orange-100"
                                    tooltip="Manage"
                                    onClick={() => {}}
                                >
                                    <Clipboard className="w-4 h-4" />
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
                id="add-order-modal"
                title="Add Order"
                closeButton
                closeOnBackdrop
                isOpen={openAdd}
                size="3xl"
                onClose={() => setOpenAdd(false)}
                headerColor="blue"
            >
                {openAdd && <AddOrderForm onClose={() => setOpenAdd(false)} />}
            </Modal>

            <Modal
                id="delete-order-modal"
                title="Confirm Deletion"
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                headerColor="red"
            >
                <p>Are you sure you want to delete this order?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" onClick={() => setOpenDelete(false)}>No</Button>
                    <Button variant="danger" className="text-white" onClick={onDeleteOrderHandler}>{isDeleteOrderLoading ? 'Deleting..' : 'Yes'}</Button>
                </div>
            </Modal>
        </Layout>
    );
};

export default OrdersPage;
