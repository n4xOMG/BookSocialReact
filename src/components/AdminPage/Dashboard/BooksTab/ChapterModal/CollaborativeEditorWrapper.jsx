import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { getChapterByRoomId } from "../../../../../redux/chapter/chapter.action";
import { CollaborativeEditor } from "./CollaborativeEditor";

// Generate a random user color
const getRandomColor = () => {
  const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

// Create a random username
const getRandomUsername = () => `User-${Math.floor(Math.random() * 10000)}`;

const LoadingEditor = () => (
  <Paper elevation={3} sx={{ p: 4, m: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
    <Typography variant="h5">Loading editor...</Typography>
  </Paper>
);

export const CollaborativeEditorWrapper = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  // Generate stable user info for the session
  const userInfo = useMemo(
    () => ({
      name: getRandomUsername(),
      color: getRandomColor(),
    }),
    []
  );

  useEffect(() => {
    if (!roomId) return;

    console.log("Loading chapter data for room:", roomId);
    dispatch(getChapterByRoomId(roomId))
      .then((result) => {
        console.log("Chapter loaded:", result?.payload?.id);
      })
      .catch((error) => {
        console.error("Failed to load chapter:", error);
      });
  }, [dispatch, roomId]);

  if (!roomId) {
    return <div>Room ID is missing!</div>;
  }

  return (
    <LiveblocksProvider publicApiKey={process.env.REACT_APP_LIVEBLOCK_PUBLIC_KEY}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: null,
          user: userInfo,
        }}
      >
        <ClientSideSuspense fallback={<LoadingEditor />}>{() => <CollaborativeEditor />}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default CollaborativeEditorWrapper;
