import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import Login from "./pages/Login";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import Transactions from "./pages/Transactions";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Public Route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/send-money"
          element={
            <ProtectedRoute>
              <SendMoney />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;