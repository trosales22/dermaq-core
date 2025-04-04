import Layout from "components/Layout";
import FileInput from "components/ui/FileInput";
import Input from "components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormData, userSchema } from "schemas/userSchema";
import { useEffect } from "react";
import { useChangePasswordMutation, useMyProfile, useUpdateMyProfileMutation } from "hooks/auth";
import Button from "components/ui/Button";
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { UpdatePasswordFormData, updatePasswordSchema } from "schemas/updatePasswordSchema";

const SettingsPage = () => {
    const queryClient = useQueryClient()
    const {
        watch,
        setValue,
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema)
    });

    const {
        reset: updatePasswordReset,
        register: updatePasswordRegister,
        handleSubmit: updatePasswordHandleSubmit,
        formState: { errors: updatePasswordErrors },
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema)
    });


    const { data: response }: any = useMyProfile({});
    const detail = response?.data?.data || null

    useEffect(() => {
        setValue('username', detail?.username || '')
        setValue('email', detail?.email || '')
        setValue('firstname', detail?.firstname || '')
        setValue('lastname', detail?.lastname || '')
        setValue('mobile', detail?.mobile || '')
        setValue('photo_url', detail?.photo_url || null)
    }, [response])

    const { mutate: updateMyProfile, isPending: isUpdateMyProfileLoading } = useUpdateMyProfileMutation({
        onSuccess: () => {
            toast.info("Profile updated successfully.")

            Cookies.set('firstname', watch().firstname)
            Cookies.set('lastname', watch().lastname)

            reset()
            queryClient.invalidateQueries({ queryKey: ['MY_PROFILE'] })
        },
        onError: () => {}
    });

    const { mutate: changePassword, isPending: isChangePasswordLoading } = useChangePasswordMutation({
        onSuccess: () => {
            toast.info("Password updated successfully.")

            updatePasswordReset()
            queryClient.invalidateQueries({ queryKey: ['MY_PROFILE'] })
        },
        onError: () => {}
    });
    
    const onSubmitEditProfile = (data: UserFormData) => {
        updateMyProfile(data)
    }

    const onSubmitChangePassword = (data: UpdatePasswordFormData) => {
        changePassword(data)
    }

    const onError = (errors: any) => {
        console.log("Errors:", errors);
    };

    const onUploadMainPhotoHandler = (urls: string[]) => {
        setValue('photo_url', urls[0])
    }

    return (
        <Layout>
            <h1 className="text-2xl font-bold">Settings</h1>

            <div className="w-full grid grid-cols-2 gap-2 mt-5">
                <div className="border border-blue-100 p-5">
                    <p className="text-xl font-bold">Edit Profile</p>
                    <form onSubmit={handleSubmit(onSubmitEditProfile, onError)} className="w-full">
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

                        <div className="w-full grid grid-cols-1 gap-2">
                            <div className="md:col-span-3 flex justify-end mt-5">
                                <Button variant="primary" type="submit" disabled={isUpdateMyProfileLoading}>{isUpdateMyProfileLoading ? 'Saving changes..' : 'Save changes'}</Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="border border-blue-100 p-5">
                    <p className="text-xl font-bold">Change Password</p>
                    <form onSubmit={updatePasswordHandleSubmit(onSubmitChangePassword, onError)} className="w-full">
                        <div className="w-full grid grid-cols-2 gap-2">
                            <Input 
                                label="Old Password" 
                                type="password" 
                                placeholder="Enter old password" 
                                fieldset 
                                legend="Old Password" 
                                requirementLabel={updatePasswordErrors.old_password && updatePasswordErrors.old_password.message} 
                                requirementColor="text-red-500"
                                {...updatePasswordRegister("old_password")}
                            />

                            <Input 
                                label="New Password" 
                                type="password" 
                                placeholder="Enter new password" 
                                fieldset 
                                legend="New Password" 
                                requirementLabel={updatePasswordErrors.new_password && updatePasswordErrors.new_password.message} 
                                requirementColor="text-red-500"
                                {...updatePasswordRegister("new_password")}
                            />
                        </div>
                        
                        <div className="w-full grid grid-cols-1 gap-2">
                            <div className="md:col-span-3 flex justify-end mt-5">
                                <Button variant="primary" type="submit" disabled={isChangePasswordLoading}>{isChangePasswordLoading ? 'Updating password..' : 'Update Password'}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>   
        </Layout>
    );
};

export default SettingsPage;
