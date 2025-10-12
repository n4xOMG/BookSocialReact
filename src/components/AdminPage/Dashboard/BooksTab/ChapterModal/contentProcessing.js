import { convertHtmlToSlateJson, EMPTY_CONTENT, isValidSlateContent, normalizeSlateContent } from "../../../../../utils/JsonContentUtils";

/**
 * Safely normalize Slate content with fallback for malformed data
 * @param {Array} content - Content to normalize
 * @returns {Array} - Normalized Slate content
 */
const safeNormalizeContent = (content) => {
  try {
    const normalized = normalizeSlateContent(content);

    if (Array.isArray(normalized) && normalized.length > 0) {
      return normalized;
    }
  } catch (error) {
    console.warn("Error normalizing content:", error);
  }

  if (Array.isArray(content) && content.length > 0) {
    const salvaged = content.map((node) => {
      if (!node || typeof node !== "object") {
        return { type: "paragraph", children: [{ text: "" }] };
      }

      if (!node.type) {
        node.type = "paragraph";
      }

      if (!Array.isArray(node.children)) {
        if (typeof node.text === "string") {
          node.children = [{ text: node.text }];
          delete node.text;
        } else {
          node.children = [{ text: "" }];
        }
      }

      node.children = node.children.map((child) => {
        if (!child || typeof child !== "object") {
          return { text: "" };
        }
        if (!("type" in child) && !("text" in child)) {
          child.text = "";
        }

        return child;
      });

      // Ensure at least one child
      if (node.children.length === 0) {
        node.children = [{ text: "" }];
      }

      return node;
    });

    return salvaged;
  }

  return EMPTY_CONTENT;
};

/**
 * Process chapter content to convert it to the appropriate format for editing
 * @param {Object} chapter - Chapter object with content
 * @returns {Array} - Processed Slate content
 */
export const processChapterContent = (chapter) => {
  if (!chapter?.content) {
    return EMPTY_CONTENT;
  }

  if (Array.isArray(chapter.content)) {
    if (isValidSlateContent(chapter.content)) {
      return normalizeSlateContent(chapter.content);
    }

    const safeContent = safeNormalizeContent(chapter.content);
    if (safeContent !== EMPTY_CONTENT) {
      return safeContent;
    }

    return EMPTY_CONTENT;
  }

  // Content is a string - could be JSON or HTML
  if (typeof chapter.content === "string") {
    try {
      const jsonContent = JSON.parse(chapter.content);

      if (Array.isArray(jsonContent)) {
        if (isValidSlateContent(jsonContent)) {
          return normalizeSlateContent(jsonContent);
        }

        const safeContent = safeNormalizeContent(jsonContent);
        if (safeContent !== EMPTY_CONTENT) {
          return safeContent;
        }
      }

      throw new Error("Invalid JSON content structure");
    } catch (e) {
      // Not JSON or invalid JSON, convert from HTML
      return convertHtmlToSlateJson(chapter.content);
    }
  }

  return EMPTY_CONTENT;
};
/**
 * Prepare content for saving (convert to JSON string)
 * @param {Array} content - Slate content array
 * @returns {string} - JSON string content
 */
export const prepareContentForSaving = (content) => {
  return JSON.stringify(content);
};
