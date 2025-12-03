/**
 * Utilities for handling content conversion between HTML and Slate JSON format
 */

// Empty content structure for Slate editor
export const EMPTY_CONTENT = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

/**
 * Check if content is a valid Slate content structure
 * @param {any} content - Content to validate
 * @returns {boolean} - True if valid Slate content
 */
export const isValidSlateContent = (content) => {
  if (!Array.isArray(content)) return false;
  if (content.length === 0) return true; // Empty array is valid

  return content.every((node) => {
    // Every node should be an object
    if (!node || typeof node !== "object") {
      return false;
    }

    if (!node.type && !node.text) {
      return false;
    }

    // If it's a text node (has 'text' property), that's always valid
    if ("text" in node) {
      return typeof node.text === "string";
    }

    // If it's an element node, it should have children
    if ("type" in node) {
      if ("children" in node && !Array.isArray(node.children)) {
        return false;
      }

      if (Array.isArray(node.children)) {
        return node.children.every((child) => {
          if (!child || typeof child !== "object") {
            return false;
          }

          if ("text" in child) {
            return typeof child.text === "string";
          }

          if ("type" in child) {
            return typeof child.type === "string";
          }

          return false;
        });
      }

      return true;
    }

    return false;
  });
};

/**
 * Normalize Slate content to ensure it has proper structure
 * @param {Array} content - Slate content to normalize
 * @returns {Array} - Normalized Slate content
 */
export const normalizeSlateContent = (content) => {
  if (!Array.isArray(content) || content.length === 0) {
    return EMPTY_CONTENT;
  }

  const normalized = content.map((node) => {
    if (!node || typeof node !== "object") {
      return { type: "paragraph", children: [{ text: "" }] };
    }

    if ("text" in node) {
      return { type: "paragraph", children: [{ text: node.text || "" }] };
    }

    const normalizedNode = { ...node };

    if (!normalizedNode.type) {
      normalizedNode.type = "paragraph";
    }

    // Handle children
    if (!Array.isArray(normalizedNode.children)) {
      if (typeof normalizedNode.text === "string") {
        normalizedNode.children = [{ text: normalizedNode.text }];
        delete normalizedNode.text;
      } else {
        normalizedNode.children = [{ text: "" }];
      }
    } else {
      // Normalize existing children
      normalizedNode.children = normalizedNode.children.map((child) => {
        if (!child || typeof child !== "object") {
          return { text: "" };
        }

        // Text node
        if ("text" in child) {
          return { ...child, text: child.text || "" };
        }

        // Element node - recursively normalize
        if ("type" in child) {
          return normalizeSlateContent([child])[0];
        }

        return { text: child.text || "" };
      });

      normalizedNode.children = normalizedNode.children.filter(
        (child) =>
          child &&
          typeof child === "object" &&
          (("text" in child && typeof child.text === "string") || ("type" in child && typeof child.type === "string"))
      );
    }

    if (normalizedNode.children.length === 0) {
      normalizedNode.children = [{ text: "" }];
    }

    return normalizedNode;
  });

  const validNormalized = normalized.filter((node) => node && typeof node === "object" && node.type && Array.isArray(node.children));

  return validNormalized.length > 0 ? validNormalized : EMPTY_CONTENT;
};

/**
 * Convert HTML content to Slate JSON format
 * @param {string} htmlContent - HTML content to convert
 * @returns {Array} - Slate JSON content
 */
export const convertHtmlToSlateJson = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== "string") {
    return EMPTY_CONTENT;
  }

  try {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent.trim();

    const convertElement = (element) => {
      const tagName = element.tagName?.toLowerCase();
      const children = [];

      for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          if (text.trim()) {
            children.push({ text });
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          children.push(convertElement(child));
        }
      }

      if (children.length === 0) {
        children.push({ text: "" });
      }

      // Map HTML tags to Slate types
      switch (tagName) {
        case "p":
          return { type: "paragraph", children };
        case "h1":
          return { type: "heading-one", children };
        case "h2":
          return { type: "heading-two", children };
        case "h3":
          return { type: "heading-three", children };
        case "h4":
          return { type: "heading-four", children };
        case "h5":
          return { type: "heading-five", children };
        case "h6":
          return { type: "heading-six", children };
        case "blockquote":
          return { type: "block-quote", children };
        case "ul":
          return { type: "bulleted-list", children };
        case "ol":
          return { type: "numbered-list", children };
        case "li":
          return { type: "list-item", children };
        case "strong":
        case "b":
          return children.map((child) => ({ ...child, bold: true }));
        case "em":
        case "i":
          return children.map((child) => ({ ...child, italic: true }));
        case "u":
          return children.map((child) => ({ ...child, underline: true }));
        case "img":
          return {
            type: "image",
            url: element.getAttribute("src") || "",
            alt: element.getAttribute("alt") || "",
            children: [{ text: "" }],
          };
        case "br":
          return { text: "\n" };
        case "div":
        default:
          return { type: "paragraph", children };
      }
    };

    const result = [];

    // Process all child nodes of the temp div
    for (const child of tempDiv.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim() || "";
        if (text) {
          result.push({ type: "paragraph", children: [{ text }] });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const converted = convertElement(child);
        if (Array.isArray(converted)) {
          result.push(...converted);
        } else {
          result.push(converted);
        }
      }
    }

    return result.length > 0 ? normalizeSlateContent(result) : EMPTY_CONTENT;
  } catch (error) {
    console.error("Error converting HTML to Slate JSON:", error);
    return [{ type: "paragraph", children: [{ text: htmlContent }] }];
  }
};

/**
 * Convert Slate JSON content to HTML
 * @param {Array} slateContent - Slate content to convert
 * @returns {string} - HTML content
 */
export const convertSlateJsonToHtml = (slateContent) => {
  if (!Array.isArray(slateContent)) {
    return "";
  }

  const serializeNode = (node) => {
    if (!node) return "";

    if ("text" in node) {
      let text = node.text || "";

      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;

      return text;
    }

    if ("type" in node && "children" in node) {
      const children = node.children.map(serializeNode).join("");

      switch (node.type) {
        case "paragraph":
          return `<p>${children}</p>`;
        case "heading-one":
          return `<h1>${children}</h1>`;
        case "heading-two":
          return `<h2>${children}</h2>`;
        case "heading-three":
          return `<h3>${children}</h3>`;
        case "heading-four":
          return `<h4>${children}</h4>`;
        case "heading-five":
          return `<h5>${children}</h5>`;
        case "heading-six":
          return `<h6>${children}</h6>`;
        case "block-quote":
          return `<blockquote>${children}</blockquote>`;
        case "bulleted-list":
          return `<ul>${children}</ul>`;
        case "numbered-list":
          return `<ol>${children}</ol>`;
        case "list-item":
          return `<li>${children}</li>`;
        case "image":
          return `<img src="${node.url || ""}" alt="${node.alt || ""}" />`;
        default:
          return `<div>${children}</div>`;
      }
    }

    return "";
  };

  return slateContent.map(serializeNode).join("");
};

/**
 * Get plain text from Slate content
 * @param {Array} slateContent - Slate content
 * @returns {string} - Plain text
 */
export const getPlainTextFromSlate = (slateContent) => {
  if (!Array.isArray(slateContent)) {
    return "";
  }

  const extractText = (node) => {
    if (!node) return "";

    if ("text" in node) {
      return node.text || "";
    }

    if ("children" in node && Array.isArray(node.children)) {
      return node.children.map(extractText).join("");
    }

    return "";
  };

  return slateContent.map(extractText).join("\n").trim();
};
