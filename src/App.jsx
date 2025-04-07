import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import NewOrder from "./pages/NewOrder";
import AddCompany from "./pages/AddCompany";
import EditOrder from "./components/EditOrder";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ManageUsers from "./pages/ManageUsers";
import ManageStaff from "./pages/ManageStaff";

// Configure axios base URL
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <div className="container layout">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes for all authenticated users */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["systemAdmin", "admin", "staff"]}
                />
              }
            >
              <Route path="/" element={<Navigate replace to="/orders" />} />{" "}
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
            </Route>

            {/* Routes for admins only */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["systemAdmin", "admin"]} />
              }
            >
              <Route path="/orders/new" element={<NewOrder />} />
              <Route path="/orders/:orderId/edit" element={<EditOrder />} />
              <Route path="/companies/add" element={<AddCompany />} />
            </Route>

            {/* Routes for system admin only */}
            <Route element={<ProtectedRoute allowedRoles={["systemAdmin"]} />}>
              <Route path="/manage/users" element={<ManageUsers />} />
            </Route>

            {/* Routes for regular admins */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/manage/staff" element={<ManageStaff />} />
            </Route>

            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
