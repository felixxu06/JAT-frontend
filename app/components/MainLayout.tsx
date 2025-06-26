import React from "react";
import { Box, AppBar, Toolbar, Button, Avatar, Tooltip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../hooks/UserContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const initials = user ? `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase() : "G";

  return (
    <Box minHeight="100vh" sx={{ background: (theme) => theme.palette.background.default }}>
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 8 }}>
        <Toolbar sx={{ pl: { xs: 2, sm: 6 }, pr: { xs: 2, sm: 6 } }}>
          <Box sx={{ display: "flex", gap: 4, flexGrow: 1 }}>
            <Button component={RouterLink} to="/" color="primary" sx={{ fontWeight: 700, fontSize: 18 }}>
              Home
            </Button>
            <Button component={RouterLink} to="/applicants" color="primary" sx={{ fontWeight: 700, fontSize: 18 }}>
              Applicants
            </Button>
            <Button component={RouterLink} to="/jobs" color="primary" sx={{ fontWeight: 700, fontSize: 18 }}>
              Jobs
            </Button>
          </Box>
          <Tooltip title={fullName} arrow>
            <Avatar sx={{ bgcolor: "primary.main", cursor: "pointer" }}>{initials}</Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box flex={1} display="flex" flexDirection="column" alignItems="center">
        <Box width="100%" maxWidth="80vw">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
