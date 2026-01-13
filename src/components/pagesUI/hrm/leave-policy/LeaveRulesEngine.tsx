"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Menu,
    MenuItem,
    Alert,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    InputAdornment,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    RadioGroup,
    Radio,
    Autocomplete
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    Search,
    FilterList,
    Download,
    MoreVert,
    Settings,
    PlayArrow,
    Stop,
    History,
    ContentCopy,
    Rule,
    PriorityHigh,
    Timer,
    AutoAwesome,
    Error,
    CheckCircle,
    Warning,
    Assessment,
    Timeline
} from "@mui/icons-material";
import { ILeaveRule, ILeaveType, ILeavePolicy } from "./LeavePolicyTypes";

interface LeaveRulesEngineProps {
    leaveTypes?: ILeaveType[];
    leavePolicies?: ILeavePolicy[];
}

export interface IRuleCondition {
    field: string;
    operator: string;
    value: any;
    logicalOperator?: 'AND' | 'OR';
}

interface IRuleAction {
    type: string;
    value: any;
    parameters?: Record<string, any>;
}

interface ILeaveRuleExtended extends ILeaveRule {
    conditions: IRuleCondition[];
    actions: IRuleAction[];
    executionOrder: number;
    description: string;
    scope: 'Global' | 'Department' | 'Location' | 'EmployeeGroup';
    triggers: string[];
    active: boolean;
    lastExecuted?: string;
    executionCount: number;
    errorCount: number;
    createdAt?: string; // ✅ Added this
    updatedAt?: string; // ✅ Added this
    createdBy?: string; // ✅ Added this
}

