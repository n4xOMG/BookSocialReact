import { AppBar, Box, CircularProgress, Tabs, Typography, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import { TabChapters } from "./ChapterListComponent/TabChapters";
import { TabPanel } from "./ChapterListComponent/TabPanel";
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const fetchChapters = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getAllChaptersByBookIdAction(bookId));
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  }, [bookId, dispatch]);

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
    <>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
            Chapters
          </Typography>

          <AppBar position="static" sx={{ boxShadow: "none" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="Chapters tab"
              sx={{
                backgroundColor: "#f9fafb",
                "& .Mui-selected": {
                  backgroundColor: "#f9fafb",
                  color: "black",
                },
                "& .MuiTab-root:not(.Mui-selected)": {
                  backgroundColor: "grey.300",
                  color: "black",
                },
              }}
            >
              <Tab label="All" {...a11yProps(0)} />
            </Tabs>
          </AppBar>

          <TabPanel value={value} index={0} dir={theme.direction}>
            <TabChapters chapters={chapters} progresses={progresses} onNavigate={onNavigate} bookId={bookId} />
          </TabPanel>
        </Box>
      )}
    </>
  );
};
