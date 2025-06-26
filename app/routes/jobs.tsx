import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import AddJobModal from "../components/AddJobModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  TablePagination,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { JobsProvider, jobStatusMap, useJobs } from "../hooks/JobsContext";

interface Job {
  id: string;
  companyName: string;
  position: string;
  status: string;
  dateApplied: string;
}

function JobsTable() {
  const { jobs, page, setPage, rowsPerPage, setRowsPerPage, addJob, updateJob, totalCount, totalPages } = useJobs();
  const [open, setOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const handleOpen = () => {
    setEditJob(null);
    setOpen(true);
  };
  const handleEdit = (job: Job) => {
    setEditJob(job);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Custom TablePagination Actions to control next/prev button status
  function CustomTablePaginationActions(props: any) {
    const { count, page, rowsPerPage, onPageChange } = props;
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {'<'}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page + 1 >= totalPages}
          aria-label="next page"
        >
          {'>'}
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add new Job
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>{typeof job.status === "number" ? jobStatusMap[job.status] : job.status}</TableCell>
                <TableCell>{new Date(job.dateApplied).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => handleEdit(job)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          ActionsComponent={CustomTablePaginationActions}
        />
      </TableContainer>
      <AddJobModal open={open} onClose={handleClose} onAdd={addJob} job={editJob} updateJob={updateJob} />
    </>
  );
}

export default function Jobs() {
  return (
    <JobsProvider>
      <MainLayout>
        <Box p={4}>
          <Typography variant="h4" fontWeight={700} mb={3}>
            All Jobs
          </Typography>
          <JobsTable />
        </Box>
      </MainLayout>
    </JobsProvider>
  );
}