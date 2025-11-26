import { MenuBook } from "@mui/icons-material";
import { Box, CircularProgress, Divider, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
      <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 2 : 3 }}>
        <MenuBook sx={{ mr: 1.5, color: "#9d50bb" }} />
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Chapters
        </Typography>
      </Box>

      <Divider sx={{ mb: isMobile ? 2 : 3, opacity: 0.3 }} />

      {chapters === undefined ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <CircularProgress size={30} thickness={4} sx={{ color: "#9d50bb" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Loading chapters...
          </Typography>
        </Box>
      ) : (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="Chapters tab"
            TabIndicatorProps={{
              style: {
                background: "linear-gradient(135deg, #9d50bb, #6e48aa)",
                height: "3px",
                borderRadius: "3px 3px 0 0",
              },
            }}
            sx={{
              borderBottom: 1,
              borderColor: "rgba(157, 80, 187, 0.2)",
              mb: isMobile ? 0 : 2,
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                py: 1.5,
                color: (theme) => theme.palette.text.secondary,
                transition: "all 0.3s ease",
              },
              "& .Mui-selected": {
                color: "#9d50bb",
                fontWeight: 700,
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
