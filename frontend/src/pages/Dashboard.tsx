// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";

interface Job {
  id: string;
  company: string;
  position: string;
  status: string;
  resumeUrl?: string;
  createdAt: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobList: Job[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user?.uid) {
          jobList.push({ id: doc.id, ...data } as Job);
        }
      });
      setJobs(jobList);
    };

    fetchJobs();
  }, [user]);

  const handleDelete = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  const filteredJobs = statusFilter === "all"
    ? jobs
    : jobs.filter((job) => job.status === statusFilter);

  const sortedJobs = [...filteredJobs].sort((a, b) =>
    sortOrder === "newest"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Job Applications</h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">
            Sort by Date:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="border px-3 py-2 rounded w-full"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {sortedJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default Dashboard;
