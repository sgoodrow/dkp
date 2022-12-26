import { Box, Button, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "level",
    headerName: "Level",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "class",
    headerName: "Class",
    width: 160,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", level: 35, class: "Warrior" },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    level: 42,
    class: "Warrior",
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    level: 45,
    class: "Warrior",
  },
  { id: 4, lastName: "Stark", firstName: "Arya", level: 16, class: "Warrior" },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    level: 1,
    class: "Warrior",
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: "Something",
    level: 60,
    class: "Warrior",
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    level: 44,
    class: "Warrior",
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    level: 36,
    class: "Warrior",
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    level: 60,
    class: "Warrior",
  },
];

export default () => (
  <>
    <Typography variant="subtitle1">Characters</Typography>
    <Box pt={1} height={500}>
      <DataGrid
        density="compact"
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
    <Box pt={1} display="flex" justifyContent="end">
      <Button variant="outlined">Claim</Button>
      <Box ml={1} />
      <Button>Create</Button>
    </Box>
  </>
);
