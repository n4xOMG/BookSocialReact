import { ClientSideSuspense, LiveblocksProvider, RoomProvider, useOthers, useRoom, useUpdateMyPresence } from "@liveblocks/react";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Box, Button, Toolbar } from "@mui/material";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import isHotkey from "is-hotkey";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createEditor, Editor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { BlockButton } from "./TextEditorUtils/BlockButton";
import { Element, Leaf } from "./TextEditorUtils/Element";
import { InsertImageButton } from "./TextEditorUtils/InsertImageHandler";
import { MarkButton, toggleMark } from "./TextEditorUtils/MarkButton";
import { HOTKEYS } from "./TextEditorUtils/ToolbarFunctions";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Cursors } from "./Cursors";
import { editChapterAction, getChapterByRoomId } from "../../../../../redux/chapter/chapter.action";
import { deserializeContent, serializeContent } from "../../../../../utils/HtmlSerialize";
export const CollaborativeEditorWrapper = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getChapterByRoomId(roomId));
  }, [roomId]);
  if (!roomId) {
    return <div>Room ID is missing!</div>;
  }

  return (
    <LiveblocksProvider publicApiKey={process.env.REACT_APP_LIVEBLOCK_PUBLIC_KEY}>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <CollaborativeEditor />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export const CollaborativeEditor = () => {
  const room = useRoom();
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState(null);
  const [provider, setProvider] = useState(null);
  const { chapter } = useSelector((store) => store.chapter);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (chapter && chapter.content) {
      // Initialize the Yjs document and provider
      const yDoc = new Y.Doc();
      const document = new DOMParser().parseFromString(chapter?.content, "text/html");
      const deserialized = deserializeContent(document.body) || [{ text: "" }];
      setContent(deserialized);
      Y.applyUpdate(yDoc, Y.encodeStateAsUpdate(yDoc));
      const yProvider = new LiveblocksYjsProvider(room, yDoc);
      const sharedDoc = yDoc.get("slate", Y.XmlText);

      // Sync connection status
      yProvider.on("sync", setConnected);

      // Set up shared type and provider
      setSharedType(sharedDoc);
      setProvider(yProvider);

      // Cleanup function
      return () => {
        yProvider.off("sync", setConnected); // Remove sync listener
        yProvider.destroy(); // Destroy provider
        yDoc.destroy(); // Destroy Yjs document
      };
    }
  }, [room]);

  if (!connected || !sharedType || !provider) {
    return <div>Loading…</div>;
  }
  const handleSaveDraft = () => {
    if (content && provider) {
      const serializedContent = serializeContent(content);
      dispatch(editChapterAction(chapter.bookId, { ...chapter, content: serializedContent, isDraft: true }));
    }
  };

  const handlePublish = () => {
    if (content && provider) {
      const serializedContent = serializeContent(content);
      dispatch(editChapterAction(chapter.bookId, { ...chapter, content: serializedContent, isDraft: false }));
    }
  };
  return (
    <Box>
      <Headbar onSaveDraft={handleSaveDraft} onPublish={handlePublish} />
      <SlateEditor sharedType={sharedType} provider={provider} initialContent={content} />;
    </Box>
  );
};
const Headbar = ({ onSaveDraft, onPublish }) => (
  <Toolbar>
    <Button variant="contained" onClick={onSaveDraft}>
      Save Draft
    </Button>
    <Button variant="contained" color="primary" onClick={onPublish}>
      Publish
    </Button>
  </Toolbar>
);
const emptyNode = {
  children: [{ text: "" }],
};
function SlateEditor({ sharedType, provider, initialContent }) {
  const editor = useMemo(() => {
    // Create the editor with React and Yjs plugins
    const e = withReact(withCursors(withYjs(createEditor(), sharedType), provider.awareness));

    // Ensure the editor always has at least one valid child
    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(e, emptyNode, { at: [0] });
    };

    return e;
  }, [sharedType]);

  useEffect(() => {
    // Connect to Yjs editor
    YjsEditor.connect(editor);
    return () => {
      // Disconnect when the component unmounts
      YjsEditor.disconnect(editor);
    };
  }, [editor]);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "12px",
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        color: "#111827",
      }}
    >
      <Box
        sx={{
          position: "relative",
          padding: "1em",
          height: "100%",
        }}
      >
        <Slate editor={editor} initialValue={initialContent ? initialContent : [emptyNode]}>
          <Cursors>
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
          </Cursors>
        </Slate>
      </Box>
    </Box>
  );
}
