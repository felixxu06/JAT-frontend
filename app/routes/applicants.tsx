import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import { ApplicantsProvider, applicantStatusMap, useApplicants } from "../hooks/ApplicantsContext";
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
import AddApplicantModal from "../components/AddApplicantModal";

function ApplicantsTable() {
  const { applicants, page, setPage, jobOptions, rowsPerPage, setRowsPerPage, totalCount, totalPages, addApplicant, updateApplicant } = useApplicants();
  const [open, setOpen] = useState(false);
  const [editApplicant, setEditApplicant] = useState(null);

  const handleOpen = () => {
    setEditApplicant(null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleAdd = async (form: any) => {
    await addApplicant(form);
    handleClose();
  };

  const handleEdit = (applicant: any) => {
    setEditApplicant(applicant);
    setOpen(true);
  };

  const handleUpdate = async (form: any) => {
    await updateApplicant(form);
    handleClose();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function CustomTablePaginationActions(props: any) {
    const { page, onPageChange } = props;
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

  const findJobName = (jobId: number) => {
    const job = jobOptions.find((job) => job.id === jobId);
    return job ? `${job.companyName} - ${job.position}` : "Unknown Job";
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add new Applicant
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Job</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{applicant.firstName}</TableCell>
                <TableCell>{applicant.lastName}</TableCell>
                <TableCell>{applicantStatusMap[applicant.status] ?? applicant.status}</TableCell>
                <TableCell>{applicant.email}</TableCell>
                <TableCell>{findJobName(applicant.jobId)}</TableCell>
                <TableCell>{applicant.description}</TableCell>
                <TableCell>{new Date(applicant.appliedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => handleEdit(applicant)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
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
      <AddApplicantModal open={open} onClose={handleClose} onAdd={editApplicant ? handleUpdate : handleAdd} applicant={editApplicant} />
    </>
  );
}

export default function Applicants() {
  return (
    <ApplicantsProvider>
      <MainLayout>
        <Box p={4}>
          <Typography variant="h4" fontWeight={700} mb={3}>
            All Applicants
          </Typography>
          <ApplicantsTable />
        </Box>
      </MainLayout>
    </ApplicantsProvider>
  );
}