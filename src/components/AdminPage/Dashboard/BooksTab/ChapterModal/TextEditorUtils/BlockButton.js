import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";
import { TEXT_ALIGN_TYPES } from "./ToolbarFunctions";
import { Button } from "@mui/material";
import clsx from "clsx";
import { css } from "@emotion/react";

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    })
  );

  return !!match;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type");

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  } else if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: (n) => n.type === format,
      split: true,
    });
  }
};

export const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type");

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
        toggleBlock(editor, format);
      }}
      title={`Align ${format}`}
    >
      {icon}
    </Button>
  );
};
