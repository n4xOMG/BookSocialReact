const generateUniqueUploadId = () => {
  return `uqid-${Date.now()}`;
};

export const UploadToCloudinary = async (file, folder) => {
  if (!file) {
    console.error("Please select a file.");
    return;
  }

  const uniqueUploadId = generateUniqueUploadId();
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;

  const uploadChunk = async (start, end) => {
    const formData = new FormData();
    formData.append("file", file.slice(start, end));
    formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    formData.append("folder", folder);

    const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "X-Unique-Upload-Id": uniqueUploadId,
          "Content-Range": contentRange,
        },
      });

      if (!response.ok) {
        throw new Error("Chunk upload failed.");
      }

      currentChunk++;

      if (currentChunk < totalChunks) {
        const nextStart = currentChunk * chunkSize;
        const nextEnd = Math.min(nextStart + chunkSize, file.size);
        return uploadChunk(nextStart, nextEnd); // Continue uploading the next chunk
      } else {
        // After all chunks are uploaded, return the full response JSON
        const fetchResponse = await response.json();
        return fetchResponse.secure_url; // Only return the secure_url
      }
    } catch (error) {
      console.error("Error uploading chunk:", error);
      throw error;
    }
  };

  // Start uploading the first chunk
  const start = 0;
  const end = Math.min(chunkSize, file.size);

  // Return the promise of the secure URL
  return uploadChunk(start, end);
};

export default UploadToCloudinary;
