import React from "react";
import { Typography } from "@mui/material";
import { red } from "@mui/material/colors";

export default function RequiredStar() {
  return (
    <Typography component="span" color={red[500]} ml={0.5}>
      *
    </Typography>
  );
}
