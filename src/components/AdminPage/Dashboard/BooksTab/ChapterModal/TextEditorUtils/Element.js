import { Box } from "@mui/material";
import { Image } from "./ImageRender";

export const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align || "left" };

  switch (element.type) {
    case "image":
      return (
        <Box
          {...attributes}
          contentEditable={false}
          sx={{
            margin: "16px 0",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box contentEditable={false}>
            <Image {...props} />
          </Box>
          {children}
        </Box>
      );
    case "paragraph":
      return (
        <p
          style={{
            ...style,
            margin: "8px 0",
            lineHeight: "1.6",
          }}
          {...attributes}
        >
          {children}
        </p>
      );
    case "quote":
      return (
        <blockquote
          style={{
            ...style,
            borderLeft: "3px solid #ddd",
            margin: "16px 0",
            padding: "0 0 0 16px",
            color: "#666",
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    default:
      return (
        <div style={style} {...attributes}>
          {children}
        </div>
      );
  }
};

export const Leaf = ({ attributes, children, leaf }) => {
  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  return <span {...attributes}>{styledChildren}</span>;
};
