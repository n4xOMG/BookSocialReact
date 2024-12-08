import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, CardContent, Grid, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
export const UserBookChapterItem = React.memo(({ chapter, onEdit, onDelete, style }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid item xs={12} style={style}>
      <Card sx={{ "&:hover": { bgcolor: "grey.300" }, transition: "background-color 0.3s", textAlign: "left" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            {isSmallScreen ? `Chapter ${chapter.chapterNum}` : `Chapter ${chapter.chapterNum} ${chapter.title}`}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(chapter);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(chapter);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
});
