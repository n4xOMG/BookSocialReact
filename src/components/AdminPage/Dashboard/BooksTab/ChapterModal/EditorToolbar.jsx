import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Paper } from "@mui/material";

import { BlockButton } from "./TextEditorUtils/BlockButton";
import { InsertImageButton } from "./TextEditorUtils/InsertImageHandler";
import { MarkButton } from "./TextEditorUtils/MarkButton";

/**
 * Toolbar component for the collaborative editor
 */
export const EditorToolbar = () => {
  return (
    <Paper elevation={1} sx={{ mb: 2, p: 0.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      <MarkButton format="bold" icon={<FormatBoldIcon />} />
      <MarkButton format="italic" icon={<FormatItalicIcon />} />
      <MarkButton format="underline" icon={<FormatUnderlinedIcon />} />
      <BlockButton format="left" icon={<FormatAlignLeftIcon />} />
      <BlockButton format="center" icon={<FormatAlignCenterIcon />} />
      <BlockButton format="right" icon={<FormatAlignRightIcon />} />
      <BlockButton format="justify" icon={<FormatAlignJustifyIcon />} />
      <InsertImageButton />
    </Paper>
  );
};
