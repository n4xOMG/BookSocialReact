import escapeHTML from "escape-html";
import { Text } from "slate";
import { jsx } from "slate-hyperscript";
export const serializeContent = (nodes) => {
  return nodes.map((node) => serialize(node)).join("");
};

export const deserializeContent = (el, markAttributes = {}) => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx("text", markAttributes, el.textContent);
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const nodeAttributes = { ...markAttributes };

  switch (el.nodeName) {
    case "STRONG":
      nodeAttributes.bold = true;
      break;
    case "EM":
      nodeAttributes.italic = true;
      break;
    case "U":
      nodeAttributes.underline = true;
      break;
    default:
      break;
  }

  const children = Array.from(el.childNodes)
    .map((node) => deserializeContent(node, nodeAttributes))
    .flat();

  if (children.length === 0) {
    children.push(jsx("text", nodeAttributes, ""));
  }

  switch (el.nodeName) {
    case "BODY":
      return jsx("fragment", {}, children);
    case "BR":
      return "\n";
    case "BLOCKQUOTE":
      return jsx("element", { type: "quote", align: getTextAlign(el) }, children);
    case "P":
      return jsx("element", { type: "paragraph", align: getTextAlign(el) }, children);
    case "A":
      return jsx("element", { type: "link", url: el.getAttribute("href") }, children);
    case "IMG":
      return jsx(
        "element",
        { type: "image", url: el.getAttribute("src"), alt: el.getAttribute("alt"), style: el.getAttribute("style") },
        children
      );
    default:
      return jsx("element", { type: "paragraph", align: getTextAlign(el) }, children);
  }
};
const getTextAlign = (el) => {
  const style = el.getAttribute("style");
  if (style) {
    const match = style.match(/text-align:\s*(left|center|right|justify)/i);
    if (match) {
      return match[1].toLowerCase();
    }
  }
  return "left"; // Default alignment
};
const serialize = (node) => {
  if (Text.isText(node)) {
    let string = escapeHTML(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    return string;
  }

  const children = node.children.map((n) => serialize(n)).join("");
  const alignmentStyle = node.align ? ` style="text-align: ${node.align};"` : "";
  switch (node.type) {
    case "quote":
      return `<blockquote${alignmentStyle}><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p${alignmentStyle}>${children}</p>`;
    case "link":
      return `<a href="${escapeHTML(node.url)}">${children}</a>`;
    case "image":
      return `<img src="${escapeHTML(node.url)}" alt="${escapeHTML(node.alt)}" style="width: 100%; height: 100%; object-fit: contain;" />`;
    default:
      return `<p${alignmentStyle}>${children}</p>`;
  }
};
