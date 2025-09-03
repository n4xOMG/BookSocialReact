import { convertHtmlToSlateJson, EMPTY_CONTENT, isValidSlateContent, normalizeSlateContent } from "../../../../../utils/JsonContentUtils";

/**
 * Process chapter content to convert it to the appropriate format for editing
 * @param {Object} chapter - Chapter object with content
 * @returns {Array} - Processed Slate content
 */
export const processChapterContent = (chapter) => {
  if (!chapter?.content) {
    return EMPTY_CONTENT;
  }

  // Content is already JSON array
  if (Array.isArray(chapter.content)) {
    return isValidSlateContent(chapter.content) ? normalizeSlateContent(chapter.content) : EMPTY_CONTENT;
  }

  // Content is a string - could be JSON or HTML
  if (typeof chapter.content === "string") {
    try {
      // Try to parse as JSON first
      const jsonContent = JSON.parse(chapter.content);
      if (Array.isArray(jsonContent) && isValidSlateContent(jsonContent)) {
        return normalizeSlateContent(jsonContent);
      } else {
        throw new Error("Invalid JSON content structure");
      }
    } catch (e) {
      // Not JSON or invalid JSON, convert from HTML
      console.log("Converting HTML content to JSON for editing");
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
