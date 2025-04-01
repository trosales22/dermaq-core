import Wrapper from "components/Wrapper";
import { debounce } from "lodash";
import { useState } from "react";
import { useListReservation } from "hooks/reservation";
import { Badge, Input, Pagination, Table } from "components/ui/components";
import { getBadgeColorByStatus } from "utils";

interface CsDetailReservationSectionProps {
    clinicSessionId: string | undefined;
}

const CsDetailReservationSection: React.FC<CsDetailReservationSectionProps> = ({ clinicSessionId }) => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }, 300);

    const { data: response, isLoading, isError }: any = useListReservation({
        params: { q: search, page: currentPage, limit: itemsPerPage, clinic_session_id: clinicSessionId }
    })

    const list = response?.data?.data || []; 
    const totalItems = response?.data?.meta?.pagination?.total || 0; 
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return (
        <Wrapper>
            <div className="flex justify-between items-center mb-4">
                <Input
                    type="text"
                    placeholder="Search reference number.."
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
                    headers={["Created Date", "Reference", "Customer", "Queue #", "Status"]}
                    headerColor="bg-gray-200"
                    borderColor="border-gray-300"
                    bordered
                    rounded
                    className="bg-white"
                >
                    {list.map((item: any) => (
                        <tr key={item.id}>
                            <td className="font-medium">{item?.attributes?.created_at || 'N/A'}</td>
                            <td className="font-medium">{item?.attributes?.refno || 'N/A'}</td>
                            <td>
                                {item?.attributes?.customer?.photo_url ? (
                                    <div className="flex items-center space-x-2">
                                        <img src={item.attributes.customer.photo_url} alt={item.attributes.customer?.fullname} className="w-12 h-12 object-cover rounded" />
                                        <span>{item?.attributes?.customer?.fullname}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-700 text-sm">{item?.attributes?.customer?.fullname}</span>
                                )}
                            </td>
                            <td className="font-medium">{item?.attributes?.queue_number}</td>
                            <td className="font-medium">
                                <Badge type={getBadgeColorByStatus(item?.attributes?.status?.code)} label={item?.attributes?.status?.label || 'N/A'} />
                            </td>
                        </tr>
                    ))}
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
        </Wrapper>
    );
};

export default CsDetailReservationSection;
