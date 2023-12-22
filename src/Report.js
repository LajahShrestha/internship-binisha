import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";

const Report = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the asynchronous HTTP request to the backend
        const response = await axios.get("http://localhost:5000/api/reports");
        const formattedData = response.data.map((row) => ({
          ...row,
          duedate: new Date(row.duedate),
        }));
        setData(formattedData);
      } catch (error) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page number when searching to start from the first page of results.
  };

  const filteredData = data.filter((row) => {
    const searchFields = [row.client];
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return searchFields.some((field) =>
      field.toLowerCase().includes(lowerCaseSearchQuery)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div
      style={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {error && (
        <Alert
          variant="filled"
          severity="error"
          sx={{ mt: 2, mb: 2, width: "35%" }}
        >
          Error fetching data
        </Alert>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 5,
          alignSelf: "start",
        }}
      >
        <InputLabel sx={{ mr: 3 }}>Search:</InputLabel>
        <TextField
          variant="outlined"
          value={searchQuery}
          hiddenLabel
          size="small"
          onChange={handleSearchChange}
          margin="normal"
          sx={{ maxWidth: "70%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#369d75",
              }}
            >
              <TableCell
                sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
              >
                Client
              </TableCell>
              <TableCell
                sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
              >
                Grand Total
              </TableCell>
              <TableCell
                sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
              >
                Paid Amount
              </TableCell>
              <TableCell
                sx={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}
              >
                Due Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={row.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
                  }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>Rs. {row.grandtotal}</TableCell>
                  <TableCell>Rs. {row.paidamount}</TableCell>
                  <TableCell>
                    {row.duedate.toISOString().slice(0, 10)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
      >
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
};

export default Report;
