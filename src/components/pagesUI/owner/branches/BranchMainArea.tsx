// BranchMainArea.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import BranchTable from "./BranchTable";
import { IBranch, mapApiBranchToComponent } from "./BranchTypes";
import UpdateBranchModal from "./UpdateBranchModal";
import BranchSummary from "./BranchSummary";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/Warning";
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
  error?: {
    errorCode?: number;
    errorMessage?: string;
    errorIdentifier?: string;
  };
  status?: number;
}

const BranchMainArea: React.FC = () => {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    type: "error" | "warning" | "info";
    retryable: boolean;
    details?: string;
  } | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info"
  });
  const [retryCount, setRetryCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBranchId, setDeleteBranchId] = useState<number | null>(null);

  const router = useRouter();
  const maxRetries = 3;

  useEffect(() => {
    loadBranches();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info" = "info") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleApiError = (err: unknown, context: string = "Loading branches"): ApiErrorResponse => {
    console.error(`${context} error:`, err);

    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      switch (status) {
        case 401:
          setError({
            message: "Authentication required",
            type: "error",
            retryable: false,
            details: "Please log in to access branches."
          });
          showSnackbar("Session expired. Please log in again.", "error");
          setTimeout(() => {
            router.push("/");
          }, 2000);
          break;

        case 403:
          setError({
            message: "Access denied",
            type: "error",
            retryable: false,
            details: "You don't have permission to view branches."
          });
          break;

        case 404:
          setError({
            message: "Branches not found",
            type: "warning",
            retryable: true,
            details: "The branches endpoint was not found."
          });
          break;

        case 500:
          setError({
            message: "Server error",
            type: "error",
            retryable: true,
            details: data?.error?.errorMessage || "Internal server error. Please try again later."
          });
          break;

        case 503:
          setError({
            message: "Service unavailable",
            type: "error",
            retryable: true,
            details: "The server is currently unavailable. Please try again later."
          });
          break;

        default:
          setError({
            message: "Network error",
            type: "error",
            retryable: true,
            details: axiosError.message || "Unable to connect to the server."
          });
      }

      return {
        message: data?.message || axiosError.message,
        error: data?.error,
        status
      };
    } else if (err instanceof Error) {
      setError({
        message: "Application error",
        type: "error",
        retryable: true,
        details: err.message
      });
    } else {
      setError({
        message: "Unknown error occurred",
        type: "error",
        retryable: true,
        details: "An unexpected error occurred. Please try again."
      });
    }

    return {};
  };

  const loadBranches = async (isRetry: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      if (isRetry) {
        setRetryCount(prev => prev + 1);
        if (retryCount >= maxRetries) {
          setError({
            message: "Maximum retries exceeded",
            type: "error",
            retryable: false,
            details: `Failed after ${maxRetries} attempts. Please check your connection.`
          });
          setLoading(false);
          return;
        }
        showSnackbar(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`, "info");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/branch/client`,
        {
          withCredentials: true
        }
      );

      console.log("Branches API Response:", response.data);

      if (!response.data?.data) {
        throw new Error("Invalid response format: missing data property");
      }

      // Validate response data
      const apiData = response.data.data;
      if (!Array.isArray(apiData)) {
        throw new Error("Invalid response format: data is not an array");
      }

      const mappedBranches = apiData.map(mapApiBranchToComponent);

      // Validate mapped branches
      if (mappedBranches.length === 0) {
        setError({
          message: "No branches found",
          type: "info",
          retryable: false,
          details: "Add your first branch to get started."
        });
        showSnackbar("No branches found. Add your first branch!", "info");
      } else {
        showSnackbar(`Successfully loaded ${mappedBranches.length} branches`, "success");
      }

      setBranches(mappedBranches);
      setRetryCount(0);

    } catch (err) {
      const apiError = handleApiError(err, "Loading branches");

      // Only show snackbar for network errors (not for auth errors)
      if (axios.isAxiosError(err) && err.code !== 'ERR_NETWORK') {
        showSnackbar(apiError.message || "Failed to load branches", "error");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    router.push("/owner/branches/add-branch");
  };

  const openEditModal = (branch: IBranch) => {
    if (!branch || !branch.id) {
      showSnackbar("Invalid branch data", "error");
      return;
    }
    setEditingBranch(branch);
    setModalOpen(true);
  };

  const handleSaveBranch = async (payload: Partial<IBranch>) => {
    try {
      // Update local state immediately for better UX
      if (payload.id) {
        setBranches((prev) =>
          prev.map((b) => (b.id === payload.id ? { ...b, ...payload } : b))
        );
      }
      
      toast.success("Branch updated successfully!");
      
      // Reload branches from API to get fresh data
      loadBranches();
      
    } catch (err) {
      toast.error("Failed to update branch");
    }
  };

  const confirmDeleteBranch = (id: number) => {
    setDeleteBranchId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBranch = async () => {
    if (!deleteBranchId) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/branch/${deleteBranchId}`,
        { withCredentials: true }
      );

      // Update local state immediately
      setBranches((prev) => prev.filter((b) => b.id !== deleteBranchId));
      showSnackbar("Branch deleted successfully!", "success");

      // Refresh the page data
      router.refresh();

    } catch (err) {
      handleApiError(err, "Deleting branch");
      showSnackbar("Failed to delete branch", "error");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteBranchId(null);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/branch/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state immediately
      setBranches((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
              ...b,
              is_active: newStatus as "Active" | "Inactive" | "Closed",
              status: newStatus as "Active" | "Inactive" | "Closed"
            }
            : b
        )
      );
      
      showSnackbar(`Branch status updated to ${newStatus}`, "success");
      
      // Refresh the page data
      router.refresh();

    } catch (err) {
      handleApiError(err, "Updating branch status");
      showSnackbar("Failed to update branch status", "error");
    }
  };

  const renderErrorState = () => {
    if (!error) return null;

    const getIcon = () => {
      switch (error.type) {
        case "error": return <ErrorOutlineIcon fontSize="large" color="error" />;
        case "warning": return <WarningIcon fontSize="large" color="warning" />;
        default: return <ErrorOutlineIcon fontSize="large" color="info" />;
      }
    };

    const getColor = () => {
      switch (error.type) {
        case "error": return "error";
        case "warning": return "warning";
        default: return "info";
      }
    };

    return (
      <div className="app__slide-wrapper">
        <Alert
          severity={getColor()}
          className="mb-4"
          icon={getIcon()}
          action={
            error.retryable && (
              <Button
                color="inherit"
                size="small"
                onClick={() => loadBranches(true)}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            )
          }
        >
          <AlertTitle>{error.message}</AlertTitle>
          {error.details && (
            <Typography variant="body2" className="mt-1">
              {error.details}
            </Typography>
          )}
          {error.retryable && retryCount > 0 && (
            <Typography variant="caption" className="block mt-2">
              Retry attempt: {retryCount} of {maxRetries}
            </Typography>
          )}
        </Alert>

        {!error.retryable && (
          <Box className="mt-4 text-center">
            <Button
              variant="contained"
              onClick={handleAddClick}
              className="mr-2"
            >
              Add First Branch
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/owner")}
              className="ml-2"
            >
              Back to Dashboard
            </Button>
          </Box>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="app__slide-wrapper">
        <Box className="flex flex-col justify-center items-center h-64">
          <CircularProgress size={60} className="mb-4" />
          <Typography variant="h6" className="mb-2">
            Loading branches...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we fetch your branch data
          </Typography>
          {retryCount > 0 && (
            <Typography variant="caption" className="mt-2">
              Attempt {retryCount} of {maxRetries}
            </Typography>
          )}
        </Box>
      </div>
    );
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item active">All Branches</li>
          </ol>
        </nav>

        <div className="breadcrumb__btn">
          <button className="btn btn-primary" onClick={handleAddClick}>
            Add Branch
          </button>
        </div>
      </div>

      {/* Branch Summary */}
      <div className="grid grid-cols-12 gap-x-6 maxXs:gap-x-0">
        <BranchSummary branches={branches} />
      </div>

      {/* Branch Table */}
      <BranchTable
        key={branches.length}
        data={branches}
        onEdit={openEditModal}
        onDelete={confirmDeleteBranch}
        onStatusChange={handleStatusChange}
      />

      {/* Edit Modal */}
      {modalOpen && editingBranch && (
        <UpdateBranchModal
          open={modalOpen}
          setOpen={setModalOpen}
          editData={editingBranch}
          onSave={handleSaveBranch}
          onUpdateSuccess={loadBranches} // Pass the reload function
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          <Box className="flex items-center gap-2">
            <WarningIcon color="warning" />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this branch?
            <br />
            <strong>This action cannot be undone.</strong>
            <br />
            <br />
            All associated data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBranch}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BranchMainArea;