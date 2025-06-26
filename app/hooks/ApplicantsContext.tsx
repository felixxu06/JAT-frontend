import React, { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import { api } from "./api";

export interface Job {
  id: number;
  companyName: string;
  position: string;
  status?: string;
}

export interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  status: number;
  email: string;
  jobId: string;
  description: string;
  appliedDate: string;
}

interface ApplicantsContextType {
  applicants: Applicant[];
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  totalPages: number;
  addApplicant: (applicant: Omit<Applicant, 'id'>) => Promise<void>;
  updateApplicant: (applicant: Applicant) => Promise<void>;
  jobOptions: Job[];
}

const ApplicantsContext = createContext<ApplicantsContextType | undefined>(undefined);

const initialApplicants: Applicant[] = [];

export function ApplicantsProvider({ children }: PropsWithChildren) {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [jobOptions, setJobOptions] = useState<Job[]>([]);

  // Add applicant and send to backend
  const addApplicant = async (applicant: Omit<Applicant, 'id'>) => {
    try {
      await api.post('/Applicant', applicant);
      loadData();
    } catch (e) {
      console.error("Failed to add applicant:", e);
    }
  };

  useEffect(() => {
      api.get(`/job/page/${1}/size/${100000}`).then((res) => {
        setJobOptions(res.data.data);
      })
    }, []);

  // Update applicant and send to backend
  const updateApplicant = async (applicant: Applicant) => {
    try {
      await api.put(`/applicant/${applicant.id}`, applicant);
      loadData();
    } catch (e) {
      console.error("Failed to update applicant:", e);
    }
  };

  const loadData = async () => {
    try {
      const res = await api.get(`/applicant/page/${page + 1}/size/${rowsPerPage}`); // backend is 1-based
      setApplicants(res.data.data);
      setTotalCount(res.data.pagination?.totalCount || 0);
      setTotalPages(res.data.pagination?.totalPages || 0);
    } catch (e) {
      console.error("Failed to load applicants:", e);
      setApplicants([]);
      setTotalCount(0);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage]);

  return (
    <ApplicantsContext.Provider value={{ applicants, jobOptions, setApplicants, page, setPage, rowsPerPage, setRowsPerPage, totalCount, totalPages, addApplicant, updateApplicant }}>
      {children}
    </ApplicantsContext.Provider>
  );
}

export function useApplicants() {
  const context = useContext(ApplicantsContext);
  if (!context) {
    throw new Error("useApplicants must be used within an ApplicantsProvider");
  }
  return context;
}

export const applicantStatusMap: Record<number, string> = {
  0: "Applied",
  1: "Interview",
  2: "Offered",
  3: "Hired",
  4: "Rejected",
};
