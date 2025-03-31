import './App.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wrapper from 'components/Wrapper'
import ProtectedRoute from "components/ProtectedRoute";
import { ROLES } from "constants/roles";
import { Route, Routes } from "react-router-dom";
import LoginPage from "pages/Login";
import DashboardPage from "pages/Dashboard";
import QueueReservationsPage from "pages/QueueReservations";
import InventoryPage from "pages/Inventory";
import ReportsPage from "pages/Reports";
import SettingsPage from "pages/Settings";

function App() {
  return (
    <Wrapper>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/queue-reservations" element={<QueueReservationsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Wrapper>
  )
}

export default App;
