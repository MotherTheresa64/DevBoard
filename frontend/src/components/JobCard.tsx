// src/components/JobCard.tsx

import { Link } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "sonner";

interface JobCardProps {
  job: {
    id: string;
    company: string;
    position: string;
    status: string;
    resumeUrl?: string;
  };
  onDelete: (id: string) => void;
}

const JobCard = ({ job, onDelete }: JobCardProps) => {
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "jobs", job.id));
      onDelete(job.id);
      toast.success("Job deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete job.");
    }
  };

  return (
    <div className="border rounded p-4 mb-4 shadow">
      <h3 className="text-lg font-semibold">{job.position}</h3>
      <p className="text-gray-700">Company: {job.company}</p>
      <p className="text-gray-600">Status: {job.status}</p>

      {job.resumeUrl && (
        <a
          href={job.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-sm block mt-1"
        >
          View Resume
        </a>
      )}

      <div className="flex gap-4 mt-3">
        <Link
          to={`/edit/${job.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
