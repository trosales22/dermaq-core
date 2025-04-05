import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wrapper from 'components/Wrapper'
import ProtectedRoute from "components/ProtectedRoute";
import { ROLES } from "constants/roles";
import { Route, Routes } from "react-router-dom";
import LoginPage from "pages/Login";
import DashboardPage from "pages/Dashboard";
import ClinicSessionPage from "pages/ClinicSession";
import ProductsPage from "pages/Products";
import SettingsPage from "pages/Settings";
import ClinicSessionDetailPage from 'pages/ClinicSessionDetail';
import StaffMgmtPage from 'pages/StaffMgmt';
import OrdersPage from 'pages/Orders';
import CustomersPage from 'pages/Customers';

function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clinic-sessions" element={<ClinicSessionPage />} />
          <Route path="/clinic-sessions/:uuid" element={<ClinicSessionDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/staff-management" element={<StaffMgmtPage />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Wrapper>
  )
}

export default App;
