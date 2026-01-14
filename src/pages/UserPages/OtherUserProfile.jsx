import { Alert, Box, Container, Grid, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserBooks from "../../components/OtherUserProfile/UserBooks";
import UserInfo from "../../components/OtherUserProfile/UserInfo";
import UserPosts from "../../components/OtherUserProfile/UserPosts";
import { getBooksByUserIdAction } from "../../redux/book/book.action";
import { fetchPostsByUserId } from "../../redux/post/post.action";
import { blockUser, followAuthorAction, getBlockedUsers, getProfileUserById, getUserById, unblockUser, unfollowAuthorAction } from "../../redux/user/user.action";
import { createChat, fetchUserChats } from "../../redux/chat/chat.action";
import { CLEAR_PROFILE_USER } from "../../redux/user/user.actionType";
const OtherUserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { profileUser: user, blockedUsers } = useSelector((state) => state.user, shallowEqual);
  const { user: currentUser } = useSelector((state) => state.auth, shallowEqual);
  const { booksByUserProfile  } = useSelector((state) => state.book, shallowEqual);
  const { postsByUser } = useSelector((state) => state.post, shallowEqual);
  const { chats } = useSelector((state) => state.chat, shallowEqual);
  const [blockLoading, setBlockLoading] = useState(false);
  const isViewingOwnProfile = useMemo(() => currentUser?.id === userId, [currentUser?.id, userId]);
  const blockedSet = useMemo(() => new Set((blockedUsers || []).map((blockedUser) => blockedUser.id)), [blockedUsers]);
  const isBlocked = blockedSet.has(userId);

  // Find existing chat with the target user
  const findExistingChat = useCallback((targetUserId) => {
    if (!chats || !currentUser) return null;
    return chats.find((chat) => {
      const isUserOne = chat.userOne?.id === currentUser.id && chat.userTwo?.id === targetUserId;
      const isUserTwo = chat.userTwo?.id === currentUser.id && chat.userOne?.id === targetUserId;
      return isUserOne || isUserTwo;
    });
  }, [chats, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || isViewingOwnProfile) return;

    try {
      if (user?.followedByCurrentUser) {
        await dispatch(unfollowAuthorAction(user.id));
      } else {
        await dispatch(followAuthorAction(user.id));
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };


  const handleMessageClick = async () => {
    if (isBlocked || isViewingOwnProfile) return;
    try {
      // First, check if a chat already exists with this user
      const existingChat = findExistingChat(userId);
      if (existingChat) {
        navigate(`/chats/${existingChat.id}`);
        return;
      }
      // If no existing chat, create a new one
      const chatId = await dispatch(createChat(userId));
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
          await dispatch(getProfileUserById(userId));
          await dispatch(fetchPostsByUserId(userId));
          await dispatch(getBooksByUserIdAction(userId));
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

  // Fetch user chats to check for existing conversations
  useEffect(() => {
    dispatch(fetchUserChats()).catch(() => {
      /* handled silently */
    });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_PROFILE_USER });
    };
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        overscrollBehavior: "contain",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f0f1c 0%, #1a1a2e 100%)"
            : "linear-gradient(135deg, #f8f7f4 0%, #e8e6e3 100%)",
      }}
    >
      <Container sx={{ width: "100%" }}>
        <Box sx={{ my: 4 }}>
          <UserInfo
            user={user}
            handleMessageClick={handleMessageClick}
            isBlocked={isBlocked}
            onBlockToggle={handleBlockToggle}
            blockLoading={blockLoading}
            disableActions={isViewingOwnProfile}
            onFollowToggle={handleFollowToggle}
            isFollowing={user?.followedByCurrentUser}
          />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <UserPosts posts={postsByUser} />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserBooks books={booksByUserProfile} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OtherUserProfile;
