// src/App.js
import React from "react";
import D2dStudentList from "./components/D2dStudentList";
import axios from "axios";
import { Box } from "@mui/material";

function App() {
  axios.defaults.baseURL = "http://localhost:6969";

  return (
    <Box className="">
      <D2dStudentList />
    </Box>
  );
}

export default App;
