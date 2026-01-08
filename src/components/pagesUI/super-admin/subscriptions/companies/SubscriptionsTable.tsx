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
import SubscriptionsDetailsModal from "./SubscriptionsDetailsModal";
import EditSubscriptionModal from "./EditSubscriptionModal";
import {
    getTableStatusClass as getSubscriptionStatusHook
} from "@/hooks/use-condition-class";

// Define Subscription interface with index signature
interface ISubscription {
  id: number;
  subscriptionName: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
  users: number;
  modules: string[];
  owner: string;
  email: string;
  // Add index signature to satisfy RowObject constraint
  [key: string]: any;
}

// Mock data
const subscriptionData: ISubscription[] = [
  {
    id: 1,
    subscriptionName: "Enterprise Plan",
    plan: "Enterprise",
    amount: 199,
    currency: "USD",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-12-14",
    users: 50,
    modules: ["CRM", "HR", "Finance"],
    owner: "John Doe",
    email: "john@example.com"
  },
  {
    id: 2,
    subscriptionName: "Pro Monthly",
    plan: "Pro",
    amount: 79,
    currency: "USD",
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    users: 25,
    modules: ["CRM", "Projects"],
    owner: "Jane Smith",
    email: "jane@example.com"
  },
  {
    id: 3,
    subscriptionName: "Basic Annual",
    plan: "Basic",
    amount: 29,
    currency: "USD",
    status: "Pending",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    users: 10,
    modules: ["HR", "Inventory"],
    owner: "Mike Johnson",
    email: "mike@example.com"
  },
  {
    id: 4,
    subscriptionName: "Free Trial",
    plan: "Free",
    amount: 0,
    currency: "USD",
    status: "Expired",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    users: 5,
    modules: ["CRM"],
    owner: "Sarah Wilson",
    email: "sarah@example.com"
  }
];

const subscriptionHeadCells = [
  { id: "subscriptionName", label: "Subscription Name" },
  { id: "plan", label: "Plan" },
  { id: "amount", label: "Amount" },
  { id: "status", label: "Status" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "users", label: "Users" },
  { id: "modules", label: "Modules" },
  { id: "owner", label: "Owner" },
  { id: "email", label: "Email" },
];


const SubscriptionsTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ISubscription | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  
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
  } = useMaterialTableHook<ISubscription>(subscriptionData, 10);

  // Helper function for status badge class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success-badge";
      case "pending":
        return "warning-badge";
      case "expired":
        return "danger-badge";
      default:
        return "info-badge";
    }
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
    onChange={(e) =>
      handleSelectAllClick(e.target.checked, filteredRows)
    }
    size="small"
  />
</TableCell>

{/* ✅ Spacer header cell (REQUIRED) */}
<TableCell></TableCell>

{subscriptionHeadCells.map((headCell) => (
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
      {orderBy === headCell.id && (
        <Box component="span" sx={visuallyHidden}>
          {order === "desc"
            ? "sorted descending"
            : "sorted ascending"}
        </Box>
      )}
    </TableSortLabel>
  </TableCell>
))}

<TableCell>Action</TableCell>

                      </TableRow>
                    </TableHead>
                    
<TableBody className="table__body">
  {paginatedRows.map((row, index) => {
    const statusClass = getSubscriptionStatusHook(row.status);

    return (
      <TableRow
        key={index}
        selected={selected.includes(index)}
        onClick={() => handleClick(index)}
      >
        {/* Checkbox */}
        <TableCell padding="checkbox">
          <Checkbox
            className="custom-checkbox checkbox-small"
            checked={selected.includes(index)}
            size="small"
            onChange={() => handleClick(index)}
          />
        </TableCell>

        {/* Spacer cell (same as DealsTable) */}
        <TableCell></TableCell>

        <TableCell>{row.subscriptionName}</TableCell>
        <TableCell>{row.plan}</TableCell>
        <TableCell>{row.currency} {row.amount}</TableCell>

        <TableCell>
          <span className={`bd-badge ${statusClass}`}>
            {row.status}
          </span>
        </TableCell>

        <TableCell>{row.startDate}</TableCell>
        <TableCell>{row.endDate}</TableCell>
        <TableCell>{row.users}</TableCell>

        <TableCell>
          <span className="tag-badge">
            {row.modules.slice(0, 2).join(", ")}
            {row.modules.length > 2 && "…"}
          </span>
        </TableCell>

        <TableCell>{row.owner}</TableCell>
        <TableCell>{row.email}</TableCell>

        {/* Action buttons — EXACT same as DealsTable */}
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
        <EditSubscriptionModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editData}
        />
      )}
      
      {detailsModalOpen && editData && (
        <SubscriptionsDetailsModal
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

export default SubscriptionsTable;