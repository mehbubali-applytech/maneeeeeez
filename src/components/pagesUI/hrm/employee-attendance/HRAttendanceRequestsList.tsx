"use client";

import React, { useState, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
    Grid,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Tooltip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TablePagination,
    Checkbox,
    Menu,
    MenuItem,
    FormControlLabel,
    Autocomplete,
    Divider
} from "@mui/material";
import {
    Search,
    FilterList,
    CheckCircle,
    Cancel,
    Pending,
    Visibility,
    History,
    Download,
    Refresh,
    MoreVert,
    AttachFile,
    Schedule,
    AccessTime,
    CalendarMonth,
    ArrowUpward,
    ArrowDownward,
    SelectAll,
    ClearAll
} from "@mui/icons-material";
import { IAttendanceCorrectionRequest, CORRECTION_TYPES } from "../../owner/attendance/AttendanceTypes";
import { Edit } from "lucide-react";

interface HRAttendanceRequestsListProps {
    requests?: IAttendanceCorrectionRequest[];
    onApprove?: (requestIds: string[]) => void;
    onReject?: (requestIds: string[], reason: string) => void;
    onEditRequest?: (request: IAttendanceCorrectionRequest) => void;
    onViewDetails?: (request: IAttendanceCorrectionRequest) => void;
    onExport?: (data: IAttendanceCorrectionRequest[]) => void;
    currentUser: string;
}

