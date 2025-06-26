import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import RequiredStar from "./RequiredStar";
import { useApplicants, type Job } from "~/hooks/ApplicantsContext";

export interface AddApplicantModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (form: {
    firstName: string;
    lastName: string;
    status: string;
    email: string;
    jobId: number;
    description: string;
    appliedDate: string;
    linkedInProfile: string;
    address: string;
    phoneNumber: string;
    id?: string;
  }) => void;
  applicant?: any | null;
}

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  jobId: 0,
  description: "",
  address: "",
  phoneNumber: ""
};

export default function AddApplicantModal({ open, onClose, onAdd, applicant }: AddApplicantModalProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const {jobOptions} = useApplicants()
  useEffect(() => {
    if (applicant) {
      setForm({ ...initialForm, ...applicant });
    } else {
      setForm(initialForm);
    }
  }, [applicant, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleAddOrUpdate = () => {
    // Validate required fields
    const requiredFields = [
      "firstName", "lastName", "email", "jobId", "address", "phoneNumber"
    ];
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;
    requiredFields.forEach((field) => {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = true;
        hasError = true;
      }
    });
    setErrors(newErrors);
    if (hasError) return;
    onAdd(applicant && applicant.id ? { ...form, id: applicant.id } : form);
    setForm(initialForm);
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const isEditMode = !!(applicant && applicant.id);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false} PaperProps={{ sx: { width: '60%' } }}>
      <DialogTitle>{isEditMode ? "Edit applicant" : "Add new applicant"}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>First Name<RequiredStar /></Typography>
          <TextField name="firstName" value={form.firstName} onChange={handleChange} fullWidth size="small" required error={!!errors.firstName} helperText={errors.firstName ? 'Required' : ''} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Last Name<RequiredStar /></Typography>
          <TextField name="lastName" value={form.lastName} onChange={handleChange} fullWidth size="small" required error={!!errors.lastName} helperText={errors.lastName ? 'Required' : ''} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Email<RequiredStar /></Typography>
          <TextField name="email" value={form.email} onChange={handleChange} fullWidth size="small" required error={!!errors.email} helperText={errors.email ? 'Required' : ''} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Job<RequiredStar /></Typography>
          <TextField
            select
            name="jobId"
            value={form.jobId}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.jobId}
            helperText={errors.jobId ? 'Required' : ''}
          >
            {jobOptions.map((option:Job) => (
              <MenuItem key={option.id} value={option.id}>{option.companyName}-{option.position}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Address<RequiredStar /></Typography>
          <TextField name="address" value={form.address} onChange={handleChange} fullWidth size="small" required error={!!errors.address} helperText={errors.address ? 'Required' : ''} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Phone Number<RequiredStar /></Typography>
          <TextField name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth size="small" required error={!!errors.phoneNumber} helperText={errors.phoneNumber ? 'Required' : ''} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Description</Typography>
          <TextField name="description" value={form.description} onChange={handleChange} fullWidth size="small" multiline minRows={3} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddOrUpdate} variant="contained">{isEditMode ? "Save" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}
