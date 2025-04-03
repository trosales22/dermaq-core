import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, FileInput } from 'components/ui/components'
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import { useShowStaffById, useUpdateStaffMutation } from "hooks/staff";
import { StaffFormData, staffSchema } from "schemas/staffSchema";

interface UpdateStaffFormProps {
    staffId?: string | undefined | null;
    onClose: () => void;
}

const UpdateStaffForm: FC<UpdateStaffFormProps> = ({ staffId, onClose }) => {
    const queryClient = useQueryClient()

    const {
        watch,
        setValue,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema)
    });

    const { data: response }: any = useShowStaffById({
        staffId
    })

    const detail = response?.data?.data?.attributes || null

    useEffect(() => {
        setValue('username', detail?.username)
        setValue('firstname', detail?.firstname)
        setValue('lastname', detail?.lastname)
        setValue('email', detail?.email)
        setValue('mobile', detail?.mobile)
        setValue('photo_url', detail?.photo_url || null)
    }, [staffId, detail])

    const { mutate: updateStaff, isPending: isUpdateStaffLoading } = useUpdateStaffMutation({
        onSuccess: () => {
            toast.success("Update staff successfully.");
            queryClient.invalidateQueries({ queryKey: ['STAFF_SHOW', staffId] });
            queryClient.invalidateQueries({ queryKey: ['STAFF_LIST'] });

            onClose();
            reset();
        },
        onError: () => {}
    });

    const onSubmit = (data: StaffFormData) => {
        updateStaff({
            staffId,
            payload: data
        })
    }

    const onError = (errors: any) => {
        console.log("Errors:", errors);
    };

    const onUploadMainPhotoHandler = (urls: string[]) => {
        setValue('photo_url', urls[0])
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

            <div className="w-full grid grid-cols-2 gap-2">
                <Input 
                    label="Username" 
                    type="text" 
                    placeholder="Enter username" 
                    fieldset 
                    legend="Username" 
                    requirementLabel={errors.username && errors.username.message} 
                    requirementColor="text-red-500"
                    {...register("username")}
                />

                <Input 
                    label="Email" 
                    type="email" 
                    placeholder="Enter email" 
                    fieldset 
                    legend="Email" 
                    requirementLabel={errors.email && errors.email.message} 
                    requirementColor={errors.email ? 'text-red-500' : "text-black"} 
                    {...register("email")}
                />
            </div>

            
            <div className="w-full grid grid-cols-2 gap-2">
                <Input 
                    label="Firstname" 
                    type="text" 
                    placeholder="Enter firstname" 
                    fieldset 
                    legend="First name" 
                    requirementLabel={errors.firstname && errors.firstname.message} 
                    requirementColor="text-red-500"
                    {...register("firstname")}
                />

                <Input 
                    label="Lastname" 
                    type="text" 
                    placeholder="Enter lastname" 
                    fieldset 
                    legend="Last name" 
                    requirementLabel={errors.lastname && errors.lastname.message} 
                    requirementColor="text-red-500"
                    {...register("lastname")}
                />
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
                <Input 
                    label="Mobile Number" 
                    type="text" 
                    placeholder="Enter mobile number" 
                    fieldset 
                    legend="Mobile number" 
                    requirementLabel={errors.mobile && errors.mobile.message} 
                    requirementColor={errors.mobile ? 'text-red-500' : "text-black"} 
                    {...register("mobile")}
                />
            </div>

            <div className="md:col-span-3 flex justify-end mt-5">
                <Button variant="primary" type="submit" disabled={isUpdateStaffLoading}>{isUpdateStaffLoading ? 'Updating..' : 'Update'}</Button>
            </div>
        </form>
    );
};

export default UpdateStaffForm;
