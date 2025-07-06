// src/pages/JobForm.tsx

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ResumeUploader from "../components/ResumeUploader";
import { toast } from "sonner";

const JobForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [resumeUrl, setResumeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleLinkedInScrape = async () => {
    if (!linkedinUrl.includes("linkedin.com/jobs")) {
      toast.error("Please enter a valid LinkedIn job URL.");
      return;
    }

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(linkedinUrl)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      const html = data.contents;

      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      const companyMatch = html.match(/"companyName":"(.*?)"/);

      const jobTitle = titleMatch ? titleMatch[1] : "";
      const companyName = companyMatch ? companyMatch[1] : "";

      if (jobTitle) setPosition(jobTitle);
      if (companyName) setCompany(companyName);

      if (jobTitle || companyName) {
        toast.success("Job info loaded from LinkedIn!");
      } else {
        toast.warning("Couldn't auto-fill. Please enter manually.");
      }
    } catch (err) {
      console.error("Scraping failed:", err);
      toast.error("Failed to scrape LinkedIn job.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "jobs"), {
        userId: user.uid,
        company,
        position,
        status,
        resumeUrl,
        createdAt: Date.now(),
        linkedinUrl,
      });

      toast.success("Job saved!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving job:", err);
      toast.error("Failed to save job.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">LinkedIn Job URL (optional)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="url"
              placeholder="https://www.linkedin.com/jobs/view/..."
              className="w-full border px-3 py-2 rounded"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
              onClick={handleLinkedInScrape}
            >
              Auto-fill
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Company"
          className="w-full border px-3 py-2 rounded"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Position"
          className="w-full border px-3 py-2 rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <select
          className="w-full border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <ResumeUploader
          onUploadSuccess={(url) => {
            setResumeUrl(url);
            toast.success("Resume uploaded!");
          }}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Save Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;
