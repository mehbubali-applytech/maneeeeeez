"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Button,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton
} from "@mui/material";
import {
    Add,
    Description,
    Download,
    Edit,
    Preview,
    ContentCopy,
    Delete,
    Share,
    History,
    HelpOutline,
    FormatListBulleted,
    Send,
    Person
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";

// Import components
import OfferLetterTemplatesTable from "./OfferLetterTemplatesTable";
import AddEditOfferLetterTemplate from "./AddEditOfferLetterTemplate";
import CreateOfferLetter from "./CreateOfferLetter";
import TemplatePreview from "./TemplatePreview";
import { IOfferLetterTemplate, ITemplateVersion, generateMockTemplates } from "./OfferLetterTypes";
import { Table } from "lucide-react";

const OfferLetterMainArea: React.FC = () => {
    // State
    const [templates, setTemplates] = useState<IOfferLetterTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<IOfferLetterTemplate | undefined>(undefined);
    const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit' | 'preview'>('list');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [previewData, setPreviewData] = useState<any>(null);
    const [createOfferOpen, setCreateOfferOpen] = useState(false);
    const [offerLetters, setOfferLetters] = useState<any[]>([]);

    // Load mock data
    useEffect(() => {
        setTemplates(generateMockTemplates());
    }, []);

    // Calculate statistics
    const stats = useMemo(() => {
        const activeTemplates = templates.filter(t => t.isActive);
        const totalVersions = templates.reduce((sum, template) => sum + template.versions.length, 0);
        const draftTemplates = templates.filter(t => t.status === 'Draft');
        const publishedTemplates = templates.filter(t => t.status === 'Published');

        return {
            totalTemplates: templates.length,
            activeTemplates: activeTemplates.length,
            totalVersions,
            draftTemplates: draftTemplates.length,
            publishedTemplates: publishedTemplates.length,
            usageCount: templates.reduce((sum, t) => sum + t.usageCount, 0)
        };
    }, [templates]);

    // Tab configuration
    const tabs = [
        {
            label: "All Templates",
            icon: <FormatListBulleted />,
            count: stats.totalTemplates
        },
        {
            label: "Active",
            icon: <Description />,
            count: stats.activeTemplates
        },
        {
            label: "Draft",
            icon: <Edit />,
            count: stats.draftTemplates
        },
        {
            label: "Published",
            icon: <Download />,
            count: stats.publishedTemplates
        }
    ];

    // Filtered templates based on active tab
    const filteredTemplates = useMemo(() => {
        let filtered = [...templates];

        switch (activeTab) {
            case 1: // Active
                filtered = filtered.filter(t => t.isActive);
                break;
            case 2: // Draft
                filtered = filtered.filter(t => t.status === 'Draft');
                break;
            case 3: // Published
                filtered = filtered.filter(t => t.status === 'Published');
                break;
            default: // All
                filtered = filtered;
        }

        return filtered;
    }, [templates, activeTab]);

    // Handlers
    const handleAddNew = () => {
        setSelectedTemplate(undefined);
        setViewMode('add');
    };

    const handleEdit = (template: IOfferLetterTemplate) => {
        setSelectedTemplate(template);
        setViewMode('edit');
    };

    const handlePreview = (template: IOfferLetterTemplate) => {
        setSelectedTemplate(template);
        setPreviewData(generatePreviewData(template));
        setViewMode('preview');
    };

    const handleDuplicate = (template: IOfferLetterTemplate) => {
        const newTemplate: IOfferLetterTemplate = {
            ...template,
            id: `TEMP${Date.now()}`,
            name: `${template.name} (Copy)`,
            code: `${template.code}-COPY`,
            status: 'Draft',
            versions: [{
                ...template.versions[0],
                id: `VER${Date.now()}`,
                version: 1,
                status: 'Draft',
                createdAt: new Date().toISOString()
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setTemplates(prev => [...prev, newTemplate]);
        toast.success('Template duplicated successfully');
    };

    const handleDelete = (id: string) => {
        setTemplateToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (templateToDelete) {
            setTemplates(prev => prev.filter(template => template.id !== templateToDelete));
            toast.success('Template deleted successfully');
            setDeleteDialogOpen(false);
            setTemplateToDelete(null);
        }
    };

    const handleStatusChange = (id: string, status: 'Active' | 'Inactive') => {
        setTemplates(prev => prev.map(template =>
            template.id === id ? {
                ...template,
                isActive: status === 'Active',
                updatedAt: new Date().toISOString()
            } : template
        ));
        toast.success(`Template ${status === 'Active' ? 'activated' : 'deactivated'} successfully`);
    };

    const handlePublish = (id: string) => {
        setTemplates(prev => prev.map(template =>
            template.id === id ? {
                ...template,
                status: 'Published',
                versions: template.versions.map((v, i) =>
                    i === 0 ? { ...v, status: 'Published' } : v
                ),
                updatedAt: new Date().toISOString()
            } : template
        ));
        toast.success('Template published successfully');
    };

    const handleSaveTemplate = async (data: any) => {
        // In real app, would make API call
        if (viewMode === 'add') {
            const newTemplate: IOfferLetterTemplate = {
                id: `TEMP${Date.now()}`,
                ...data,
                versions: [{
                    id: `VER${Date.now()}`,
                    version: 1,
                    content: data.content || '',
                    variables: data.variables || [],
                    status: 'Draft',
                    createdAt: new Date().toISOString(),
                    createdBy: 'Admin'
                }],
                usageCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setTemplates(prev => [...prev, newTemplate]);
            toast.success('Template created successfully');
        } else if (viewMode === 'edit' && selectedTemplate) {
            const updatedTemplate = {
                ...selectedTemplate,
                ...data,
                updatedAt: new Date().toISOString(),
                versions: selectedTemplate.versions.map((v, i) =>
                    i === 0 ? { ...v, content: data.content || v.content } : v
                )
            };
            setTemplates(prev => prev.map(t =>
                t.id === selectedTemplate.id ? updatedTemplate : t
            ));
            toast.success('Template updated successfully');
        }

        setViewMode('list');
        return Promise.resolve();
    };

    const handleExportAll = () => {
        const csvContent = [
            ['Template Name', 'Code', 'Department', 'Status', 'Usage Count', 'Last Updated'],
            ...templates.map(template => [
                template.name,
                template.code,
                template.department || 'All',
                template.status,
                template.usageCount.toString(),
                new Date(template.updatedAt).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offer_letter_templates_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast.success('Templates exported successfully');
    };

    const handleCreateOffer = async (offerLetterData: any) => {
        // In real app, this would be an API call
        const newOfferLetter = {
            id: `OFFER${Date.now()}`,
            ...offerLetterData
        };
        setOfferLetters(prev => [...prev, newOfferLetter]);

        // Update template usage count
        setTemplates(prev => prev.map(template =>
            template.id === offerLetterData.templateId
                ? {
                    ...template,
                    usageCount: template.usageCount + 1,
                    lastUsedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                : template
        ));

        return Promise.resolve();
    };

    const generatePreviewData = (template: IOfferLetterTemplate) => {
        return {
            candidateName: "John Doe",
            position: template.position || "Software Engineer",
            department: template.department || "Engineering",
            startDate: new Date().toISOString().split('T')[0],
            salary: "₹12,00,000 per annum",
            location: "Bangalore, India",
            reportingManager: "Sarah Johnson",
            employeeId: "EMP2024001",
            offerDate: new Date().toISOString().split('T')[0]
        };
    };

    const mockCandidates = [
        {
            id: "CAND001",
            name: "John Smith",
            email: "john.smith@example.com",
            position: "Senior Software Engineer",
            department: "Engineering",
            status: "Interviewed"
        },
        {
            id: "CAND002",
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            position: "Product Manager",
            department: "Product",
            status: "Interviewed"
        },
        {
            id: "CAND003",
            name: "Michael Chen",
            email: "michael.chen@example.com",
            position: "UX Designer",
            department: "Design",
            status: "Interviewed"
        }
    ];

    // Render based on view mode
    if (viewMode === 'add' || viewMode === 'edit') {
        return (
            <AddEditOfferLetterTemplate
                template={selectedTemplate}
                mode={viewMode}
                onSave={handleSaveTemplate}
                onCancel={() => setViewMode('list')}
            />
        );
    }

    if (viewMode === 'preview' && selectedTemplate) {
        return (
            <TemplatePreview
                template={selectedTemplate}
                previewData={previewData}
                onClose={() => setViewMode('list')}
                onDownload={() => {
                    toast.success('Template downloaded');
                    // Download logic here
                }}
                onGenerate={() => {
                    toast.success('Offer letter generated');
                    // Generate logic here
                }}
            />
        );
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
                        <li className="breadcrumb-item active">Offer Letter Templates</li>
                    </ol>
                </nav>

                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        startIcon={<Description />}
                        onClick={() => setCreateOfferOpen(true)}
                        size="small"
                    >
                        Create Offer
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleExportAll}
                        size="small"
                    >
                        Export All
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddNew}
                        size="small"
                        className="!text-white"
                    >
                        New Template
                    </Button>
                </div>
            </div>

                            {/* Quick Actions Footer */}
                <Paper sx={{ p: 2, mt: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddNew}
                            size="small"
                        >
                            Create New Template
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={handleExportAll}
                            size="small"
                        >
                            Export Templates
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ContentCopy />}
                            onClick={() => {
                                // Bulk duplicate
                                toast.info('Select templates to duplicate');
                            }}
                            size="small"
                        >
                            Bulk Duplicate
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<History />}
                            onClick={() => {
                                // View history
                                toast.info('Template history');
                            }}
                            size="small"
                        >
                            View History
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={() => setCreateOfferOpen(true)}
                            size="small"
                            className="!text-white"
                        >
                            Create Offer
                        </Button>
                    </Box>
                </Paper>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <Description sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                            Offer Letter Templates
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Create, manage, and customize offer letter templates for different roles
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4">{stats.totalTemplates}</Typography>
                                    <Typography variant="caption" color="text.secondary">Total Templates</Typography>
                                </Box>
                                <FormatListBulleted sx={{ fontSize: 40, color: 'primary.light' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4">{stats.activeTemplates}</Typography>
                                    <Typography variant="caption" color="text.secondary">Active</Typography>
                                </Box>
                                <Description sx={{ fontSize: 40, color: 'success.light' }} />
                            </Box>
                            <Chip
                                label={`${stats.draftTemplates} Draft`}
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4">{stats.totalVersions}</Typography>
                                    <Typography variant="caption" color="text.secondary">Total Versions</Typography>
                                </Box>
                                <History sx={{ fontSize: 40, color: 'info.light' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4">{stats.usageCount}</Typography>
                                    <Typography variant="caption" color="text.secondary">Times Used</Typography>
                                </Box>
                                <Download sx={{ fontSize: 40, color: 'warning.light' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4">{stats.publishedTemplates}</Typography>
                                    <Typography variant="caption" color="text.secondary">Published</Typography>
                                </Box>
                                <Share sx={{ fontSize: 40, color: 'secondary.light' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4">5</Typography>
                                    <Typography variant="caption" color="text.secondary">Departments</Typography>
                                </Box>
                                <HelpOutline sx={{ fontSize: 40, color: 'grey.400' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            icon={tab.icon}
                            iconPosition="start"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tab.label}
                                    <Chip label={tab.count} size="small" />
                                </Box>
                            }
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Main Table */}
            <OfferLetterTemplatesTable
                data={filteredTemplates}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onDuplicate={handleDuplicate}
                onStatusChange={handleStatusChange}
                onPublish={handlePublish}
            />

            {/* Created Offer Letters Section */}
            {offerLetters.length > 0 && (
                <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Recent Offer Letters ({offerLetters.length})
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Candidate</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Template</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {offerLetters.slice(0, 5).map((offer) => (
                                    <TableRow key={offer.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Person sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                                                <Box>
                                                    <Typography variant="body2">{offer.candidateName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {offer.candidateEmail}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{offer.position}</TableCell>
                                        <TableCell>
                                            {templates.find(t => t.id === offer.templateId)?.name || offer.templateId}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={offer.status}
                                                size="small"
                                                color={
                                                    offer.status === 'Accepted' ? 'success' :
                                                        offer.status === 'Sent' ? 'info' :
                                                            offer.status === 'Rejected' ? 'error' : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(offer.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small">
                                                <Preview fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <Download fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small">
                                                <Send fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {offerLetters.length > 5 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                size="small"
                                component={Link}
                                href="/offer-letters"
                            // In real app, create an offer letters management page
                            >
                                View All Offer Letters
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}

            {/* Tips Section */}
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
                {/* Tips Section */}
                <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'info.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <HelpOutline sx={{ color: 'info.main' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
                                Best Practices for Offer Letter Templates
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
                                <li>
                                    <Typography variant="body2">
                                        <strong>Use Variables:</strong> Use placeholders like &#123;&#123;candidateName&#125;&#125;, &#123;&#123;position&#125;&#125; for easy customization
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        <strong>Department Specific:</strong> Create different templates for Engineering, Sales, HR departments
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        <strong>Version Control:</strong> Always create new versions instead of editing published templates
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        <strong>Legal Compliance:</strong> Include all required legal clauses and disclaimers
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        <strong>Preview Always:</strong> Preview templates with sample data before publishing
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="body2">
                                        <strong>Access Control:</strong> Restrict sensitive templates to authorized users only
                                    </Typography>
                                </li>
                            </Box>
                        </Box>
                    </Box>
                </Paper>


            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Template</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this template? This action cannot be undone.
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>Note:</strong> Deleting this template will remove all versions and cannot be recovered.
                            Consider archiving instead.
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Delete Permanently
                    </Button>
                </DialogActions>
            </Dialog>
            {createOfferOpen && (
                <CreateOfferLetter
                    templates={templates}
                    candidates={mockCandidates}
                    onClose={() => setCreateOfferOpen(false)}
                    onSave={handleCreateOffer}
                />
            )}

        </div >
    );
};

export default OfferLetterMainArea;