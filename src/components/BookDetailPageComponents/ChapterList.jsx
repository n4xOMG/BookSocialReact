import { Box, CircularProgress, Tabs, Typography, useTheme, Paper, Divider, LinearProgress } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import { TabChapters } from "./ChapterListComponent/TabChapters";
import { TabPanel } from "./ChapterListComponent/TabPanel";
import { MenuBook } from "@mui/icons-material";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const ChapterList = ({ progresses, onCalculateProgress, onNavigate, bookId, user, onFirstChapterId }) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { chapters } = useSelector((store) => store.chapter);
  const theme = useTheme();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const fetchChapters = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getAllChaptersByBookIdAction(jwt, bookId));
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId, dispatch]);

  useEffect(() => {
    fetchChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      onCalculateProgress(chapters, progresses);
    }
    if (chapters?.length > 0) {
      onFirstChapterId(chapters[0].id);
    }
  }, [chapters, dispatch, onFirstChapterId, user]);

  useEffect(() => {
    onCalculateProgress(chapters, progresses);
  }, [chapters, progresses, onCalculateProgress]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MenuBook sx={{ mr: 1.5 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Chapters
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress size={30} thickness={4} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading chapters...
          </Typography>
        </Box>
      ) : (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            variant="fullWidth"
            aria-label="Chapters tab"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 2,
              "& .MuiTab-root": {
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                py: 1.5,
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
            }}
          >
            <Tab label="All Chapters" {...a11yProps(0)} />
          </Tabs>

          <TabPanel value={value} index={0} dir={theme.direction}>
            <TabChapters chapters={chapters} progresses={progresses} onNavigate={onNavigate} bookId={bookId} />
          </TabPanel>

          {chapters?.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No chapters available yet. Check back soon!
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
