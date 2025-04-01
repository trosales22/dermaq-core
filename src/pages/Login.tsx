import { Input, Button, Alert } from 'components/ui/components';
import React, { useEffect } from 'react';
import AppLogo from 'assets/images/app-logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "schemas/loginSchema";
import { toast } from 'react-toastify';
import { useLoginMutation } from 'hooks/auth';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const userId = 'admin@dermaq.ph'
    const password = 'Admin@123'
    const navigate = useNavigate();

    const authStatus = Cookies.get('auth_status') ?? '';
    
    useEffect(() => {
        if(authStatus === 'authenticated'){
            navigate("/");
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            user_id: userId,
            password: password
        }
    });

    const loginMutation = useLoginMutation({
        onSuccess: (res) => {
            toast.success("Successfully logged in.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "colored"
            });

            Cookies.set('auth_status', 'authenticated');
            Cookies.set('token', res.data?.access_token?.token);
            Cookies.set('firstname', res?.data?.details?.firstname);
            Cookies.set('lastname', res?.data?.details?.lastname);
            Cookies.set('role', res?.data?.details?.role);

            navigate("/");
        },
        onError: () => {}
    });

    const onSubmit = (data: LoginData) => {
        loginMutation.mutate(data);
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center app-background">
            <div className="flex w-full h-screen items-center px-6 md:px-12">
                <div className="flex-1"></div>
                <div className="flex flex-col w-full max-w-xl bg-base-100 shadow-2xl rounded-lg p-12 space-y-6">
                    <div className="flex justify-center">
                        <img 
                            src={AppLogo} 
                            alt="DermaQ"
                            className="rounded-full h-20 w-20 object-cover"
                        />
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <p className="text-2xl font-bold text-center text-black">Admin Login</p>
                        <Input 
                            label="User ID" 
                            type="text" 
                            placeholder="Enter user ID" 
                            fieldset 
                            legend="User ID" 
                            requirementColor="text-red-500"
                            requirementLabel={errors.user_id ? errors.user_id.message : ""} 
                            {...register("user_id")}
                        />

                        <Input 
                            label="Password" 
                            type="password" 
                            placeholder="Enter password" 
                            fieldset 
                            legend="Password"  
                            requirementColor="text-red-500"
                            requirementLabel={errors.password ? errors.password.message : ""} 
                            {...register("password")}
                        />

                        <div className="text-right">
                            <a href="#" className="text-sm text-black hover:underline">Forgot password?</a>
                        </div>

                        <Button variant="black" type="submit" className="w-full mb-5">Login</Button>

                        <Alert
                            type="info"
                            message={`For Super Admin access, use '${userId}' with password '${password}'.`}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;