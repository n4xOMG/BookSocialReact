import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Backdrop, Box, Button, Checkbox, CircularProgress, Dialog, FormControlLabel, TextField, Toolbar } from "@mui/material";
import DOMPurify from "dompurify";
import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { editChapterAction, getAllChaptersByBookIdAction } from "../../../../../redux/chapter/chapter.action";
import { deserializeContent, serializeContent } from "../../../../../utils/HtmlSerialize";
import { BlockButton } from "../ChapterModal/TextEditorUtils/BlockButton";
import { Element, Leaf } from "../ChapterModal/TextEditorUtils/Element";
import { InsertImageButton, withImages } from "../ChapterModal/TextEditorUtils/InsertImageHandler";
import { MarkButton, toggleMark } from "../ChapterModal/TextEditorUtils/MarkButton";
import { HOTKEYS } from "../ChapterModal/TextEditorUtils/ToolbarFunctions";
import { isTokenExpired } from "../../../../../utils/useAuthCheck";

export default function EditChapterModal({ open, onClose, bookId, chapterDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const jwt = isTokenExpired(localStorage.getItem("jwt")) ? null : localStorage.getItem("jwt");
  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);
  const [chapterData, setChapterData] = useState({
    chapterNum: "",
    title: "",
    price: 0,
    locked: false,
    content: "",
  });
  const [content, setContent] = useState("");
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChapterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  useEffect(() => {
    console.log("EditChapterModal Props:", { open, onClose, bookId, chapterDetails });
    const fetchChapterContent = async () => {
      setLoading(true);
      if (chapterDetails) {
        setChapterData({
          id: chapterDetails.id || "",
          chapterNum: chapterDetails.chapterNum || "",
          title: chapterDetails.title || "",
          price: chapterDetails.price || 0,
          locked: chapterDetails.locked || false,
        });
      }
      try {
        const html = chapterDetails.content;
        const document = new DOMParser().parseFromString(html, "text/html");
        setContent(deserializeContent(document.body));
      } catch (error) {
        console.error("Error fetching chapter content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chapterDetails.id) {
      fetchChapterContent();
    }
  }, [dispatch, chapterDetails.content, chapterDetails.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const serializedContent = serializeContent(content);
    chapterData.id = chapterDetails.id;
    chapterData.content = DOMPurify.sanitize(serializedContent);
    console.log("Form Data:", chapterData);
    try {
      await dispatch(editChapterAction(bookId, chapterData));
      await dispatch(getAllChaptersByBookIdAction(jwt, bookId));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate className="rounded-lg border-stone-950 px-3">
        <TextField
          margin="normal"
          required
          fullWidth
          id="chapterNum"
          label="Chapter number"
          name="chapterNum"
          onChange={handleChange}
          value={chapterData.chapterNum}
        />
        <TextField
          margin="normal"
          value={chapterData.title}
          required
          fullWidth
          id="title"
          label="Chapter title"
          name="title"
          defaultValue={chapterData.title}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Price"
          name="price"
          type="number"
          min={0}
          value={chapterData.price}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControlLabel
          control={<Checkbox checked={chapterData.locked} onChange={handleChange} name="locked" color="primary" />}
          label="Is Locked"
        />
        <input type="hidden" name="content" value={JSON.stringify(content)} />
        {content && (
          <Slate
            editor={editor}
            value={content}
            initialValue={content}
            onChange={(value) => {
              setContent(value);
              const isAstChange = editor.operations.some((op) => "set_selection" !== op.type);
              if (isAstChange) {
                const content = JSON.stringify(value);
                localStorage.setItem("content", content);
              }
            }}
          >
            <Toolbar>
              <MarkButton format={"bold"} icon={<FormatBoldIcon />} />
              <MarkButton format={"italic"} icon={<FormatItalicIcon />} />
              <MarkButton format={"underline"} icon={<FormatUnderlinedIcon />} />
              <BlockButton format={"left"} icon={<FormatAlignLeftIcon />} />
              <BlockButton format={"center"} icon={<FormatAlignCenterIcon />} />
              <BlockButton format={"right"} icon={<FormatAlignRightIcon />} />
              <BlockButton format={"justify"} icon={<FormatAlignJustifyIcon />} />
              <InsertImageButton />
            </Toolbar>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Enter some text..."
              onKeyDown={(event) => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    toggleMark(editor, mark);
                  }
                }
              }}
            />
          </Slate>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Upload
        </Button>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
