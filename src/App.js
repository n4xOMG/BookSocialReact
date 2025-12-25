import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { shallowEqual, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import { CollaborativeEditorWrapper } from "./components/AdminPage/Dashboard/BooksTab/ChapterModal/CollaborativeEditorWrapper";
import ChapterDetailPage from "./components/HomePage/ChapterDetailPage/ChapterDetailPage";
import RateLimitAlert from "./components/common/RateLimitAlert";
import AccountRestrictionAlert from "./components/common/AccountRestrictionAlert";
import { useAuthInitialization, useRateLimitAlert, useAccountRestrictionAlert, useTheme, useWebSocketConnection } from "./hooks";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import OtpVerification from "./pages/Authentication/OtpVerification";
import EmailChangeVerification from "./pages/Authentication/EmailChangeVerification";
import RecoverEmail from "./pages/Authentication/RecoverEmail";
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
import AboutUs from "./pages/Static/AboutUs";
import FAQ from "./pages/Static/FAQ";
import PrivacyPolicy from "./pages/Static/PrivacyPolicy";
import TermsOfUse from "./pages/Static/TermsOfUse";
import ContactUs from "./pages/Static/ContactUs";

function App() {
  const { user } = useSelector((store) => store.auth, shallowEqual);
  const { AuthDialog } = useAuthCheck();

  // Custom hooks for separated concerns
  const { theme, toggleTheme } = useTheme();
  const { rateLimitAlert, handleCloseRateLimitAlert } = useRateLimitAlert();
  const { accountRestrictionAlert, handleCloseAccountRestrictionAlert } = useAccountRestrictionAlert();
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
            <Route path="/library" element={user ? <UserBookshelf /> : <HomePage />} />
            <Route path="/book-clubs" element={<BookClubs />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route path="/credit-packages" element={<CreditPackages />} />
            <Route path="/search-results" element={<BookSearchResults />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
            <Route path="/author/payout-settings" element={<AuthorPayoutSettings />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>
          <Route element={<Layout toggleTheme={toggleTheme} showFooter={false}/>}>
            <Route path="/chats/:chatId" element={user ? <MessagesPage /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <HomePage />} />
            <Route path="/profile/:userId" element={<OtherUserProfile />} />
            <Route path="/author/dashboard" element={<AuthorDashboard />} />
          </Route>
          <Route element={<Layout toggleTheme={toggleTheme} showHeader={false} showFooter={false}/>}>
            <Route path="/stories" element={<UserBooks />} />
          </Route>
          <Route element={<Layout toggleTheme={toggleTheme} showHeader={false} showSidebar={false}/>}>
            <Route path="/sign-in" element={<SignIn toggleTheme={toggleTheme} />} />
            <Route path="/sign-up" element={user ? <Navigate to="/" replace /> : <SignUp toggleTheme={toggleTheme} />} />
            <Route path="/verify-otp" element={user ? <Navigate to="/" replace /> : <OtpVerification toggleTheme={toggleTheme} />} />
            <Route path="/verify-email-change" element={<EmailChangeVerification toggleTheme={toggleTheme} />} />
            <Route path="/recover-email" element={<RecoverEmail toggleTheme={toggleTheme} />} />
            <Route path="/forgot-password" element={<ForgotPassword toggleTheme={toggleTheme} />} />
            <Route path="/reset-password" element={<ResetPassword toggleTheme={toggleTheme} />} />
          </Route>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/upload-book" element={<UserUploadBook />} />
          <Route path="/books/:bookId/chapters/:chapterId" element={<ChapterDetailPage />} />
          <Route path="/edit-chapter/:roomId" element={<CollaborativeEditorWrapper />} />
        </Routes>
        <AuthDialog />
        <RateLimitAlert open={rateLimitAlert.open} handleClose={handleCloseRateLimitAlert} retryAfter={rateLimitAlert.retryAfter} />
        <AccountRestrictionAlert
          open={accountRestrictionAlert.open}
          handleClose={handleCloseAccountRestrictionAlert}
          message={accountRestrictionAlert.message}
          isBanned={accountRestrictionAlert.isBanned}
          isSuspended={accountRestrictionAlert.isSuspended}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
