import { useState } from "react";
import Layout from "components/Layout";
import { Table, Button, Input, Pagination, Modal } from "components/ui/components";
import { Pencil, Trash } from "lucide-react";
import { debounce } from "lodash";
import { formatCurrency } from "utils";
import { useDeleteProductMutation, useListProduct } from "hooks/product";
import AddProductForm from "components/modules/product/forms/AddProductForm";
import AppLogo from 'assets/images/app-logo.png'
import UpdateProductForm from "components/modules/product/forms/UpdateProductForm";
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";

const ProductsPage = () => {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<any>(null);

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 300);

    const { data: response, isLoading, isError }: any = useListProduct({
        params: { q: search, page: currentPage, limit: itemsPerPage }
    })

    const list = response?.data?.data || []; 
    const totalItems = response?.data?.meta?.pagination?.total || 0; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const { mutate: deleteProduct, isPending: isDeleteProductLoading } = useDeleteProductMutation({
        onSuccess: () => {
            toast.success("Deleted product successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "colored"
            });

            queryClient.invalidateQueries({ queryKey: ['PRODUCT_LIST'] });

            setOpenDelete(false);
        },
        onError: () => {}
    });

    const onShowEditHandler = (productId: string | undefined | null) => {
        setSelectedProductId(productId)
        setOpenEdit(true)
    };

    const onShowDeleteConfirmation = (productId: string | undefined | null) => {
        setOpenDelete(true);
        selectedProductId(productId);
    };

    const onDeleteProductHandler = () => {
        deleteProduct(selectedProductId)
    }
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold pb-3">Products</h1>

            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="w-[300px]"
                />
                <Button variant="primary" className="px-4 py-2" onClick={() => setOpenAdd(true)}>+ Add Product</Button>
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
                    headers={["Photo", "Gallery", "Name", "Description", "Price", "Quantity", "Created Date", "Actions"]}
                    headerColor="bg-gray-200"
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
                            <td className="font-bold">
                                {(item?.attributes?.photo_gallery || []).length <= 0 ? (
                                    <span className="font-medium">No photo gallery.</span>
                                ): (
                                    item?.attributes?.photo_gallery.map((photoUrl: string) => {
                                        return (
                                            <img src={photoUrl} alt={item?.attributes?.name} className="w-12 h-12 object-cover rounded" />
                                        )
                                    })
                                )}
                            </td>
                            <td className="font-medium">
                                {item?.attributes?.name} <code>({item?.attributes?.code})</code>
                            </td>
                            <td className="font-medium">{item?.attributes?.description || 'N/A'}</td>
                            <td className="font-medium">{formatCurrency(item?.attributes?.price || 0)}</td>
                            <td className="font-medium">{item?.attributes?.quantity || 'N/A'}</td>
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
                id="add-product-modal"
                title="Add Product"
                closeButton
                closeOnBackdrop
                isOpen={openAdd}
                size="md"
                onClose={() => setOpenAdd(false)}
                headerColor="blue"
            >
                {openAdd && <AddProductForm onClose={() => setOpenAdd(false)} />}
            </Modal>

            <Modal
                id="update-product-modal"
                title="Edit Product"
                closeButton
                closeOnBackdrop
                isOpen={openEdit}
                size="md"
                onClose={() => setOpenEdit(false)}
                headerColor="blue"
            >
                {openEdit && <UpdateProductForm productId={selectedProductId} onClose={() => setOpenEdit(false)} />}
            </Modal>

            <Modal
                id="delete-product-modal"
                title="Confirm Deletion"
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                headerColor="red"
            >
                <p>Are you sure you want to delete this product?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" onClick={() => setOpenDelete(false)}>No</Button>
                    <Button variant="danger" className="text-white" onClick={onDeleteProductHandler}>{isDeleteProductLoading ? 'Deleting..' : 'Delete'}</Button>
                </div>
            </Modal>
        </Layout>
    );
};

export default ProductsPage;
