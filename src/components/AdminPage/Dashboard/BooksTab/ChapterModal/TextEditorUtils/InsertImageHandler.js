import { Button, CircularProgress } from "@mui/material";
import isUrl from "is-url";
import ImageIcon from "@mui/icons-material/Image";
import imageExtensions from "image-extensions";
import { Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import UploadToCloudinary from "../../../../../../utils/uploadToCloudinary";
import { useState } from "react";

export const InsertImageButton = () => {
  const editor = useSlateStatic();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      for (const file of files) {
        const url = await UploadToCloudinary(file, "novel_images");
        if (url && !isImageUrl(url)) {
          alert("URL is not a valid image");
          continue;
        }
        if (url) {
          insertImage(editor, url);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = null;
    }
  };

  return (
    <div>
      <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isLoading}
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
          document.getElementById("fileInput").click();
        }}
        title="Insert Image"
      >
        {isLoading ? <CircularProgress size={20} /> : <ImageIcon />}
      </Button>
    </div>
  );
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

export const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = {
    type: "image",
    url,
    alt: "Inserted image",
    children: [text],
  };
  Transforms.insertNodes(editor, image);
  // Move cursor to next line after image
  Transforms.insertNodes(editor, {
    type: "paragraph",
    children: [{ text: "" }],
  });
};
