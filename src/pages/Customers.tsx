import { useState } from "react";
import Layout from "components/Layout";
import { Table, Button, Input, Pagination, Badge } from "components/ui/components";
import { ShoppingBasket } from "lucide-react";
import { debounce } from "lodash";
import { getBadgeColorByStatus } from "utils";
import { useListCustomer } from "hooks/customer";

const CustomersPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 300);

    const { data: response, isLoading, isError }: any = useListCustomer({
        params: { q: search, page: currentPage, limit: itemsPerPage }
    })

    const list = response?.data?.data || []; 
    const totalItems = response?.data?.meta?.pagination?.total || 0; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return (
        <Layout>
            <h1 className="text-2xl font-bold pb-3">Customers</h1>

            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    className="w-[300px]"
                />
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
                    headers={["Name", "Email", "Mobile Number", "Status", "Created Date", "Actions"]}
                    headerColor="bg-sky-100"
                    borderColor="border-gray-300"
                    bordered
                    rounded
                    className="bg-white"
                >
                    {list.map((item: any) => {
                        return (<tr key={item.id}>
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
                                    className="btn-sm text-blue-500 hover:bg-blue-100"
                                    tooltip="View Orders"
                                    onClick={() => {}}
                                >
                                    <ShoppingBasket className="w-4 h-4" /> View Orders
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
        </Layout>
    );
};

export default CustomersPage;
