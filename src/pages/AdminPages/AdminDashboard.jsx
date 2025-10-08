import { Box, Toolbar } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import BooksTab from "../../components/AdminPage/Dashboard/BooksTab";
import CategoriesTab from "../../components/AdminPage/Dashboard/CategoriesTab";
import CreditsManagement from "../../components/AdminPage/Dashboard/CreditsManagement";
import Overview from "../../components/AdminPage/Dashboard/Overview";
import ReportsManagement from "../../components/AdminPage/Dashboard/ReportsManagement";
import PayoutsManagement from "../../components/AdminPage/Dashboard/PayoutsManagement";
import TagsTab from "../../components/AdminPage/Dashboard/TagsTab";
import UserManagement from "../../components/AdminPage/Dashboard/UserManagement";
import ProtectedRoute from "../../components/ProtectedRoute";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Routes>
          <Route
            path="/overview"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <ReportsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payouts"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <PayoutsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <BooksTab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <CreditsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <CategoriesTab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute roles={["ADMIN", "MODERATOR"]}>
                <TagsTab />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
