import React, { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import { api } from "./api";

export interface Job {
  id?: string;
  companyName: string;
  position: string;
  status?: string;
  dateApplied?: string;
}

interface JobsContextType {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  addJob: (job: Omit<Job, 'id'>) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  totalCount: number;
  totalPages: number;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const initialJobs: Job[] = [];

export const jobStatusMap: Record<number, string> = {
  0: "Open",
  1: "Closed",
  2: "Interviewing",
  3: "Offered",
  4: "Rejected",
  5: "Filled",
};

export function JobsProvider({ children }: PropsWithChildren) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Add job and send to backend
  const addJob = async (job: Omit<Job, 'id'>) => {
    try {
      const res = await api.post('/job', job);
      loadData();
    } catch (e) {
      console.error("Failed to add job:", e);
    }
  };

  // Update job and send to backend
  const updateJob = async (job: Job) => {
    try {
      const res = await api.put(`/job/${job.id}`, job);
      setJobs(prev => prev.map(j => j.id === job.id ? { ...res.data } : j));
      loadData();
    } catch (e) {
      console.error("Failed to update job:", e);
    }
  };

  const loadData = async () => {
    try {
      const res = await api.get(`/job/page/${page+1}/size/${rowsPerPage}`);
      setJobs(res.data.data);
      setTotalCount(res.data.pagination?.totalCount || 0);
      setTotalPages(res.data.pagination?.totalPages || 0);
    } catch (e) {
      console.error("Failed to load jobs:", e);
      setJobs([]);
      setTotalCount(0);
      setTotalPages(0);
    }
  }
  useEffect(() => {
    loadData();
  }, [page, rowsPerPage]);

  return (
    <JobsContext.Provider value={{ jobs, setJobs, page, setPage, rowsPerPage, setRowsPerPage, addJob, updateJob, totalCount, totalPages }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
