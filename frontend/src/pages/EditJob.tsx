import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const EditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      const jobRef = doc(db, "jobs", id);
      const docSnap = await getDoc(jobRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.userId !== user?.uid) {
          toast.error("Unauthorized access");
          navigate("/dashboard");
          return;
        }
        setCompany(data.company);
        setPosition(data.position);
        setStatus(data.status);
      } else {
        toast.error("Job not found");
        navigate("/dashboard");
      }
    };

    fetchJob();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateDoc(doc(db, "jobs", id), {
        company,
        position,
        status,
      });
      toast.success("Job updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update job.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditJob;
