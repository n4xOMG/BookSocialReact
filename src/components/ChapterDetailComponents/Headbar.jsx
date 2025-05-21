import { ArrowBack, Favorite, FavoriteBorder } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";
import { likeChapterAction, unlikeChapterAction } from "../../redux/chapter/chapter.action";
import { useDispatch } from "react-redux";
import ReportIcon from "@mui/icons-material/Report";
import { createReportAction } from "../../redux/report/report.action";
import ReportModal from "../BookClubs/ReportModal";

export default function Headbar({ chapter, onNavigate, checkAuth }) {
  const dispatch = useDispatch();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const handleLikeChapter = checkAuth(
    useCallback(async () => {
      setLikeLoading(true);
      try {
        if (chapter?.likedByCurrentUser) {
          await dispatch(unlikeChapterAction(chapter.id));
        } else {
          await dispatch(likeChapterAction(chapter.id));
        }
      } finally {
        setLikeLoading(false);
      }
    }, [dispatch, chapter])
  );

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason("");
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason for reporting.");
      return;
    }
    setReportLoading(true);
    const reportData = {
      reason: reportReason,
      chapter: { id: chapter.id }, // Ensure 'id' is lowercase
    };

    try {
      console.log("Report data:", reportData);
      await dispatch(createReportAction(reportData));
      alert("Report submitted successfully.");
      handleCloseReportModal();
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ position: "fixed", bgcolor: "#050505", opacity: "90%", borderBottom: 1, borderColor: "divider", top: 0 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ color: "white" }} edge="start" aria-label="go back" onClick={onNavigate}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" }, color: "white" }}>
            Book Social
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", color: "white" }}>
          Ch.{chapter.chapterNum}: {chapter.title}
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
          <Button onClick={handleLikeChapter} sx={{ color: "white" }} disabled={likeLoading}>
            {chapter?.likedByCurrentUser ? <Favorite /> : <FavoriteBorder />}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReportIcon />}
            sx={{ color: "white", borderColor: "white" }}
            onClick={handleOpenReportModal}
          >
            Report
          </Button>
        </Box>
      </Toolbar>
      <ReportModal
        open={isReportModalOpen}
        onClose={handleCloseReportModal}
        reportReason={reportReason}
        setReportReason={setReportReason}
        handleSubmitReport={handleSubmitReport}
        loading={reportLoading}
      />
    </AppBar>
  );
}
