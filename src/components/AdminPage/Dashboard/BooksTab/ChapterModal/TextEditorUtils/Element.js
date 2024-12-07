import { Image } from "./ImageRender";

export const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align || "left" };
  switch (element.type) {
    case "image":
      return (
        <div {...attributes} style={{ display: "inline-block" }}>
          <Image {...props} />
          {children}
        </div>
      );
    case "paragraph":
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
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
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
