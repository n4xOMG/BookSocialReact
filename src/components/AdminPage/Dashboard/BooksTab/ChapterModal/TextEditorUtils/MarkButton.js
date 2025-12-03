import { Button } from "@mui/material";
import { useSlate } from "slate-react";
import { Editor } from "slate";

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <Button
      size="small"
      variant={isActive ? "contained" : "outlined"}
      color={isActive ? "primary" : "inherit"}
      sx={{
        minWidth: "40px",
        height: "40px",
        p: 1,
        borderRadius: "4px",
        "& .MuiSvgIcon-root": {
          fontSize: "1.2rem",
        },
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      title={format.charAt(0).toUpperCase() + format.slice(1)}
    >
      {icon}
    </Button>
  );
};
