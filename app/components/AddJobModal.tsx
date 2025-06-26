import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import RequiredStar from "./RequiredStar";
import { jobStatusMap } from "../hooks/JobsContext";

export interface AddJobModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (form: {
    companyName: string;
    position: string;
    status: string;
    id?: string;
  }) => void;
  job?: {
    id: string;
    companyName: string;
    position: string;
    status: string;
  } | null;
}

const initialForm = {
  companyName: "",
  position: "",
};

export default function AddJobModal({ open, onClose, onAdd, updateJob ,job }: AddJobModalProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (job) {
      setForm({
        companyName: job.companyName,
        position: job.position,
        status: job.status
      });
    } else {
      setForm(initialForm);
    }
  }, [job, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: number|string = e.target.value;
    if (e.target.name === "status") {
      value = parseInt(e.target.value);
    }
    setForm({ ...form, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = () => {
    const requiredFields = ["companyName", "position"];
    if (job && job.id) requiredFields.push("status");
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;
    requiredFields.forEach((field) => {
      const value = form[field as keyof typeof form];

      if (value === "" || value === undefined || value === null) {
        newErrors[field] = true;
        hasError = true;
      }
      if ((field === "companyName" || field === "position") && form[field as keyof typeof form].length > 100) {
        newErrors[field] = true;
        hasError = true;
      }
    });
    setErrors(newErrors);
    if (hasError) return;
    if (job && job.id) {
      //onAdd({ ...form, id: job.id });
      updateJob({ ...form, id: job.id });
    } else {
      const {id, ...jobData} = form; // Exclude id if not in edit mode
      onAdd(jobData);
    }
    handleClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const isEditMode = job && job.id;
  console.log("isEditMode", isEditMode);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false} PaperProps={{ sx: { width: '60%' } }}>
      <DialogTitle>{isEditMode ? "Edit job" : "Add new job"}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Company Name<RequiredStar /></Typography>
          <TextField name="companyName" value={form.companyName} onChange={handleChange} fullWidth size="small" required error={!!errors.companyName} helperText={errors.companyName ? 'Required, max 100 chars' : ''} inputProps={{ maxLength: 100 }} />
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography minWidth={160} component="span" noWrap>Position<RequiredStar /></Typography>
          <TextField name="position" value={form.position} onChange={handleChange} fullWidth size="small" required error={!!errors.position} helperText={errors.position ? 'Required, max 100 chars' : ''} inputProps={{ maxLength: 100 }} />
        </Box>
        {isEditMode && (
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Typography minWidth={160} component="span" noWrap>Status<RequiredStar /></Typography>
            <TextField
              select
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.status}
              helperText={errors.status ? 'Required' : ''}
            >
              {Object.entries(jobStatusMap).map(([num, label]) => (
                <MenuItem key={num} value={num}>{label}</MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{"Save"}</Button> 
      </DialogActions>
    </Dialog>
  );
}
