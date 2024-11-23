import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { getCurrentUserByJwt } from "./redux/auth/auth.action";
import { isTokenExpired, useAuthCheck } from "./utils/useAuthCheck";
import HomePage from "./pages/UserPages/HomePage";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import UserBookshelf from "./components/HomePage/UserBookshelf";
import BookClubs from "./pages/UserPages/BookClubs";
import UserBooks from "./pages/UserPages/UserBooks";
import UserUploadBook from "./pages/UserPages/UserUploadBook";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import ProfilePage from "./pages/UserPages/ProfilePage";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth, shallowEqual);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(false);
  const { AuthDialog } = useAuthCheck();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (jwt && !isTokenExpired(jwt) && !user) {
          await dispatch(getCurrentUserByJwt(jwt));
        }
      } catch (e) {
        console.log("Error loading app: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    console.log("App rendered");
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <HomePage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/library" element={user ? <UserBookshelf /> : <HomePage />} />
        <Route path="/book-clubs" element={<BookClubs />} />
        <Route path="/stories" element={user ? <UserBooks /> : <HomePage />} />
        <Route path="/upload-book" element={<UserUploadBook />} />
      </Routes>
      <AuthDialog />
    </div>
  );
}

export default App;
