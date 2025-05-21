import { MenuBook } from "@mui/icons-material";
import { Box, CircularProgress, Divider, Tabs, Typography, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import { TabChapters } from "./ChapterListComponent/TabChapters";
import { TabPanel } from "./ChapterListComponent/TabPanel";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const ChapterList = ({ chapters = [], progresses, onNavigate, bookId, user, onFirstChapterId }) => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Set first chapter id if chapters change
  useEffect(() => {
    if (chapters?.length > 0) {
      onFirstChapterId && onFirstChapterId(chapters[0].id);
    }
    // eslint-disable-next-line
  }, [chapters]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <MenuBook sx={{ mr: 1.5 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Chapters
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {chapters === undefined ? (
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
