import { Button } from "@mui/material";
import { useSlate } from "slate-react";
import clsx from "clsx";
import { css } from "@emotion/react";
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
      active={isActive ? "true" : undefined}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className={clsx(css`
        ${isActive ? "background-color: lightgray;" : ""}
      `)}
    >
      {icon}
    </Button>
  );
};
