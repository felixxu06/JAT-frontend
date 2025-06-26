import React from "react";
import { Typography, Box } from "@mui/material";
import MainLayout from "../components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <Typography variant="h3" fontWeight={700} mb={6} color="text.primary">
          Welcome
        </Typography>
      </Box>
    </MainLayout>
  );
}
