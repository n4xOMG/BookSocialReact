import { API_BASE_URL } from "../api/api";
export const generateUniqueUploadId = () => {
  return `uqid-${Date.now()}`;
};
export async function UploadToServer(file, username, folderName) {
  const formData = new FormData();
  formData.append("file", file); // must be "file"
  formData.append("username", username);
  formData.append("folderName", folderName);

  const response = await fetch(`${API_BASE_URL}/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.text();
}
