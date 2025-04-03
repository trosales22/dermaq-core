import { BarChart2, Box, ClipboardList, Home, Settings, Users } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./ui/Sidebar";
import Wrapper from "./Wrapper";
import { Button, Modal } from "components/ui/components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "hooks/auth";
import { useState } from "react";
import Cookies from "js-cookie";
import { Role, ROLES } from "constants/roles";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [openLogout, setOpenLogout] = useState(false);
    const navigate = useNavigate();
    const userRole = (Cookies.get('role') as Role) ?? 'ADMIN';
    const firstName = Cookies.get('firstname')
    const lastName = Cookies.get('lastname')
    const userName = firstName && lastName ? `${firstName} ${lastName}` : "Unknown";

    const { mutate: logout, isPending: isLogoutLoading } = useLogoutMutation({
        onSuccess: () => {
            toast.success("Successfully logged out.");

            Cookies.remove('auth_status');
            Cookies.remove('firstname');
            Cookies.remove('lastname');
            Cookies.remove('token');
            Cookies.remove('role');

            navigate("/login");
        },
        onError: () => {}
    })

    const onShowLogoutModal = () => {
        setOpenLogout(true)
    }

    const onLogoutHander = () => {
        logout({})
    }

    const headerNavItems = [
        { label: "Profile" },
        { label: "Settings" },
        { label: "Logout", onClick: onShowLogoutModal }
    ];

    const allMenuItems = [
        { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/", roles: [ROLES.ADMIN] },
        { label: "Clinic Sessions", icon: <ClipboardList className="h-5 w-5" />, path: "/clinic-sessions", roles: [ROLES.ADMIN] }, 
        { label: "Products", icon: <Box className="h-5 w-5" />, path: "/products", roles: [ROLES.ADMIN] },
        { label: "Reports", icon: <BarChart2 className="h-5 w-5" />, path: "/reports", roles: [ROLES.ADMIN] },
        { label: "Staff Management", icon: <Users className="h-5 w-5" />, path: "/staff-management", roles: [ROLES.ADMIN] },
        { label: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings", roles: [ROLES.ADMIN] },
    ];

    const sidebarMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));
    
    const roleMap: Record<string, string> = {
        [ROLES.ADMIN]: 'Administrator'
    };
    
    const formattedRole = roleMap[userRole] || 'Unknown';

    return (
        <Wrapper>
            <Navbar 
                appName="DermaQ" 
                avatarSrc="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                dropdownItems={headerNavItems}
                userName={userName}
                role={formattedRole}
            />

            <div className="flex">
                <Sidebar items={sidebarMenuItems} />
                <div className="flex-1 p-6 ml-72 pt-18">
                    {children}
                </div>
            </div>

            <Modal
                id="logout-modal"
                title="Confirm Logout"
                isOpen={openLogout}
                onClose={() => setOpenLogout(false)}
                headerColor="red"
            >
                <p>Are you sure you want to logout?</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="ghost" onClick={() => setOpenLogout(false)}>No</Button>
                    <Button variant="danger" className="text-white" onClick={onLogoutHander} disabled={isLogoutLoading}>{isLogoutLoading ? 'Logging out..' : 'Yes'}</Button>
                </div>
            </Modal>
        </Wrapper>
    );
};

export default Layout;
