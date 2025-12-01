import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { shallowEqual, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import { CollaborativeEditorWrapper } from "./components/AdminPage/Dashboard/BooksTab/ChapterModal/CollaborativeEditorWrapper";
import ChapterDetailPage from "./components/HomePage/ChapterDetailPage/ChapterDetailPage";
import RateLimitAlert from "./components/common/RateLimitAlert";
import { useAuthInitialization, useRateLimitAlert, useTheme, useWebSocketConnection } from "./hooks";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import OtpVerification from "./pages/Authentication/OtpVerification";
import ResetPassword from "./pages/Authentication/ResetPassword";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import AuthorDashboard from "./pages/UserPages/AuthorDashboard";
import AuthorPayoutSettings from "./pages/UserPages/AuthorPayoutSettings";
import BookClubs from "./pages/UserPages/BookClubs";
import { BookDetailPage } from "./pages/UserPages/BookDetailPage";
import BookSearchResults from "./pages/UserPages/BookSearchResults";
import CreditPackages from "./pages/UserPages/CreditPackages";
import HomePage from "./pages/UserPages/HomePage";
import MessagesPage from "./pages/UserPages/MessagesPage";
import OtherUserProfile from "./pages/UserPages/OtherUserProfile";
import PostDetail from "./pages/UserPages/PostDetails";
import ProfilePage from "./pages/UserPages/ProfilePage";
import UserBooks from "./pages/UserPages/UserBooks";
import UserBookshelf from "./pages/UserPages/UserBookshelf";
import UserUploadBook from "./pages/UserPages/UserUploadBook";
import { useAuthCheck } from "./utils/useAuthCheck";

function App() {
  const { user } = useSelector((store) => store.auth, shallowEqual);
  const { AuthDialog } = useAuthCheck();

  // Custom hooks for separated concerns
  const { theme, toggleTheme } = useTheme();
  const { rateLimitAlert, handleCloseRateLimitAlert } = useRateLimitAlert();
  const { loading } = useAuthInitialization();
  useWebSocketConnection();

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route element={<Layout toggleTheme={toggleTheme} />}>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/stories" element={user ? <UserBooks toggleTheme={toggleTheme}/> : <HomePage toggleTheme={toggleTheme}/>} /> */}
            <Route path="/library" element={user ? <UserBookshelf /> : <HomePage />} />
            <Route path="/book-clubs" element={<BookClubs />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <HomePage />} />
            <Route path="/profile/:userId" element={<OtherUserProfile />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route path="/credit-packages" element={<CreditPackages />} />
            <Route path="/search-results" element={<BookSearchResults />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/author/dashboard" element={<AuthorDashboard />} />
            <Route path="/author/payout-settings" element={<AuthorPayoutSettings />} />
            <Route path="/chats/:chatId" element={user ? <MessagesPage /> : <Navigate to="/" replace />} />
          </Route>
          <Route element={<Layout toggleTheme={toggleTheme} showHeader={false} />}>
            <Route path="/stories" element={<UserBooks />} />
          </Route>

          <Route path="/sign-in" element={<SignIn toggleTheme={toggleTheme} />} />
          <Route path="/sign-up" element={user ? <Navigate to="/" replace /> : <SignUp toggleTheme={toggleTheme} />} />
          <Route path="/verify-otp" element={user ? <Navigate to="/" replace /> : <OtpVerification toggleTheme={toggleTheme} />} />
          <Route path="/forgot-password" element={<ForgotPassword toggleTheme={toggleTheme} />} />
          <Route path="/reset-password" element={<ResetPassword toggleTheme={toggleTheme} />} />

          <Route path="/admin/*" element={<AdminDashboard />} />

          <Route path="/upload-book" element={<UserUploadBook />} />
          <Route path="/books/:bookId/chapters/:chapterId" element={<ChapterDetailPage />} />
          <Route path="/edit-chapter/:roomId" element={<CollaborativeEditorWrapper />} />
        </Routes>
        <AuthDialog />
        <RateLimitAlert open={rateLimitAlert.open} handleClose={handleCloseRateLimitAlert} retryAfter={rateLimitAlert.retryAfter} />
      </div>
    </ThemeProvider>
  );
}

export default App;
