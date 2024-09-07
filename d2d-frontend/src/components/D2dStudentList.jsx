import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import InputAdornment from "@mui/material/InputAdornment";
import { IconSearch } from "@tabler/icons-react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import { visuallyHidden } from "@mui/utils";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "applicationNo",
    numeric: false,
    disablePadding: false,
    label: "Application No",
  },
  {
    id: "candidateName",
    numeric: false,
    disablePadding: false,
    label: "Candidate Name",
  },
  { id: "rank", numeric: false, disablePadding: false, label: "Rank" },
  {
    id: "marksSecured",
    numeric: false,
    disablePadding: false,
    label: "Marks Secured",
  },
  { id: "seatNo", numeric: false, disablePadding: false, label: "Seat No" },
  { id: "userId", numeric: false, disablePadding: false, label: "User ID" },
  {
    id: "fathersName",
    numeric: false,
    disablePadding: false,
    label: "Father's Name",
  },
  { id: "programme", numeric: false, disablePadding: false, label: "Program" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const { handleSearch, search, searchBy, handleSearchByChange } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Box
        sx={{
          flex: "1 1 100%",
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Select
          value={searchBy}
          onChange={handleSearchByChange}
          size="small"
          displayEmpty
        >
          <MenuItem value="" disabled>
            Search By
          </MenuItem>
          <MenuItem value="candidateName">Candidate Name</MenuItem>
          <MenuItem value="applicationNo">Application No</MenuItem>
          <MenuItem value="rank">Rank</MenuItem>
          <MenuItem value="marksSecured">Marks Secured</MenuItem>
          <MenuItem value="seatNo">Seat No</MenuItem>
          <MenuItem value="userId">User ID</MenuItem>
          <MenuItem value="fathersName">Father's Name</MenuItem>
          <MenuItem value="programme">Program</MenuItem>
        </Select>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            ),
          }}
          placeholder="Search Students"
          size="small"
          onChange={handleSearch}
          value={search}
        />
      </Box>
    </Toolbar>
  );
};

const D2dStudentList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("rank");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const [rows, setRows] = React.useState([]);
  const [originalRows, setOriginalRows] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] = React.useState("candidateName");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAction = async () => {
      try {
        const res = await axios.get("/getStudentsData");
        setRows(res.data);
        setOriginalRows(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchAction();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);
    let filteredRows = [];
    if (searchValue === "") {
      setRows(originalRows);
    } else {
      filteredRows = originalRows.filter((row) => {
        return row[searchBy]?.toString().toLowerCase().includes(searchValue);
      });
      setRows(filteredRows);
    }
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Box>
      <Box>
        <EnhancedTableToolbar
          search={search}
          handleSearch={(event) => handleSearch(event)}
          searchBy={searchBy}
          handleSearchByChange={handleSearchByChange}
        />
        <Paper
          variant="outlined"
          sx={{ mx: 2, mt: 1, border: ` 1px solid ${borderColor} ` }}
        >
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.applicationNo}
                        >
                          <TableCell component="th" id={labelId} scope="row">
                            {row.applicationNo}
                          </TableCell>
                          <TableCell>{row.candidateName}</TableCell>
                          <TableCell>{row.rank}</TableCell>
                          <TableCell>{row.marksSecured}</TableCell>
                          <TableCell>{row.seatNo}</TableCell>
                          <TableCell>{row.userId}</TableCell>
                          <TableCell>{row.fathersName}</TableCell>
                          <TableCell>{row.programme}</TableCell>
                        </TableRow>
                      );
                    })
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default D2dStudentList;
