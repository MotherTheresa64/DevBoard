// src/components/ResumeUploader.tsx
import { useState } from "react";
import { uploadResume } from "../utils/uploadResume";

interface Props {
  onUploadSuccess: (url: string) => void;
}

const ResumeUploader = ({ onUploadSuccess }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await uploadResume(file);
      onUploadSuccess(url);
    } catch (err) {
  console.error("Resume upload error:", err); // Log the error
  setError("Upload failed");
} finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ResumeUploader;