const HRAttendanceRequestsList: React.FC<HRAttendanceRequestsListProps> = ({
    requests = [],
    onApprove,
    onReject,
    onEditRequest,
    onViewDetails,
    onExport,
    currentUser = "HR Manager"
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<'date' | 'employee'>('date');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [selectedRequest, setSelectedRequest] = useState<IAttendanceCorrectionRequest | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuRequest, setMenuRequest] = useState<IAttendanceCorrectionRequest | null>(null);

    // Mock data
    const mockRequests: IAttendanceCorrectionRequest[] = useMemo(() => [
        {
            id: "REQ001",
            attendanceId: "ATT001",
            employeeId: "EMP001",
            employeeName: "Rajesh Kumar",
            date: "2024-01-15",
            type: "Incorrect Time",
            currentCheckIn: "09:45",
            currentCheckOut: "18:00",
            requestedCheckIn: "09:00",
            requestedCheckOut: "18:00",
            reason: "Forgot to check-in on time due to urgent client meeting",
            status: "Pending",
            submittedAt: "2024-01-15T10:30:00Z",
            attachmentUrl: "/attachments/meeting_invite.pdf"
        },
        {
            id: "REQ002",
            attendanceId: "ATT002",
            employeeId: "EMP002",
            employeeName: "Priya Sharma",
            date: "2024-01-14",
            type: "Missing In",
            currentCheckIn: undefined,
            currentCheckOut: "22:00",
            requestedCheckIn: "14:00",
            requestedCheckOut: "22:00",
            reason: "System error - check-in not recorded",
            status: "Pending",
            submittedAt: "2024-01-14T15:00:00Z",
            attachmentUrl: "/attachments/error_screenshot.png"
        },
        {
            id: "REQ003",
            attendanceId: "ATT003",
            employeeId: "EMP003",
            employeeName: "Amit Patel",
            date: "2024-01-13",
            type: "Missing Out",
            currentCheckIn: "09:00",
            currentCheckOut: undefined,
            requestedCheckIn: "09:00",
            requestedCheckOut: "18:00",
            reason: "Forgot to check-out while in meeting",
            status: "Approved",
            submittedAt: "2024-01-13T18:30:00Z",
            reviewedBy: currentUser,
            reviewedAt: "2024-01-14T10:00:00Z",
            reviewNotes: "Approved - confirmed with meeting calendar"
        },
        {
            id: "REQ004",
            attendanceId: "ATT004",
            employeeId: "EMP004",
            employeeName: "Sneha Reddy",
            date: "2024-01-12",
            type: "Absent",
            currentCheckIn: undefined,
            currentCheckOut: undefined,
            requestedCheckIn: "09:30",
            requestedCheckOut: "18:30",
            reason: "Was present but marked absent due to system error",
            status: "Rejected",
            submittedAt: "2024-01-12T19:00:00Z",
            reviewedBy: currentUser,
            reviewedAt: "2024-01-13T11:00:00Z",
            reviewNotes: "Rejected - no supporting evidence provided"
        },
        {
            id: "REQ005",
            attendanceId: "ATT005",
            employeeId: "EMP005",
            employeeName: "Vikram Singh",
            date: "2024-01-11",
            type: "Incorrect Time",
            currentCheckIn: "10:15",
            currentCheckOut: "19:00",
            requestedCheckIn: "09:45",
            requestedCheckOut: "18:45",
            reason: "Traffic delay in morning, worked extra to compensate",
            status: "Pending",
            submittedAt: "2024-01-11T19:30:00Z"
        }
    ], [currentUser]);

    const data = requests.length > 0 ? requests : mockRequests;

    // Status options for Autocomplete
    const statusOptions = useMemo(() => [
        { label: "All Status", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" }
    ], []);

    // Type options for Autocomplete
    const typeOptions = useMemo(() => [
        { label: "All Types", value: "All" },
        ...CORRECTION_TYPES.map(type => ({ label: type.label, value: type.value }))
    ], []);

    const filteredData = useMemo(() => {
        let filtered = [...data];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(request =>
                request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.reason.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== "All") {
            filtered = filtered.filter(request => request.status === filterStatus);
        }

        // Filter by type
        if (filterType !== "All") {
            filtered = filtered.filter(request => request.type === filterType);
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
            } else {
                comparison = a.employeeName.localeCompare(b.employeeName);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [data, searchQuery, filterStatus, filterType, sortBy, sortOrder]);

    const paginatedData = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
            case 'Approved':
                return <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />;
            case 'Rejected':
                return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'Missing In':
                return <Chip label="Missing Check-In" size="small" color="error" variant="outlined" />;
            case 'Missing Out':
                return <Chip label="Missing Check-Out" size="small" color="warning" variant="outlined" />;
            case 'Incorrect Time':
                return <Chip label="Incorrect Time" size="small" color="info" variant="outlined" />;
            case 'Absent':
                return <Chip label="Marked Absent" size="small" color="default" variant="outlined" />;
            default:
                return <Chip label={type} size="small" variant="outlined" />;
        }
    };

    const getStatusCount = () => {
        const pending = data.filter(r => r.status === 'Pending').length;
        const approved = data.filter(r => r.status === 'Approved').length;
        const rejected = data.filter(r => r.status === 'Rejected').length;
        return { pending, approved, rejected, total: data.length };
    };

    const statusCount = getStatusCount();

    const handleSelectAll = () => {
        if (selectedRequests.length === filteredData.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(filteredData.map(req => req.id));
        }
    };

    const handleSelectRequest = (requestId: string) => {
        if (selectedRequests.includes(requestId)) {
            setSelectedRequests(prev => prev.filter(id => id !== requestId));
        } else {
            setSelectedRequests(prev => [...prev, requestId]);
        }
    };

    const handleBulkApprove = () => {
        if (selectedRequests.length === 0) return;

        if (onApprove) {
            onApprove(selectedRequests);
        } else {
            console.log(`Bulk approved requests: ${selectedRequests.join(', ')}`);
            alert(`${selectedRequests.length} requests approved`);
        }

        setSelectedRequests([]);
    };

    const handleBulkReject = () => {
        if (selectedRequests.length === 0) return;

        const reason = prompt(`Enter reason for rejecting ${selectedRequests.length} request(s):`);
        if (reason && onReject) {
            onReject(selectedRequests, reason);
            setSelectedRequests([]);
        }
    };

    const handleSingleApprove = (requestId: string) => {
        if (onApprove) {
            onApprove([requestId]);
        } else {
            console.log(`Approved request ${requestId}`);
            alert(`Request ${requestId} approved`);
        }
    };

    const handleSingleReject = (requestId: string, reason: string) => {
        if (onReject) {
            onReject([requestId], reason);
        } else {
            console.log(`Rejected request ${requestId} with reason: ${reason}`);
            alert(`Request ${requestId} rejected`);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, request: IAttendanceCorrectionRequest) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuRequest(request);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuRequest(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History /> Attendance Correction Requests
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {selectedRequests.length > 0 && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircle />}
                                    onClick={handleBulkApprove}
                                    size="small"
                                    className="!text-white"
                                >
                                    Approve ({selectedRequests.length})
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<Cancel />}
                                    onClick={handleBulkReject}
                                    size="small"
                                    className="!text-white"
                                >
                                    Reject ({selectedRequests.length})
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => onExport?.(data)}
                            size="small"
                        >
                            Export
                        </Button>
                    </Box>
                </Box>

                {/* Summary Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">{statusCount.total}</Typography>
                            <Typography variant="caption" color="text.secondary">Total Requests</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'warning.main', border: 1 }}>
                            <Typography variant="h6" color="warning.main">{statusCount.pending}</Typography>
                            <Typography variant="caption" color="text.secondary">Pending Review</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'success.main', border: 1 }}>
                            <Typography variant="h6" color="success.main">{statusCount.approved}</Typography>
                            <Typography variant="caption" color="text.secondary">Approved</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'error.main', border: 1 }}>
                            <Typography variant="h6" color="error.main">{statusCount.rejected}</Typography>
                            <Typography variant="caption" color="text.secondary">Rejected</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Bulk Actions Bar */}
            {selectedRequests.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50', borderColor: 'primary.main', border: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Checkbox
                                checked={selectedRequests.length === filteredData.length}
                                indeterminate={selectedRequests.length > 0 && selectedRequests.length < filteredData.length}
                                onChange={handleSelectAll}
                            />
                            <Typography variant="subtitle2">
                                {selectedRequests.length} request(s) selected
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="text"
                                startIcon={<ClearAll />}
                                onClick={() => setSelectedRequests([])}
                                size="small"
                            >
                                Clear Selection
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by employee, ID, or reason..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={statusOptions}
                            value={statusOptions.find(opt => opt.value === filterStatus) || null}
                            onChange={(event, newValue) => {
                                setFilterStatus(newValue?.value || "All");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Status"
                                    placeholder="Select status"
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.value}>
                                    {option.label}
                                </li>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={typeOptions}
                            value={typeOptions.find(opt => opt.value === filterType) || null}
                            onChange={(event, newValue) => {
                                setFilterType(newValue?.value || "All");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Correction Type"
                                    placeholder="Select type"
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.value}>
                                    {option.label}
                                </li>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => {
                                setSearchQuery("");
                                setFilterStatus("All");
                                setFilterType("All");
                                setSelectedRequests([]);
                            }}
                            fullWidth
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Requests Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={filteredData.length > 0 && selectedRequests.length === filteredData.length}
                                    indeterminate={selectedRequests.length > 0 && selectedRequests.length < filteredData.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Employee</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="center">Requested Time</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Attachment</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((request) => (
                            <TableRow
                                key={request.id}
                                hover
                                sx={{
                                    ...(request.status === 'Pending' && { bgcolor: '#ffd7a3' }),
                                    ...(selectedRequests.includes(request.id) && { bgcolor: 'primary.lighter' })
                                }}
                            >
                                {/* Checkbox */}
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedRequests.includes(request.id)}
                                        onChange={() => handleSelectRequest(request.id)}
                                    />
                                </TableCell>

                                {/* Employee */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                            {request.employeeName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {request.employeeName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {request.employeeId}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* Date */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(request.date)}
                                    </Typography>
                                </TableCell>

                                {/* Type */}
                                <TableCell>
                                    {getTypeBadge(request.type)}
                                </TableCell>

                                {/* Requested Time */}
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {request.requestedCheckIn ? (
                                            <Typography variant="body2" fontWeight={600}>
                                                In: {request.requestedCheckIn}
                                            </Typography>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                —
                                            </Typography>
                                        )}
                                        {request.requestedCheckOut ? (
                                            <Typography variant="body2" fontWeight={600}>
                                                Out: {request.requestedCheckOut}
                                            </Typography>
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                —
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>

                                {/* Reason */}
                                <TableCell>
                                    <Tooltip title={request.reason}>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                            {request.reason.length > 50 ? `${request.reason.substring(0, 50)}...` : request.reason}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>

                                {/* Attachment */}
                                <TableCell>
                                    {request.attachmentUrl ? (
                                        <Tooltip title="Download supporting document">
                                            <IconButton
                                                size="small"
                                                onClick={() => window.open(request.attachmentUrl, '_blank')}
                                            >
                                                <AttachFile fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            —
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* Status */}
                                <TableCell align="center">
                                    {getStatusBadge(request.status)}
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setDetailDialogOpen(true);
                                                    if (onViewDetails) onViewDetails(request);
                                                }}
                                            >
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        {request.status === 'Pending' && (
                                            <>
                                                <Tooltip title="Approve Request">
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleSingleApprove(request.id)}
                                                    >
                                                        <CheckCircle fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Reject Request">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setRejectDialogOpen(true);
                                                        }}
                                                    >
                                                        <Cancel fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        <Tooltip title="More Options">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, request)}
                                            >
                                                <MoreVert fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            {/* Empty State */}
            {filteredData.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography>
                        No correction requests found for the selected filters.
                    </Typography>
                </Alert>
            )}

            {/* Request Details Dialog */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedRequest && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <History />
                                Correction Request Details
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                {/* Header */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar sx={{ width: 56, height: 56 }}>
                                            {selectedRequest.employeeName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6">{selectedRequest.employeeName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedRequest.employeeId}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ ml: 'auto' }}>
                                            {getStatusBadge(selectedRequest.status)}
                                            <Box sx={{ mt: 1 }}>
                                                {getTypeBadge(selectedRequest.type)}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Current vs Requested Times */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Time Comparison
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Current Record
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Box>
                                                        <Typography variant="caption">Check-In</Typography>
                                                        <Typography variant="body2">
                                                            {selectedRequest.currentCheckIn || 'Not recorded'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption">Check-Out</Typography>
                                                        <Typography variant="body2">
                                                            {selectedRequest.currentCheckOut || 'Not recorded'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Paper variant="outlined" sx={{ p: 2, borderColor: 'primary.main' }}>
                                                <Typography variant="caption" color="primary" gutterBottom>
                                                    Requested Changes
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Box>
                                                        <Typography variant="caption">Check-In</Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {selectedRequest.requestedCheckIn || 'No change'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption">Check-Out</Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {selectedRequest.requestedCheckOut || 'No change'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Reason & Attachment */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>Reason for Correction</Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        <Typography variant="body2">
                                            {selectedRequest.reason}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {selectedRequest.attachmentUrl && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" gutterBottom>Supporting Document</Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<AttachFile />}
                                            onClick={() => window.open(selectedRequest.attachmentUrl, '_blank')}
                                        >
                                            Download Attachment
                                        </Button>
                                    </Grid>
                                )}

                                {/* Submission Details */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" gutterBottom>Submission Details</Typography>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Submitted</Typography>
                                        <Typography variant="body2">
                                            {formatDateTime(selectedRequest.submittedAt)}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Review Details (if reviewed) */}
                                {selectedRequest.reviewedBy && (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" gutterBottom>Review Details</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" color="text.secondary">Reviewed By</Typography>
                                            <Typography variant="body2">
                                                {selectedRequest.reviewedBy}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" color="text.secondary">Reviewed At</Typography>
                                            <Typography variant="body2">
                                                {selectedRequest.reviewedAt ? formatDateTime(selectedRequest.reviewedAt) : 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">Review Notes</Typography>
                                            <Typography variant="body2">
                                                {selectedRequest.reviewNotes || 'No notes provided'}
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                            {selectedRequest.status === 'Pending' && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                            handleSingleApprove(selectedRequest.id);
                                            setDetailDialogOpen(false);
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setDetailDialogOpen(false);
                                            setRejectDialogOpen(true);
                                        }}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Correction Request</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
                        {selectedRequest && (
                            <Typography>
                                Are you sure you want to reject the correction request for <strong>{selectedRequest.employeeName}</strong>?
                            </Typography>
                        )}

                        <TextField
                            label="Reason for rejection *"
                            multiline
                            rows={3}
                            fullWidth
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Provide a reason for rejection..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (selectedRequest && rejectReason.trim()) {
                                handleSingleReject(selectedRequest.id, rejectReason);
                                setRejectDialogOpen(false);
                                setRejectReason("");
                            }
                        }}
                        variant="contained"
                        color="error"
                        disabled={!rejectReason.trim()}
                    >
                        Reject Request
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Context Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                {menuRequest && (
                    <>
                        <MenuItem onClick={() => {
                            if (onEditRequest) onEditRequest(menuRequest);
                            handleMenuClose();
                        }}>
                            <Box sx={{ mr: 1, display: 'inline-flex' }}>
                                <Edit fontSize="small" />
                            </Box>
                            Edit Request
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setSelectedRequest(menuRequest);
                            setDetailDialogOpen(true);
                            handleMenuClose();
                        }}>
                            <Visibility fontSize="small" sx={{ mr: 1 }} />
                            View Details
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => {
                            navigator.clipboard.writeText(menuRequest.id);
                            handleMenuClose();
                        }}>
                            Copy Request ID
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );
};

export default HRAttendanceRequestsList;