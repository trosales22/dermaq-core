import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, TextArea, FileInput } from 'components/ui/components'
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import { ProductFormData, productSchema } from "schemas/productSchema";
import { useShowProductById, useUpdateProductMutation } from "hooks/product";

interface UpdateProductFormProps {
    productId?: string | undefined | null;
    onClose: () => void;
}

const UpdateProductForm: FC<UpdateProductFormProps> = ({ productId, onClose }) => {
    const queryClient = useQueryClient()

    const {
        watch,
        setValue,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema)
    });

    const { data: response }: any = useShowProductById({
        productId
    })

    const detail = response?.data?.data?.attributes || null

    useEffect(() => {
        setValue('code', detail?.code)
        setValue('name', detail?.name)
        setValue('description', detail?.description)
        setValue('price', detail?.price)
        setValue('quantity', detail?.quantity)
        setValue('photo_url', detail?.photo_url || null)
        setValue('photo_gallery', detail?.photo_gallery || [])
    }, [productId, detail])

    const { mutate: updateProduct, isPending: isUpdateProductLoading } = useUpdateProductMutation({
        onSuccess: () => {
            toast.success("Update product successfully.");

            queryClient.invalidateQueries({ queryKey: ['PRODUCT_SHOW', productId] });
            queryClient.invalidateQueries({ queryKey: ['PRODUCT_LIST'] });

            onClose();
            reset();
        },
        onError: () => {}
    });

    const onSubmit = (data: ProductFormData) => {
        updateProduct({
            productId,
            payload: data
        })
    }

    const onError = (errors: any) => {
        console.log("Errors:", errors);
    };

    const onUploadMainPhotoHandler = (urls: string[]) => {
        setValue('photo_url', urls[0])
    }

    const onUploadPhotoGalleryHandler = (urls: string[]) => {
        setValue('photo_gallery', urls)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col items-center">
                {watch().photo_url && (
                    <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg overflow-hidden">
                        <img src={watch().photo_url || ''} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <FileInput 
                    label="Upload Main Photo"
                    accept="image/*"
                    maxSizeLabel="Max size: 5MB"
                    className="mt-3"
                    onUpload={onUploadMainPhotoHandler}
                />
            </div>

            <Input 
                label="Code" 
                type="text" 
                placeholder="Enter code" 
                fieldset 
                legend="Code" 
                requirementLabel={errors.code && errors.code.message} 
                requirementColor="text-red-500"
                {...register("code")}
            />

            <Input 
                label="Name" 
                type="text" 
                placeholder="Enter name" 
                fieldset 
                legend="Title" 
                requirementLabel={errors.name && errors.name.message} 
                requirementColor="text-red-500"
                {...register("name")}
            />

            <TextArea 
                className="md:col-span-2" 
                label="Description" 
                fieldset 
                legend="Description" 
                width="full" 
                optionalLabel={errors.description && errors.description.message} 
                optionalLabelColor={errors.description ? 'text-red-500' : "text-black"} 
                {...register("description")}
            />

            <Input 
                label="Price" 
                type="text" 
                placeholder="Enter price" 
                fieldset 
                legend="Price" 
                requirementLabel={errors.price && errors.price.message} 
                requirementColor={errors.price ? 'text-red-500' : "text-black"} 
                {...register("price")}
                onInput={(e: any) => {
                    e.target.value = e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1")
                    .replace(/^0+(?=\d)/, "")
                    .replace(/^(\d+)(\.\d{0,2})?.*$/, "$1$2");
                }}
            />
            
            <Input 
                label="Quantity" 
                type="number" 
                placeholder="Input Quantity" 
                fieldset 
                legend="Quantity" 
                requirementLabel={errors.quantity && errors.quantity.message} 
                requirementColor="text-red-500"
                {...register("quantity")}
            />

            <div className="w-full mt-4">
                <FileInput 
                    label="Upload Gallery Photos"
                    accept="image/*"
                    maxSizeLabel="Max size: 5MB"
                    multiple
                    onUpload={onUploadPhotoGalleryHandler}
                />
            </div>

            {(watch().photo_gallery ?? []).length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2 w-full">
                    {watch().photo_gallery?.map((src, index) => (
                    <div key={index} className="w-16 h-16 border rounded-lg overflow-hidden">
                        <img src={src} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    </div>
                    ))}
                </div>
            )}

            <div className="md:col-span-3 flex justify-end mt-5">
                <Button variant="primary" type="submit" disabled={isUpdateProductLoading}>{isUpdateProductLoading ? 'Updating..' : 'Update'}</Button>
            </div>
        </form>
    );
};

export default UpdateProductForm;
