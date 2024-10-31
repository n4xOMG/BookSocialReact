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
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/bookshelf" element={<UserBookshelf />} />
        <Route path="/book-clubs" element={<BookClubs />} />
        <Route path="/stories" element={<UserBooks />} />
      </Routes>
      <AuthDialog />
    </div>
  );
}

export default App;
