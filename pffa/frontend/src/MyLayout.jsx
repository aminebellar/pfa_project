import * as React from "react";
import { Layout, AppBar } from "react-admin";
import { Typography } from "@mui/material";

const MyAppBar = () => (
  <AppBar>
    <Typography variant="h6" color="inherit" sx={{ flex: 1, fontWeight: "bold" }}>
      FlyHigh Admin
    </Typography>
  </AppBar>
);

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export default MyLayout;