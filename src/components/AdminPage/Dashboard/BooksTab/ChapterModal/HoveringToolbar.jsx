import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Editor, Range } from "slate";
import { ReactEditor, useFocused, useSlate } from "slate-react";

import { BlockButton } from "./TextEditorUtils/BlockButton";
import { InsertImageButton } from "./TextEditorUtils/InsertImageHandler";
import { MarkButton } from "./TextEditorUtils/MarkButton";

export const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight - 6}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  return ReactDOM.createPortal(
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        padding: "8px",
        position: "absolute",
        zIndex: 10000,
        top: "-10000px",
        left: "-10000px",
        marginTop: "-6px",
        opacity: 0,
        backgroundColor: "background.paper",
        color: "text.primary",
        borderRadius: "8px",
        transition: "opacity 0.75s",
        display: "flex",
        gap: 0.5,
        border: "1px solid",
        borderColor: "divider",
        "& .MuiIconButton-root": {
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
            backgroundColor: "action.hover",
          },
          "&.Mui-selected": {
             color: "primary.main",
             backgroundColor: "action.selected",
          }
        },
      }}
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
      <MarkButton format="bold" icon={<FormatBoldIcon />} />
      <MarkButton format="italic" icon={<FormatItalicIcon />} />
      <MarkButton format="underline" icon={<FormatUnderlinedIcon />} />
      <div style={{ width: "1px", height: "24px", backgroundColor: "rgba(0,0,0,0.12)", margin: "0 4px" }} />
      <BlockButton format="left" icon={<FormatAlignLeftIcon />} />
      <BlockButton format="center" icon={<FormatAlignCenterIcon />} />
      <BlockButton format="right" icon={<FormatAlignRightIcon />} />
      <BlockButton format="justify" icon={<FormatAlignJustifyIcon />} />
      <div style={{ width: "1px", height: "24px", backgroundColor: "rgba(0,0,0,0.12)", margin: "0 4px" }} />
      <InsertImageButton />
    </Paper>,
    document.body
  );
};
