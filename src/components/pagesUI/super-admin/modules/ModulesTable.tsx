"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Pagination from "@mui/material/Pagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import useMaterialTableHook from "@/hooks/useMaterialTableHook";
import { Checkbox } from "@mui/material";
import TableControls from "@/components/elements/SharedInputs/TableControls";
import DeleteModal from "@/components/common/DeleteModal";
import ModuleDetailsModal from "./ModuleDetailsModal"
import EditModuleModal from "./EditModuleModal"
import Switch from "@mui/material/Switch";

// Define Module interface
interface IModule {
  id: number;
  moduleName: string;
  moduleCode: string;
  category: string;
  status: string;
  tier: string;
  price: number;
  users: number;
  createdAt: string;
  lastUpdated: string;
  description: string;
  [key: string]: any;
}

// Mock data
const modulesData: IModule[] = [
  {
    id: 1,
    moduleName: "Attendance Management",
    moduleCode: "MOD-001",
    category: "HR",
    status: "Active",
    tier: "Basic",
    price: 29,
    users: 50,
    createdAt: "2024-01-15",
    lastUpdated: "2024-03-01",
    description: "Track employee attendance and working hours"
  },
  {
    id: 2,
    moduleName: "Leave Management",
    moduleCode: "MOD-002",
    category: "HR",
    status: "Active",
    tier: "Basic",
    price: 19,
    users: 50,
    createdAt: "2024-01-20",
    lastUpdated: "2024-02-15",
    description: "Manage employee leave requests and approvals"
  },
  {
    id: 3,
    moduleName: "Payroll Processing",
    moduleCode: "MOD-003",
    category: "Finance",
    status: "Active",
    tier: "Pro",
    price: 99,
    users: 100,
    createdAt: "2024-02-01",
    lastUpdated: "2024-03-10",
    description: "Automated payroll calculation and processing"
  },
  {
    id: 4,
    moduleName: "Performance Management",
    moduleCode: "MOD-004",
    category: "HR",
    status: "Inactive",
    tier: "Enterprise",
    price: 199,
    users: 200,
    createdAt: "2024-01-10",
    lastUpdated: "2024-02-28",
    description: "Employee performance tracking and reviews"
  },
  {
    id: 5,
    moduleName: "Recruitment",
    moduleCode: "MOD-005",
    category: "HR",
    status: "Active",
    tier: "Pro",
    price: 79,
    users: 75,
    createdAt: "2024-02-15",
    lastUpdated: "2024-03-05",
    description: "Complete recruitment and hiring process"
  },
  {
    id: 6,
    moduleName: "Compliance Management",
    moduleCode: "MOD-006",
    category: "Legal",
    status: "Active",
    tier: "Enterprise",
    price: 149,
    users: 150,
    createdAt: "2024-01-25",
    lastUpdated: "2024-03-12",
    description: "Regulatory compliance tracking and reporting"
  },
  {
    id: 7,
    moduleName: "Inventory Management",
    moduleCode: "MOD-007",
    category: "Operations",
    status: "Inactive",
    tier: "Pro",
    price: 89,
    users: 50,
    createdAt: "2024-02-10",
    lastUpdated: "2024-02-25",
    description: "Track and manage inventory levels"
  },
  {
    id: 8,
    moduleName: "Project Management",
    moduleCode: "MOD-008",
    category: "Operations",
    status: "Active",
    tier: "Basic",
    price: 39,
    users: 100,
    createdAt: "2024-01-30",
    lastUpdated: "2024-03-08",
    description: "Project planning, tracking, and collaboration"
  }
];

// Table head cells
const moduleHeadCells = [
  { id: "moduleName", label: "Module Name" },
  { id: "moduleCode", label: "Code" },
  { id: "category", label: "Category" },
  { id: "status", label: "Status" },
  { id: "tier", label: "Tier" },
  { id: "price", label: "Price" },
  { id: "users", label: "Users" },
  { id: "createdAt", label: "Created" },
  { id: "lastUpdated", label: "Updated" },
];

const ModulesTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editData, setEditData] = useState<IModule | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [activeStatus, setActiveStatus] = useState<{[key: number]: boolean}>(
    modulesData.reduce((acc, module) => ({...acc, [module.id]: module.status === "Active"}), {})
  );
  
  const {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    searchQuery,
    paginatedRows,
    filteredRows,
    handleDelete,
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
  } = useMaterialTableHook<IModule>(modulesData, 10);

  // Helper function for status badge class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success";
      case "inactive":
        return "bg-danger";
      case "pending":
        return "bg-warning";
      default:
        return "bg-info";
    }
  };

  // Helper function for tier badge class
  const getTierClass = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "basic":
        return "bg-info";
      case "pro":
        return "bg-primary";
      case "enterprise":
        return "bg-success";
      default:
        return "default-badge";
    }
  };

  const handleStatusToggle = (id: number, currentStatus: boolean) => {
    setActiveStatus(prev => ({
      ...prev,
      [id]: !currentStatus
    }));
    getTierClass
  };

  return (
    <>
      <div className="col-span-12">
        <div className="card__wrapper">
          <div className="manaz-common-mat-list w-full table__wrapper table-responsive">
            <TableControls
              rowsPerPage={rowsPerPage}
              searchQuery={searchQuery}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleSearchChange={handleSearchChange}
            />
            
            <Box sx={{ width: "100%" }} className="table-responsive">
              <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer className="table mb-[20px] hover multiple_tables w-full">
                  <Table aria-labelledby="tableTitle" className="whitespace-nowrap">
                    <TableHead>
                      <TableRow className="table__title">
                        <TableCell padding="checkbox">
                          <Checkbox
                            className="custom-checkbox checkbox-small"
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                            checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                            onChange={(e) => handleSelectAllClick(e.target.checked, filteredRows)}
                            size="small"
                          />
                        </TableCell>
                        {moduleHeadCells.map((headCell) => (
                          <TableCell
                            className="table__title"
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : "asc"}
                              onClick={() => handleRequestSort(headCell.id)}
                            >
                              {headCell.label}
                              {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    
                    <TableBody className="table__body">
                      {paginatedRows.map((row, index) => {
                        const statusClass = getStatusClass(row.status);
                        const tierClass = getTierClass(row.tier);
                        const isActive = activeStatus[row.id];
                        
                        return (
                          <TableRow
                            key={row.id}
                            selected={selected.includes(index)}
                            onClick={() => handleClick(index)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                className="custom-checkbox checkbox-small"
                                checked={selected.includes(index)}
                                size="small"
                                onChange={() => handleClick(index)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <i className="fa-sharp fa-light fa-book mr-2 text-gray-500"></i>
                                {row.moduleName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{row.moduleCode}</span>
                            </TableCell>
                            <TableCell>
                              <span className="bd-badge bg-secondary">{row.category}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`bd-badge ${statusClass}`}>
                                  {isActive ? "Active" : "Inactive"}
                                </span>
                                <Switch
                                  size="small"
                                  checked={isActive}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleStatusToggle(row.id, isActive);
                                  }}
                                  color="primary"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`bd-badge ${tierClass}`}>
                                {row.tier}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">${row.price}</span>
                              <span className="text-gray-500 text-sm">/month</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{row.users} users</span>
                            </TableCell>
                            <TableCell>{row.createdAt}</TableCell>
                            <TableCell>{row.lastUpdated}</TableCell>
                            <TableCell className="table__icon-box">
                              <div className="flex items-center justify-start gap-[10px]">
                                <button
                                  type="button"
                                  className="table__icon download"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditData(row);
                                    setDetailsModalOpen(true);
                                  }}
                                >
                                  <i className="fa-regular fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="table__icon edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditData(row);
                                    setModalOpen(true);
                                  }}
                                >
                                  <i className="fa-sharp fa-light fa-pen"></i>
                                </button>
                                <button
                                  className="removeBtn table__icon delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId(row.id);
                                    setModalDeleteOpen(true);
                                  }}
                                >
                                  <i className="fa-regular fa-trash"></i>
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
            
            <Box className="table-search-box mt-[30px]" sx={{ p: 2 }}>
              <Box>
                {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
                  page * rowsPerPage,
                  filteredRows.length
                )} of ${filteredRows.length} entries`}
              </Box>
              <Pagination
                count={Math.ceil(filteredRows.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => handleChangePage(value)}
                variant="outlined"
                shape="rounded"
                className="manaz-pagination-button"
              />
            </Box>
          </div>
        </div>
      </div>

      {modalOpen && editData && (
        <EditModuleModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editData}
        />
      )}
      
      {detailsModalOpen && editData && (
        <ModuleDetailsModal
          open={detailsModalOpen}
          setOpen={setDetailsModalOpen}
          editData={editData}
        />
      )}

      {modalDeleteOpen && (
           <DeleteModal
  open={modalDeleteOpen}
  setOpen={setModalDeleteOpen}
  onConfirm={() => handleDelete(deleteId)}
/>
      )}
    </>
  );
};

export default ModulesTable;