import { Alert, Box, Container, Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserBooks from "../../components/OtherUserProfile/UserBooks";
import UserInfo from "../../components/OtherUserProfile/UserInfo";
import UserPosts from "../../components/OtherUserProfile/UserPosts";
import { getBooksByAuthorAction } from "../../redux/book/book.action";
import { fetchPostsByUserId } from "../../redux/post/post.action";
import { blockUser, getBlockedUsers, getUserById, unblockUser } from "../../redux/user/user.action";
import { createChat } from "../../redux/chat/chat.action";
const OtherUserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Local state for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Selectors to retrieve data from Redux store
  const { user, blockedUsers } = useSelector((state) => state.user, shallowEqual);
  const { user: currentUser } = useSelector((state) => state.auth, shallowEqual);
  const { booksByAuthor } = useSelector((state) => state.book, shallowEqual);
  const { postsByUser } = useSelector((state) => state.post, shallowEqual);
  const [blockLoading, setBlockLoading] = useState(false);
  const isViewingOwnProfile = useMemo(() => currentUser?.id === userId, [currentUser?.id, userId]);
  const blockedSet = useMemo(() => new Set((blockedUsers || []).map((blockedUser) => blockedUser.id)), [blockedUsers]);
  const isBlocked = blockedSet.has(userId);
  const handleMessageClick = async () => {
    if (isBlocked || isViewingOwnProfile) return;
    try {
      // Dispatch createChat action and get the chatId
      const chatId = await dispatch(createChat(userId));
      // Navigate to the chat messages page
      navigate(`/chats/${chatId}`);
    } catch (error) {
      console.error("Failed to create or retrieve chat:", error);
    }
  };
  const handleBlockToggle = async () => {
    if (isViewingOwnProfile) return;
    setBlockLoading(true);
    try {
      if (isBlocked) {
        await dispatch(unblockUser(userId));
      } else {
        await dispatch(blockUser(userId));
      }
    } catch (err) {
      console.error("Failed to toggle block status:", err);
      setError(err.message || "Unable to update block status.");
    } finally {
      setBlockLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        console.log("Fetching user data...", userId);
        setLoading(true);
        setError(null);
        try {
          await dispatch(getUserById(userId));
          await dispatch(fetchPostsByUserId(userId));
          await dispatch(getBooksByAuthorAction(userId));
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError(err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getBlockedUsers()).catch(() => {
      /* handled silently */
    });
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="info">User not found.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overscrollBehavior: "contain" }}>
      <Container sx={{ width: "100%" }}>
        <Box sx={{ my: 4 }}>
          <UserInfo
            user={user}
            handleMessageClick={handleMessageClick}
            isBlocked={isBlocked}
            onBlockToggle={handleBlockToggle}
            blockLoading={blockLoading}
            disableActions={isViewingOwnProfile}
          />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <UserPosts posts={postsByUser} />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserBooks books={booksByAuthor} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OtherUserProfile;
