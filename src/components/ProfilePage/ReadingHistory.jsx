import BookIcon from "@mui/icons-material/Book";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, Button, Chip, Divider, Grid, LinearProgress, Paper, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReadingProgressByUser } from "../../redux/user/user.action";
import { formatLastReadDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

const ReadingHistory = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { readingProgresses = [] } = useSelector((state) => state.user);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchReadingHistory = async () => {
      if (!userId) {
        if (isMounted) {
          setLoading(false);
          setError(null);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const result = await dispatch(getReadingProgressByUser());
        if (isMounted && result?.error) {
          setError(result.error || "Failed to load reading history.");
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load reading history.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReadingHistory();

    return () => {
      isMounted = false;
    };
  }, [dispatch, userId]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Skeleton variant="rectangular" width={60} height={80} sx={{ borderRadius: 1, mr: 2 }} />
              <Box width="100%">
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderRadius: 2 }} onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Paper>
    );
  }

  if (readingProgresses?.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BLANK.jpg/138px-BLANK.jpg"}
          alt="No reading history"
          sx={{
            width: 200,
            height: 200,
            mb: 3,
            opacity: 0.8,
          }}
        />
        <Typography variant="h6" gutterBottom>
          Your Reading Journey Awaits
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
          You haven't started reading any books yet. Explore our library and begin your reading adventure!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BookIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            py: 1,
          }}
        >
          Discover Books
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          fontWeight="medium"
          sx={{
            fontFamily: '"Playfair Display", serif',
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Your Reading History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track your progress on books you've been reading
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {readingProgresses?.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 1.5 : 2,
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: isMobile ? "row" : "row",
                  gap: isMobile ? 1.5 : 0,
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s",
                }}
              >
                {/* Book cover */}
                <Box
                  component="img"
                  src={item.bookCover.url}
                  alt={item.bookTitle}
                  sx={{
                    width: isMobile ? 56 : 80,
                    height: isMobile ? 84 : 120,
                    borderRadius: 1,
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}
                />

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0, ml: 2, }}>
                  {/* Title + Chip */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant={isMobile ? "subtitle2" : "h6"}
                      fontWeight={600}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: isMobile ? 2 : "unset",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.bookTitle}
                    </Typography>
                    

                    {!isMobile && (
                      <Chip
                        label={`${item.progress.toFixed(0)}%`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      textAlign: 'left',
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.bookAuthor}
                  </Typography>
                  {/* Chapter */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5, }}
                  >
                    Ch. {item.chapterNum}: {item.chapterName}
                  </Typography>

                  {/* Progress */}
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                    }}
                  />

                  {/* Footer */}
                  <Box
                    sx={{
                      mt: 1.2,
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "stretch" : "center",
                      gap: isMobile ? 1 : 0,
                    }}
                  >
                    {!isMobile && (
                      <Typography variant="caption" color="text.secondary">
                        Last read: {formatLastReadDate(item.lastReadAt)}
                      </Typography>
                    )}

                    <Button
                      size={isMobile ? "small" : "medium"}
                      fullWidth={isMobile}
                      variant="contained"
                      startIcon={<MenuBookIcon fontSize="small" />}
                      onClick={() => navigate(`/books/${item.bookId}/chapters/${item.chapterId}`)}
                      sx={{
                        textTransform: "none",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                        boxShadow: "0 4px 12px rgba(157, 80, 187, 0.3)",
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ReadingHistory;
