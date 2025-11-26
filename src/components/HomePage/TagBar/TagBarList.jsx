import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import TagBarItem from "./TagBarItem";

const TagBarList = ({ onTagSelect, tags = [] }) => {
  const [selectedTagId, setSelectedTagId] = useState(null);

  const handleTagClick = (tag) => {
    const newSelectedId = selectedTagId === tag.id ? null : tag.id;
    setSelectedTagId(newSelectedId);
    onTagSelect(newSelectedId ? tag : null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        gap={1}
        flexWrap="nowrap"
        width="100%"
        sx={{
          overflowX: "auto",
          pb: 1,
          pt: 2,
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) => theme.palette.grey[400],
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
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
