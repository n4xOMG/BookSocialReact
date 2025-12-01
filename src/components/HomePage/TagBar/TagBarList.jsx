import React, { useState } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import TagBarItem from "./TagBarItem";

const TagBarList = ({ onTagSelect, tags = [] }) => {
  const [selectedTagId, setSelectedTagId] = useState(null);
  const theme = useTheme();

  const handleTagClick = (tag) => {
    const newSelectedId = selectedTagId === tag.id ? null : tag.id;
    setSelectedTagId(newSelectedId);
    onTagSelect(newSelectedId ? tag : null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        gap={1.5}
        flexWrap="nowrap"
        width="100%"
        sx={{
          overflowX: "auto",
          pb: 1.5,
          pt: 1,
          px: 1,
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.secondary.main,
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.action.hover,
            borderRadius: "3px",
          },
        }}
      >
        {tags.map((tag, index) => (
          <TagBarItem key={tag.id} tag={tag} onClick={handleTagClick} tagIndex={index} isSelected={selectedTagId === tag.id} />
        ))}
      </Stack>
    </Box>
  );
};

export default TagBarList;
