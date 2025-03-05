import { Container, TextField, Autocomplete, Chip, Typography } from "@mui/material";
import "./App.css";
import Person from "./person.json";
import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

function App() {
  const [selectedRoles, setSelectedRoles] = useState([]);

  const filteredData = useMemo(() => {
    if (selectedRoles.length === 0) return Person;
    return Person.filter((person) => selectedRoles.includes(person.Role));
  }, [selectedRoles]);

  const roles = useMemo(() => {
    const roleSet = new Set(Person.map((item) => item.Role));
    return Array.from(roleSet);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: false,
        size: "280",
        Cell: ({ cell, row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={`/${row.original.image}`}
              alt={row.original.name}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            <Typography style={{fontSize:"14px"}} >
            {cell.getValue()}{" "}
              <Typography style={{ fontSize: "12px", color: "#5D5D5D"}}>
              {row.original.username}
              </Typography>
            </Typography>
          </div>
        ),
        Filter: ({ column }) => (
          <DebouncedInput
            value={column.getFilterValue() ?? ""}
            onChange={(value) => column.setFilterValue(value)}
            placeholder="Filter Name"
            variant="standard"
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: "85",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            sx={{ backgroundColor: "#CCE6FF", color: "#0080FF" }}
            size="small"
          />
        ),
      },
      {
        accessorKey: "Role",
        header: "Role",
        size: "270.5",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: "270.5",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "Teams",
        header: "Teams",
        size: "280",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const teams = cell.getValue();
          const maxChipsToShow = 3;
          const extraCount = teams.length - maxChipsToShow;
          const chipStyles = [
            { backgroundColor: "#CCE6FF", color: "#0080FF" },
            { backgroundColor: "#99CCFF", color: "#004D99" },
            { backgroundColor: "#66B3FF", color: "#003366" },
          ];
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {teams.slice(0, maxChipsToShow).map((team, index) => (
                <Chip
                  key={index}
                  label={team}
                  size="small"
                  style={{
                    marginRight: 4,
                    ...(chipStyles[index] || {}),
                  }}
                />
              ))}
              {extraCount > 0 && (
                <Chip label={`+${extraCount}`} variant="outlined" size="small" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "Age",
        header: "Age",
        size: "100",
        enableSorting: true,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableRowSelection: true,
    enableGlobalFilter: false,
    enableHiding:false,
    enableDensityToggle:false,
    enableFullScreenToggle:false,
    enableColumnActions:false,
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    renderTopToolbarCustomActions: () => (
      <Autocomplete
        sx={{ width: 300 }}
        multiple
        options={roles}
        value={selectedRoles}
        onChange={(event, newValue) => setSelectedRoles(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Filter by Role"
            placeholder="Select Role(s)"
          />
        )}
      />
    ),
  });

  return (
    <Container disableGutters maxWidth={false} sx={{ width: "100%", height: "100%" }}>
      <MaterialReactTable table={table} />
    </Container>
  );
}

export default App;
