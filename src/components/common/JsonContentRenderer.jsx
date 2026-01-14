import React from "react";
import { Box, Typography } from "@mui/material";
import { Element, Text } from "slate";

/**
 * JSON Content Renderer for reading mode
 * Renders Slate JSON content as static HTML for reading
 */

const JsonContentRenderer = ({ content, themeMode = "light" }) => {
  if (!Array.isArray(content) || content.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No content available
      </Typography>
    );
  }

  const renderNode = (node, index) => {
    if (Text.isText(node)) {
      return renderTextNode(node, index);
    }

    if (Element.isElement(node)) {
      return renderElementNode(node, index, themeMode, renderNode);
    }

    return null;
  };

  return (
    <Box
      sx={{
        color: themeMode === "light" ? "#242424" : "white",
        "& p": {
          marginBottom: "1em",
        },
        "& strong": {
          fontWeight: "bold",
        },
        "& em": {
          fontStyle: "italic",
        },
        "& u": {
          textDecoration: "underline",
        },
        "& img": {
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0 auto",
        },
        "& blockquote": {
          borderLeft: "4px solid #ccc",
          paddingLeft: "1em",
          color: "#666",
          fontStyle: "italic",
          margin: "1em 0",
        },
      }}
    >
      {content.map((node, index) => renderNode(node, index))}
    </Box>
  );
};

const renderTextNode = (node, index) => {
  const text = node.text || "\u00A0";

  const parts = text.split(/(\s+)/);

  const content = parts.map((part, i) => {
    if (part === "") return null;

    return (
      <span
        key={`${index}-${i}`}
        style={{
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {part}
      </span>
    );
  });

  let element = <span>{content}</span>;

  if (node.bold) element = <strong>{element}</strong>;
  if (node.italic) element = <em>{element}</em>;
  if (node.underline) element = <u>{element}</u>;

  return <React.Fragment key={index}>{element}</React.Fragment>;
};


const renderElementNode = (node, index, themeMode, renderNode) => {
  const children = node.children || [];
  const style = {
    textAlign: node.align || "left",
    margin: "8px 0",
    lineHeight: "1.6",
  };

  switch (node.type) {
    case "paragraph":
      return (
        <p key={index} style={style}>
          {children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}
        </p>
      );

    case "quote":
      return (
        <blockquote
          key={index}
          style={{
            ...style,
            borderLeft: "3px solid #ddd",
            margin: "16px 0",
            padding: "0 0 0 16px",
            color: themeMode === "light" ? "#666" : "#aaa",
          }}
        >
          {children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}
        </blockquote>
      );

    case "image":
      return (
        <Box
          key={index}
          sx={{
            margin: "16px 0",
            textAlign: "center",
            position: "relative",
          }}
        >
          {node.url ? (
            <img
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              src={node.url}
              alt={node.alt || "Image"}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                userSelect: "none",
                pointerEvents: "none",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <Box
            sx={{
              display: "none",
              color: "error.main",
              p: 2,
              border: "1px dashed",
              borderColor: "error.main",
              borderRadius: "4px",
              bgcolor: "error.light",
              opacity: 0.1,
            }}
          >
            Failed to load image
          </Box>
        </Box>
      );

    case "heading":
      const HeadingComponent = node.level ? `h${Math.min(node.level, 6)}` : "h2";
      return React.createElement(
        HeadingComponent,
        {
          key: index,
          style: {
            ...style,
            marginTop: "1.5em",
            marginBottom: "0.5em",
            fontWeight: "bold",
          },
        },
        children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))
      );

    case "list":
      const ListComponent = node.ordered ? "ol" : "ul";
      return React.createElement(
        ListComponent,
        {
          key: index,
          style: {
            ...style,
            paddingLeft: "1.5em",
          },
        },
        children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))
      );

    case "list-item":
      return (
        <li key={index} style={{ margin: "4px 0" }}>
          {children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}
        </li>
      );

    case "link":
      return (
        <a
          key={index}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1e90ff",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.target.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.target.style.textDecoration = "none";
          }}
        >
          {children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}
        </a>
      );

    case "code":
      return (
        <code
          key={index}
          style={{
            backgroundColor: themeMode === "light" ? "#f4f4f4" : "#2d2d2d",
            padding: "2px 4px",
            borderRadius: "3px",
            fontFamily: "monospace",
            fontSize: "0.9em",
          }}
        >
          {children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}
        </code>
      );

    case "code-block":
      return (
        <pre
          key={index}
          style={{
            backgroundColor: themeMode === "light" ? "#f4f4f4" : "#2d2d2d",
            padding: "1em",
            borderRadius: "4px",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "0.9em",
            margin: "1em 0",
          }}
        >
          <code>{children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}</code>
        </pre>
      );

    default:
      // Fallback to paragraph for unknown types
      return (
        <div key={index} style={style}>
          {children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`))}
        </div>
      );
  }
};

export default JsonContentRenderer;
