// src/utils/uploadResume.ts
export async function uploadResume(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://uploadthing.com/api/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_UPLOADTHING_API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data?.data?.url;
}
