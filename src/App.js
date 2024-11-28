import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChapterDetailPage from "./components/HomePage/ChapterDetailPage/ChapterDetailPage";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import BookClubs from "./pages/UserPages/BookClubs";
import { BookDetailPage } from "./pages/UserPages/BookDetailPage";
import CreditPackages from "./pages/UserPages/CreditPackages";
import HomePage from "./pages/UserPages/HomePage";
import MessagesPage from "./pages/UserPages/MessagesPage";
import OtherUserProfile from "./pages/UserPages/OtherUserProfile";
import ProfilePage from "./pages/UserPages/ProfilePage";
import UserBooks from "./pages/UserPages/UserBooks";
import UserUploadBook from "./pages/UserPages/UserUploadBook";
import { getCurrentUserByJwt } from "./redux/auth/auth.action";
import { isTokenExpired, useAuthCheck } from "./utils/useAuthCheck";
import UserBookshelf from "./pages/UserPages/UserBookshelf";
import BookSearchResults from "./pages/UserPages/BookSearchResults";
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
        <Route path="/profile/:userId" element={<OtherUserProfile />} />
        <Route path="/chats/:chatId" element={user ? <MessagesPage /> : <HomePage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <HomePage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search-results" element={<BookSearchResults />} />
        <Route path="/library" element={user ? <UserBookshelf /> : <HomePage />} />
        <Route path="/book-clubs" element={<BookClubs />} />
        <Route path="/credit-packages" element={<CreditPackages />} />
        <Route path="/stories" element={user ? <UserBooks /> : <HomePage />} />
        <Route path="/upload-book" element={<UserUploadBook />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/books/:bookId/chapters/:chapterId" element={<ChapterDetailPage />} />
      </Routes>
      <AuthDialog />
    </div>
  );
}

export default App;
