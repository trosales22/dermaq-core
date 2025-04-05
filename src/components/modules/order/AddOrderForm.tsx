import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { SearchableCombobox ,Button } from "components/ui/components";
import { useCreateOrderMutation } from "hooks/order";
import { Trash2 } from "lucide-react";
import { useListCustomerDataset, useListProductDataset } from "hooks/dataset";

interface AddOrderFormProps {
    onClose: () => void;
}

const AddOrderForm: FC<AddOrderFormProps> = ({ onClose }) => {
    const queryClient = useQueryClient();

    const { data: customerDatasetListResponse }: any = useListCustomerDataset({})
    const customerDatasetList = customerDatasetListResponse?.data?.data || []

    const { data: productDatasetListResponse }: any = useListProductDataset({})
    const productDatasetList = productDatasetListResponse?.data?.data || []

    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<{ product_id: string; quantity: number }[]>([]);

    const { mutate: createOrder, isPending } = useCreateOrderMutation({
        onSuccess: () => {
            toast.success("Order created successfully.");
            queryClient.invalidateQueries({ queryKey: ["ORDER_LIST"] });
            onClose();
            setSelectedCustomerId(null)
            setSelectedProductId(null)
        },
    });

    const addProduct = (productId: string) => {
        const exists = orderItems.find((o) => o.product_id === productId);
        if (!exists) {
        setOrderItems((prev) => [...prev, { product_id: productId, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId: string, amount: number) => {
        setOrderItems((prev) =>
        prev.map((item) =>
            item.product_id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        )
        );
    };

    const removeProduct = (productId: string) => {
        setOrderItems((prev) => prev.filter((item) => item.product_id !== productId));
    };

    const onSubmitHandler = () => {
        if (!selectedCustomerId || orderItems.length === 0) {
            toast.error("Please select a customer and at least one product.");
            return;
        }

        const payload: any = {
            customer_id: selectedCustomerId,
            orders: orderItems
        };

        createOrder(payload);
    };

    const productOptions = productDatasetList.map((product: any) => ({
        id: product?.id,
        label: `${product?.attributes?.name} - ₱${product?.attributes?.price}`,
    }));

    return (
        <>
        <div className="w-full grid grid-cols-2 gap-2">
            <SearchableCombobox
                label="Select Customer"
                items={customerDatasetList.map((item: any) => {
                    return {
                        id: item?.id,
                        label: `${item?.attributes?.firstname} ${item?.attributes?.lastname} (${item?.attributes?.username})`
                    }
                })}
                selectedId={selectedCustomerId}
                onSelect={setSelectedCustomerId}
            />

            <SearchableCombobox
                label="Add Product"
                items={productOptions}
                selectedId={selectedProductId}
                onSelect={(id) => {
                    addProduct(id);
                    setSelectedProductId(null);
                }}
            />
        </div>

        <div className="space-y-2 mb-4">
            {orderItems.map((item) => {
                const product = productDatasetList.find((product: any) => product.id === item.product_id);
                if (!product) return null;

                return (
                    <div
                        key={item.product_id}
                        className="flex justify-between items-center border rounded p-3"
                    >
                        <div className="flex items-center gap-4">
                            {product?.attributes?.photo_url && (
                                <img
                                    src={product?.attributes?.photo_url || ''}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover"
                                />
                            )}

                            <div>
                                <div className="font-medium">{product?.attributes?.name}</div>
                                <div className="text-sm text-gray-500">₱{product?.attributes?.price}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => updateQuantity(item.product_id, -1)}
                            >
                                -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => updateQuantity(item.product_id, 1)}
                            >
                                +
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeProduct(item.product_id)}
                                className="text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
        
        <div className="flex justify-end">
            <Button type="button" variant="primary" disabled={isPending} onClick={onSubmitHandler}>
                {isPending ? "Creating..." : "Create Order"}
            </Button>
        </div>
        </>
    );
};

export default AddOrderForm;