const LeaveRulesEngine: React.FC<LeaveRulesEngineProps> = ({
    leaveTypes = [],
    leavePolicies = []
}) => {
    const [rules, setRules] = useState<ILeaveRuleExtended[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterScope, setFilterScope] = useState<string>("All");
    const [activeRule, setActiveRule] = useState<ILeaveRuleExtended | null>(null);
    const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
    const [testDialogOpen, setTestDialogOpen] = useState(false);
    const [executionLogs, setExecutionLogs] = useState<any[]>([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMenuRule, setSelectedMenuRule] = useState<ILeaveRuleExtended | null>(null);

    // Mock data
    useEffect(() => {
        const mockRules: ILeaveRuleExtended[] = [
            {
                id: "RULE001",
                name: "Auto-approve short leaves",
                condition: "leaveDuration <= 2 AND employee.attendanceRating >= 90",
                action: "autoApprove",
                priority: 1,
                active: true,
                conditions: [
                    { field: "leaveDuration", operator: "<=", value: 2 },
                    { field: "employee.attendanceRating", operator: ">=", value: 90, logicalOperator: "AND" }
                ],
                actions: [
                    { type: "autoApprove", value: true, parameters: { notifyManager: false } }
                ],
                executionOrder: 1,
                description: "Auto-approve leaves of 2 days or less for employees with good attendance",
                scope: "Global",
                triggers: ["leaveApplicationSubmitted"],
                executionCount: 42,
                errorCount: 2,
                lastExecuted: "2024-01-15T10:30:00Z"
            },
            {
                id: "RULE002",
                name: "Restrict consecutive leaves",
                condition: "consecutiveLeaveDays >= 5 AND leaveType.category != 'Sick'",
                action: "requireAdditionalApproval",
                priority: 2,
                active: true,
                conditions: [
                    { field: "consecutiveLeaveDays", operator: ">=", value: 5 },
                    { field: "leaveType.category", operator: "!=", value: "Sick", logicalOperator: "AND" }
                ],
                actions: [
                    {
                        type: "requireAdditionalApproval",
                        value: true,
                        parameters: { approverRole: "Department Head", escalationLevel: 2 }
                    }
                ],
                executionOrder: 2,
                description: "Require additional approval for non-sick leaves longer than 5 consecutive days",
                scope: "Global",
                triggers: ["leaveApplicationSubmitted"],
                executionCount: 18,
                errorCount: 0,
                lastExecuted: "2024-01-14T14:20:00Z"
            },
            {
                id: "RULE003",
                name: "Check leave balance",
                condition: "requestedDays > availableBalance",
                action: "reject",
                priority: 3,
                active: true,
                conditions: [
                    { field: "requestedDays", operator: ">", value: "availableBalance" }
                ],
                actions: [
                    {
                        type: "reject",
                        value: true,
                        parameters: {
                            reason: "Insufficient leave balance",
                            notifyEmployee: true,
                            notifyManager: true
                        }
                    }
                ],
                executionOrder: 3,
                description: "Automatically reject leave applications when requested days exceed available balance",
                scope: "Global",
                triggers: ["leaveApplicationSubmitted"],
                executionCount: 7,
                errorCount: 1,
                lastExecuted: "2024-01-13T11:15:00Z"
            },
            {
                id: "RULE004",
                name: "Blockout period validation",
                condition: "leaveStartDate IN blackoutPeriods",
                action: "reject",
                priority: 4,
                active: true,
                conditions: [
                    { field: "leaveStartDate", operator: "IN", value: "blackoutPeriods" }
                ],
                actions: [
                    {
                        type: "reject",
                        value: true,
                        parameters: {
                            reason: "Leave falls within blackout period",
                            notifyEmployee: true
                        }
                    }
                ],
                executionOrder: 4,
                description: "Reject leaves that fall within pre-defined blackout periods",
                scope: "Global",
                triggers: ["leaveApplicationSubmitted"],
                executionCount: 3,
                errorCount: 0,
                lastExecuted: "2024-01-12T09:45:00Z"
            },
            {
                id: "RULE005",
                name: "Probation employee restrictions",
                condition: "employee.probationStatus == 'Active' AND leaveType.category != 'Sick'",
                action: "requireHRApproval",
                priority: 5,
                active: false,
                conditions: [
                    { field: "employee.probationStatus", operator: "==", value: "Active" },
                    { field: "leaveType.category", operator: "!=", value: "Sick", logicalOperator: "AND" }
                ],
                actions: [
                    {
                        type: "requireHRApproval",
                        value: true,
                        parameters: {
                            approvalLevel: "HR Manager",
                            overrideAllowed: false
                        }
                    }
                ],
                executionOrder: 5,
                description: "Require HR approval for non-sick leaves during probation period",
                scope: "Global",
                triggers: ["leaveApplicationSubmitted"],
                executionCount: 0,
                errorCount: 0
            }
        ];

        const mockLogs = [
            { id: "LOG001", ruleId: "RULE001", timestamp: "2024-01-15T10:30:00Z", status: "success", details: "Auto-approved leave for EMP001" },
            { id: "LOG002", ruleId: "RULE002", timestamp: "2024-01-14T14:20:00Z", status: "success", details: "Escalated to Department Head" },
            { id: "LOG003", ruleId: "RULE003", timestamp: "2024-01-13T11:15:00Z", status: "error", details: "Error checking balance for EMP002" },
            { id: "LOG004", ruleId: "RULE004", timestamp: "2024-01-12T09:45:00Z", status: "success", details: "Rejected - blackout period" },
            { id: "LOG005", ruleId: "RULE001", timestamp: "2024-01-11T16:10:00Z", status: "success", details: "Auto-approved leave for EMP003" }
        ];

        setRules(mockRules);
        setExecutionLogs(mockLogs);
    }, []);

    const filteredRules = rules.filter(rule => {
        // Search filter
        if (searchQuery &&
            !rule.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !rule.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Status filter
        if (filterStatus !== "All" && rule.active !== (filterStatus === "Active")) {
            return false;
        }

        // Scope filter
        if (filterScope !== "All" && rule.scope !== filterScope) {
            return false;
        }

        return true;
    });

    const ruleScopes = ["All", "Global", "Department", "Location", "EmployeeGroup"];
    const ruleStatuses = ["All", "Active", "Inactive"];

    const conditionFields = [
        { value: "leaveDuration", label: "Leave Duration (days)" },
        { value: "requestedDays", label: "Requested Days" },
        { value: "availableBalance", label: "Available Balance" },
        { value: "consecutiveLeaveDays", label: "Consecutive Leave Days" },
        { value: "employee.attendanceRating", label: "Employee Attendance Rating" },
        { value: "employee.probationStatus", label: "Probation Status" },
        { value: "leaveType.category", label: "Leave Type Category" },
        { value: "leaveStartDate", label: "Leave Start Date" },
        { value: "leaveEndDate", label: "Leave End Date" },
        { value: "department", label: "Department" },
        { value: "location", label: "Location" },
        { value: "designation", label: "Designation" },
        { value: "workflowStatus", label: "Workflow Status" }
    ];

    const operators = [
        { value: "==", label: "Equals" },
        { value: "!=", label: "Not Equals" },
        { value: ">", label: "Greater Than" },
        { value: "<", label: "Less Than" },
        { value: ">=", label: "Greater Than or Equal" },
        { value: "<=", label: "Less Than or Equal" },
        { value: "IN", label: "In List" },
        { value: "NOT IN", label: "Not In List" },
        { value: "CONTAINS", label: "Contains" },
        { value: "STARTS WITH", label: "Starts With" },
        { value: "ENDS WITH", label: "Ends With" }
    ];

    const actionTypes = [
        { value: "autoApprove", label: "Auto Approve" },
        { value: "autoReject", label: "Auto Reject" },
        { value: "requireAdditionalApproval", label: "Require Additional Approval" },
        { value: "requireHRApproval", label: "Require HR Approval" },
        { value: "sendNotification", label: "Send Notification" },
        { value: "escalate", label: "Escalate" },
        { value: "calculateProration", label: "Calculate Proration" },
        { value: "updateBalance", label: "Update Leave Balance" },
        { value: "logAudit", label: "Log Audit Entry" }
    ];

    const triggers = [
        { value: "leaveApplicationSubmitted", label: "Leave Application Submitted" },
        { value: "leaveApplicationUpdated", label: "Leave Application Updated" },
        { value: "leaveApproved", label: "Leave Approved" },
        { value: "leaveRejected", label: "Leave Rejected" },
        { value: "leaveCancelled", label: "Leave Cancelled" },
        { value: "employeeJoined", label: "Employee Joined" },
        { value: "employeeExited", label: "Employee Exited" },
        { value: "balanceUpdated", label: "Leave Balance Updated" },
        { value: "policyUpdated", label: "Policy Updated" }
    ];

    const handleAddRule = () => {
        setActiveRule(null);
        setMode('add');
        setRuleDialogOpen(true);
    };

    const handleEditRule = (rule: ILeaveRuleExtended) => {
        setActiveRule(rule);
        setMode('edit');
        setRuleDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setRuleToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (ruleToDelete) {
            setRules(prev => prev.filter(rule => rule.id !== ruleToDelete));
            setDeleteDialogOpen(false);
            setRuleToDelete(null);
        }
    };

    const handleToggleActive = (id: string, active: boolean) => {
        setRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, active, updatedAt: new Date().toISOString() } : rule
        ));
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rule: ILeaveRuleExtended) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedMenuRule(rule);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedMenuRule(null);
    };

    const handleCloneRule = () => {
        if (selectedMenuRule) {
            const clonedRule = {
                ...selectedMenuRule,
                id: `RULE${Date.now()}`,
                name: `${selectedMenuRule.name} (Copy)`,
                active: false,
                executionCount: 0,
                errorCount: 0,
                lastExecuted: undefined
            };
            setRules(prev => [...prev, clonedRule]);
        }
        handleMenuClose();
    };

    const handleTestRule = () => {
        setTestDialogOpen(true);
        handleMenuClose();
    };

    const handleViewLogs = () => {
        console.log("View execution logs for rule:", selectedMenuRule?.id);
        handleMenuClose();
    };

    const getRuleStatusColor = (active: boolean) => {
        return active ? "success" : "default";
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return "error";
            case 2: return "warning";
            case 3: return "info";
            case 4: return "primary";
            default: return "default";
        }
    };

    const stats = {
        totalRules: rules.length,
        activeRules: rules.filter(r => r.active).length,
        executedRules: rules.filter(r => r.executionCount > 0).length,
        errorRate: rules.reduce((sum, r) => sum + r.errorCount, 0) /
            rules.reduce((sum, r) => sum + r.executionCount, 1) * 100
    };

    const formatCondition = (conditions: IRuleCondition[]): string => {
        return conditions.map((cond, index) => {
            let conditionStr = `${cond.field} ${cond.operator} ${cond.value}`;
            if (index > 0 && cond.logicalOperator) {
                conditionStr = `${cond.logicalOperator} ${conditionStr}`;
            }
            return conditionStr;
        }).join(' ');
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Leave Rules Engine
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => console.log("Export rules")}
                            size="small"
                        >
                            Export Rules
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddRule}
                            className="!text-white"
                            size="small"
                        >
                            Create Rule
                        </Button>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">{stats.totalRules}</Typography>
                                <Typography variant="caption" color="text.secondary">Total Rules</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ borderColor: 'success.main', border: 1 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="success.main">{stats.activeRules}</Typography>
                                <Typography variant="caption" color="text.secondary">Active</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">{stats.executedRules}</Typography>
                                <Typography variant="caption" color="text.secondary">Executed</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card sx={{ borderColor: stats.errorRate > 5 ? 'error.main' : 'success.main', border: 1 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color={stats.errorRate > 5 ? 'error.main' : 'success.main'}>
                                    {stats.errorRate.toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Error Rate</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search rules..."
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
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    label="Status"
                                >
                                    {ruleStatuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Scope</InputLabel>
                                <Select
                                    value={filterScope}
                                    onChange={(e) => setFilterScope(e.target.value)}
                                    label="Scope"
                                >
                                    {ruleScopes.map((scope) => (
                                        <MenuItem key={scope} value={scope}>
                                            {scope}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterList />}
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilterStatus("All");
                                    setFilterScope("All");
                                }}
                                fullWidth
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Rules List */}
            <Grid container spacing={2}>
                {filteredRules.map((rule) => (
                    <Grid item xs={12} key={rule.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="h6">{rule.name}</Typography>
                                            <Chip
                                                label={rule.active ? "Active" : "Inactive"}
                                                size="small"
                                                color={getRuleStatusColor(rule.active) as any}
                                            />
                                            <Chip
                                                label={`Priority ${rule.priority}`}
                                                size="small"
                                                color={getPriorityColor(rule.priority) as any}
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={rule.scope}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {rule.description}
                                        </Typography>

                                        {/* Conditions */}
                                        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Rule fontSize="small" /> Conditions
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {formatCondition(rule.conditions)}
                                            </Typography>
                                        </Paper>

                                        {/* Actions */}
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AutoAwesome fontSize="small" /> Actions
                                            </Typography>
                                            <Typography variant="body2">
                                                {rule.actions.map((action, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={action.type}
                                                        size="small"
                                                        sx={{ mr: 1, mb: 0.5 }}
                                                    />
                                                ))}
                                            </Typography>
                                        </Paper>
                                    </Box>

                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, rule)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Stats and Triggers */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                                <Timer fontSize="small" />
                                                Triggers: {rule.triggers.map(t => (
                                                    <Chip key={t} label={t} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                                                ))}
                                            </Box>
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Execution Count">
                                            <Chip
                                                icon={<Assessment fontSize="small" />}
                                                label={rule.executionCount}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Tooltip>

                                        <Tooltip title="Error Count">
                                            <Chip
                                                icon={<Error fontSize="small" />}
                                                label={rule.errorCount}
                                                size="small"
                                                color={rule.errorCount > 0 ? "error" : "default"}
                                                variant="outlined"
                                            />
                                        </Tooltip>

                                        {rule.lastExecuted && (
                                            <Tooltip title="Last Executed">
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(rule.lastExecuted).toLocaleDateString()}
                                                </Typography>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Empty State */}
            {filteredRules.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography>
                        No rules found. Create your first rule to automate leave management processes.
                    </Typography>
                </Alert>
            )}

            {/* Recent Execution Logs */}
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History /> Recent Execution Logs
                </Typography>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Rule</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {executionLogs.slice(0, 5).map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {rules.find(r => r.id === log.ruleId)?.name || log.ruleId}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.status}
                                            size="small"
                                            color={log.status === 'success' ? 'success' : 'error'}
                                            icon={log.status === 'success' ? <CheckCircle fontSize="small" /> : <Error fontSize="small" />}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {log.details}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {executionLogs.length > 5 && (
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Button size="small" onClick={() => console.log("View all logs")}>
                            View All Logs
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Rule Form Dialog */}
            <Dialog
                open={ruleDialogOpen}
                onClose={() => setRuleDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {mode === 'add' ? 'Create New Rule' : 'Edit Rule'}
                </DialogTitle>
                <DialogContent>
                    <RuleForm
                        rule={activeRule}
                        mode={mode}
                        onClose={() => setRuleDialogOpen(false)}
                        onSubmit={(data) => {
                            console.log("Submit rule:", data);
                            setRuleDialogOpen(false);
                        }}
                        conditionFields={conditionFields}
                        operators={operators}
                        actionTypes={actionTypes}
                        triggers={triggers}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Rule</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this rule? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        className="!text-white"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Test Rule Dialog */}
            <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Test Rule</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" paragraph>
                        Test the rule with sample data to verify its behavior.
                    </Typography>

                    <TextField
                        fullWidth
                        label="Sample Leave Duration (days)"
                        type="number"
                        defaultValue={2}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Employee Attendance Rating"
                        type="number"
                        defaultValue={95}
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Leave Type</InputLabel>
                        <Select label="Leave Type" defaultValue="CL">
                            {leaveTypes.map(lt => (
                                <MenuItem key={lt.id} value={lt.code}>
                                    {lt.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        fullWidth
                        className="!text-white"
                        onClick={() => {
                            console.log("Testing rule...");
                            setTestDialogOpen(false);
                        }}
                    >
                        Run Test
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Context Menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                {selectedMenuRule && (
                    <>
                        <MenuItem onClick={() => {
                            handleEditRule(selectedMenuRule);
                            handleMenuClose();
                        }}>
                            <Edit fontSize="small" sx={{ mr: 1 }} />
                            Edit Rule
                        </MenuItem>

                        <MenuItem onClick={handleCloneRule}>
                            <ContentCopy fontSize="small" sx={{ mr: 1 }} />
                            Clone Rule
                        </MenuItem>

                        <MenuItem onClick={() => {
                            handleToggleActive(selectedMenuRule.id, !selectedMenuRule.active);
                            handleMenuClose();
                        }}>
                            {selectedMenuRule.active ? (
                                <>
                                    <Stop fontSize="small" sx={{ mr: 1 }} />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <PlayArrow fontSize="small" sx={{ mr: 1 }} />
                                    Activate
                                </>
                            )}
                        </MenuItem>

                        <MenuItem onClick={handleTestRule}>
                            <Settings fontSize="small" sx={{ mr: 1 }} />
                            Test Rule
                        </MenuItem>

                        <MenuItem onClick={handleViewLogs}>
                            <Timeline fontSize="small" sx={{ mr: 1 }} />
                            View Logs
                        </MenuItem>

                        <MenuItem onClick={() => {
                            handleDeleteClick(selectedMenuRule.id);
                            handleMenuClose();
                        }} sx={{ color: 'error.main' }}>
                            <Delete fontSize="small" sx={{ mr: 1 }} />
                            Delete Rule
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );
};

// RuleForm Component
interface RuleFormProps {
    rule?: ILeaveRuleExtended | null;
    mode: 'add' | 'edit';
    onClose: () => void;
    onSubmit: (data: any) => void;
    conditionFields: any[];
    operators: any[];
    actionTypes: any[];
    triggers: any[];
}

const RuleForm: React.FC<RuleFormProps> = ({
    rule,
    mode,
    onClose,
    onSubmit,
    conditionFields,
    operators,
    actionTypes,
    triggers
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState(rule?.name || "");
    const [description, setDescription] = useState(rule?.description || "");
    const [priority, setPriority] = useState(rule?.priority || 1);
    const [scope, setScope] = useState<'Global' | 'Department' | 'Location' | 'EmployeeGroup'>(
        rule?.scope || "Global"
    );
    const [selectedTriggers, setSelectedTriggers] = useState<string[]>(rule?.triggers || []);
    const [conditions, setConditions] = useState<IRuleCondition[]>(rule?.conditions || []);
    const [actions, setActions] = useState<IRuleAction[]>(rule?.actions || []);
    const [executionOrder, setExecutionOrder] = useState(rule?.executionOrder || 1);

    const steps = ['Basic Info', 'Triggers', 'Conditions', 'Actions', 'Review'];

    const handleNext = () => {
        setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const handleAddCondition = () => {
        setConditions([...conditions, { field: '', operator: '', value: '' }]);
    };

    const handleConditionChange = (index: number, field: keyof IRuleCondition, value: any) => {
        const newConditions = [...conditions];
        newConditions[index] = { ...newConditions[index], [field]: value };
        setConditions(newConditions);
    };

    const handleRemoveCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };

    const handleAddAction = () => {
        setActions([...actions, { type: '', value: '' }]);
    };

    const handleActionChange = (index: number, field: keyof IRuleAction, value: any) => {
        const newActions = [...actions];
        newActions[index] = { ...newActions[index], [field]: value };
        setActions(newActions);
    };

    const handleRemoveAction = (index: number) => {
        setActions(actions.filter((_, i) => i !== index));
    };

    const formatCondition = (conditions: IRuleCondition[]): string => {
        return conditions.map((cond, index) => {
            let conditionStr = `${cond.field} ${cond.operator} ${cond.value}`;
            if (index > 0 && cond.logicalOperator) {
                conditionStr = `${cond.logicalOperator} ${conditionStr}`;
            }
            return conditionStr;
        }).join(' ');
    };

    const handleSubmit = () => {
        const ruleData: ILeaveRuleExtended = {
            id: mode === 'add' ? `RULE${Date.now()}` : rule?.id || '',
            name,
            description,
            priority,
            scope,
            triggers: selectedTriggers,
            conditions,
            actions,
            executionOrder,
            active: true,
            createdAt: mode === 'add' ? new Date().toISOString() : rule?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: rule?.createdBy || 'HR Manager',
            condition: formatCondition(conditions), // Add this to satisfy ILeaveRule interface
            action: actions.map(a => a.type).join(', ') // Add this to satisfy ILeaveRule interface
            ,
            executionCount: 0,
            errorCount: 0
        };
        onSubmit(ruleData);
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Rule Name *"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Priority"
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value))}
                                helperText="Lower number = higher priority"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Execution Order"
                                value={executionOrder}
                                onChange={(e) => setExecutionOrder(Number(e.target.value))}
                                helperText="Order within same priority"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Scope</InputLabel>
                                <Select
                                    value={scope}
                                    onChange={(e) => setScope(e.target.value as 'Global' | 'Department' | 'Location' | 'EmployeeGroup')}
                                    label="Scope"
                                >
                                    <MenuItem value="Global">Global</MenuItem>
                                    <MenuItem value="Department">Department</MenuItem>
                                    <MenuItem value="Location">Location</MenuItem>
                                    <MenuItem value="EmployeeGroup">Employee Group</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Select the events that will trigger this rule
                        </Typography>

                        <Autocomplete
                            multiple
                            options={triggers.map(t => t.value)}
                            getOptionLabel={(option) => triggers.find(t => t.value === option)?.label || option}
                            value={selectedTriggers}
                            onChange={(_, newValue) => setSelectedTriggers(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Triggers"
                                    placeholder="Select trigger events"
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    {triggers.find(t => t.value === option)?.label || option}
                                </li>
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option}
                                        label={triggers.find(t => t.value === option)?.label || option}
                                        size="small"
                                    />
                                ))
                            }
                        />
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Define the conditions that must be met for the rule to execute
                        </Typography>

                        {conditions.map((condition, index) => (
                            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Field</InputLabel>
                                            <Select
                                                value={condition.field}
                                                onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                                                label="Field"
                                            >
                                                {conditionFields.map((field) => (
                                                    <MenuItem key={field.value} value={field.value}>
                                                        {field.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Operator</InputLabel>
                                            <Select
                                                value={condition.operator}
                                                onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                                                label="Operator"
                                            >
                                                {operators.map((op) => (
                                                    <MenuItem key={op.value} value={op.value}>
                                                        {op.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Value"
                                            value={condition.value}
                                            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        {index > 0 && (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Logic</InputLabel>
                                                <Select
                                                    value={condition.logicalOperator || 'AND'}
                                                    onChange={(e) => handleConditionChange(index, 'logicalOperator', e.target.value)}
                                                    label="Logic"
                                                >
                                                    <MenuItem value="AND">AND</MenuItem>
                                                    <MenuItem value="OR">OR</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Grid>

                                    {conditions.length > 1 && (
                                        <Grid item xs={12} md={2}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveCondition(index)}
                                                fullWidth
                                            >
                                                Remove
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        ))}

                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddCondition}
                            sx={{ mt: 1 }}
                        >
                            Add Condition
                        </Button>
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Define the actions to take when conditions are met
                        </Typography>

                        {actions.map((action, index) => (
                            <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Action Type</InputLabel>
                                            <Select
                                                value={action.type}
                                                onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                                                label="Action Type"
                                            >
                                                {actionTypes.map((act) => (
                                                    <MenuItem key={act.value} value={act.value}>
                                                        {act.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Action Value/Parameters"
                                            value={action.value}
                                            onChange={(e) => handleActionChange(index, 'value', e.target.value)}
                                            helperText="Enter value or JSON parameters"
                                        />
                                    </Grid>

                                    {actions.length > 1 && (
                                        <Grid item xs={12} md={2}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveAction(index)}
                                                fullWidth
                                            >
                                                Remove
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        ))}

                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddAction}
                            sx={{ mt: 1 }}
                        >
                            Add Action
                        </Button>
                    </Box>
                );

            case 4:
                return (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Review Rule Configuration
                        </Typography>

                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {description}
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Priority
                                    </Typography>
                                    <Typography variant="body1">
                                        {priority} (Order: {executionOrder})
                                    </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Scope
                                    </Typography>
                                    <Typography variant="body1">{scope}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Triggers
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                        {selectedTriggers.map(trigger => (
                                            <Chip
                                                key={trigger}
                                                label={trigger}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Conditions
                                    </Typography>
                                    {conditions.map((cond, idx) => (
                                        <Typography key={idx} variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                                            {idx > 0 && cond.logicalOperator} {cond.field} {cond.operator} {cond.value}
                                        </Typography>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Actions
                                    </Typography>
                                    {actions.map((act, idx) => (
                                        <Chip
                                            key={idx}
                                            label={`${act.type}: ${act.value}`}
                                            size="small"
                                            sx={{ mr: 0.5, mt: 0.5 }}
                                        />
                                    ))}
                                </Grid>
                            </Grid>
                        </Paper>

                        <Alert severity="info">
                            <Typography variant="caption">
                                The rule will be saved and become active immediately. You can deactivate it later if needed.
                            </Typography>
                        </Alert>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {renderStepContent(index)}

                            <Box sx={{ mt: 2 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                    className="!text-white"
                                >
                                    {activeStep === steps.length - 1 ? 'Save Rule' : 'Next'}
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </>
    );
};

export default LeaveRulesEngine;