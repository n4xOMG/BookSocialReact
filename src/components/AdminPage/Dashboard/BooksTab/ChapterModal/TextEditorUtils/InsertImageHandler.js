import { Button } from "@mui/material";
import isUrl from "is-url";
import ImageIcon from "@mui/icons-material/Image";
import imageExtensions from "image-extensions";
import { Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import UploadToCloudinary from "../../../../../../utils/uploadToCloudinary";

export const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <div>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        multiple
        onChange={async (event) => {
          event.preventDefault();
          const files = event.target.files;
          if (files) {
            for (const file of files) {
              const url = await UploadToCloudinary(file, "novel_images");
              if (url && !isImageUrl(url)) {
                alert("URL is not an image");
                return;
              }
              url && insertImage(editor, url);
            }
          }
        }}
      />
      <Button
        onMouseDown={(event) => {
          event.preventDefault();
          document.getElementById("fileInput").click();
        }}
      >
        <ImageIcon>image</ImageIcon>
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
  const image = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};
