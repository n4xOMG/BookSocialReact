import { CircularProgress, Box } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CollaborativeEditorWrapper } from "./components/AdminPage/Dashboard/BooksTab/ChapterModal/CollaborativeEditor";
import ChapterDetailPage from "./components/HomePage/ChapterDetailPage/ChapterDetailPage";
import RateLimitAlert from "./components/common/RateLimitAlert";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import BookClubs from "./pages/UserPages/BookClubs";
import { BookDetailPage } from "./pages/UserPages/BookDetailPage";
import BookSearchResults from "./pages/UserPages/BookSearchResults";
import CreditPackages from "./pages/UserPages/CreditPackages";
import HomePage from "./pages/UserPages/HomePage";
import MessagesPage from "./pages/UserPages/MessagesPage";
import OtherUserProfile from "./pages/UserPages/OtherUserProfile";
import ProfilePage from "./pages/UserPages/ProfilePage";
import UserBooks from "./pages/UserPages/UserBooks";
import UserBookshelf from "./pages/UserPages/UserBookshelf";
import UserUploadBook from "./pages/UserPages/UserUploadBook";
import { getCurrentUserByJwt } from "./redux/auth/auth.action";
import { isTokenExpired, useAuthCheck } from "./utils/useAuthCheck";
import PostDetail from "./pages/UserPages/PostDetails";
import { connectWebSocket, disconnectWebSocket } from "./services/websocket.service";
import { apiEvents } from "./services/api.service";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading: authLoading } = useSelector((store) => store.auth, shallowEqual);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(false);
  const { AuthDialog } = useAuthCheck();
  const [rateLimitAlert, setRateLimitAlert] = useState({
    open: false,
    retryAfter: null,
  });

  useEffect(() => {
    // Rate limit event listener
    const handleRateLimit = (data) => {
      setRateLimitAlert({
        open: true,
        retryAfter: data.retryAfter,
      });
    };

    apiEvents.on("rateLimitExceeded", handleRateLimit);

    return () => {
      apiEvents.off("rateLimitExceeded", handleRateLimit);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (loading || authLoading) return;

      try {
        setLoading(true);
        if (jwt && !isTokenExpired(jwt) && !user) {
          await dispatch(getCurrentUserByJwt(jwt));
        }
      } catch (e) {
        console.error("Error loading app: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch, jwt, user, authLoading]);

  // WebSocket connection - only initialize when user is authenticated
  useEffect(() => {
    let wsCleanup;

    if (isAuthenticated && user?.id) {
      console.log("App.js: Initializing WebSocket connection for user", user.username);
      wsCleanup = connectWebSocket(user.username);
    }

    return () => {
      if (wsCleanup) {
        console.log("App.js: Cleaning up WebSocket connection");
        wsCleanup();
      }
    };
  }, [isAuthenticated, user]);

  const handleCloseRateLimitAlert = () => {
    setRateLimitAlert({
      ...rateLimitAlert,
      open: false,
    });
  };

  // Simple loading component
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/edit-chapter/:roomId" element={<CollaborativeEditorWrapper />} />
      </Routes>
      <AuthDialog />
      <RateLimitAlert open={rateLimitAlert.open} handleClose={handleCloseRateLimitAlert} retryAfter={rateLimitAlert.retryAfter} />
    </div>
  );
}

export default App;
