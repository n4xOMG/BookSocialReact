import { api, authApi } from "../api/api";
import { createLogger } from "./logger";

export const generateUniqueUploadId = () => {
  return `uqid-${Date.now()}`;
};
const logger = createLogger("ImageServer");

/**
 * Sanitizes folder name to remove/replace characters that cause URL issues
 * (e.g., semicolons, commas in book titles like "Frankenstein; Or, The Modern Prometheus")
 */
const sanitizeFolderName = (name) => {
  if (!name) return name;
  return name
    .replace(/[;,]/g, "") // Remove semicolons and commas
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[<>:"/\\|?*]/g, "") // Remove other problematic characters
    .replace(/_+/g, "_") // Collapse multiple underscores
    .trim();
};

export async function UploadToServer(file, username, folderName, { useAuth = true } = {}) {
  const sanitizedFolderName = sanitizeFolderName(folderName);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("username", username);
  formData.append("folderName", sanitizedFolderName);

  const client = useAuth ? api : authApi;

  try {
    const response = await client.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response?.data;
    const message = payload?.message || "Failed to upload image.";

    if (payload?.success === false) {
      logger.error("Upload failed", { message, status: response.status });
      throw new Error(message);
    }
    logger.debug("Payload: ", payload);
    const imagePath = payload?.data?.url;
    const safety = payload?.data?.safety;

    if (!imagePath) {
      logger.warn("Upload succeeded but no image path was returned", payload);
      throw new Error("Upload succeeded but no image path was returned.");
    }

    logger.debug("Upload succeeded", { imagePath, safety });
    return { url: imagePath, safety };
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Failed to upload image.";
    logger.error("Upload failed", { message, status: error?.response?.status });
    throw new Error(message);
  }
}
