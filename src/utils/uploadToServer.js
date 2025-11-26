import { api, authApi } from "../api/api";
import { createLogger } from "./logger";

export const generateUniqueUploadId = () => {
  return `uqid-${Date.now()}`;
};
const logger = createLogger("ImageServer");

export async function UploadToServer(file, username, folderName, { useAuth = true } = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("username", username);
  formData.append("folderName", folderName);

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
    const imagePath = payload?.data.url;
    if (!imagePath) {
      logger.warn("Upload succeeded but no image path was returned", payload);
      throw new Error("Upload succeeded but no image path was returned.");
    }

    logger.debug("Upload succeeded", { imagePath });
    return imagePath;
  } catch (error) {
    const message = error?.response?.data?.message || error.message || "Failed to upload image.";
    logger.error("Upload failed", { message, status: error?.response?.status });
    throw new Error(message);
  }
}
