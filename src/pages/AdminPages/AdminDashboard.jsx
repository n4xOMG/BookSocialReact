import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/AdminPage/Layout/Header";
import Sidebar from "../../components/AdminPage/Layout/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";
import Overview from "../../components/AdminPage/Dashboard/Overview";
import BooksTab from "../../components/AdminPage/Dashboard/BooksTab";
import CreditsManagement from "../../components/AdminPage/Dashboard/CreditsManagement";
import CategoriesTab from "../../components/AdminPage/Dashboard/CategoriesTab";
import TagsTab from "../../components/AdminPage/Dashboard/TagsTab";
import UserManagement from "../../components/AdminPage/Dashboard/UserManagement";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />
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
