// TemplateManagement.tsx
"use client";

import React, { useState } from "react";
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
  DialogActions
} from "@mui/material";
import {
  Description,
  Add,
  ContentCopy,
  Settings,
  Download,
  Search,
  FilterList,
  Star,
  StarBorder
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";

import TemplateTable from "./TemplateTable";
import { createMockTemplates, IOfferLetterTemplate } from "./OfferLetterTypes";

const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<IOfferLetterTemplate[]>(createMockTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<IOfferLetterTemplate | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit' | 'preview'>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Calculate statistics
  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.isActive).length,
    totalUsed: templates.reduce((sum, template) => sum + template.usedCount, 0),
    mostUsed: templates.reduce((max, template) => 
      template.usedCount > max.usedCount ? template : max, templates[0] || { usedCount: 0 }
    )
  };

  // Handlers
  const handleAddNew = () => {
    setSelectedTemplate(undefined);
    setViewMode('add');
  };

  const handleEdit = (template: IOfferLetterTemplate) => {
    setSelectedTemplate(template);
    setViewMode('edit');
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

  const handlePreview = (template: IOfferLetterTemplate) => {
    setSelectedTemplate(template);
    setViewMode('preview');
  };

  const handleDuplicate = (template: IOfferLetterTemplate) => {
    const newTemplate: IOfferLetterTemplate = {
      ...template,
      id: `TPL-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usedCount: 0
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated successfully');
  };

  const handleStatusChange = (id: string, status: boolean) => {
    setTemplates(prev => prev.map(template =>
      template.id === id ? { ...template, isActive: status, updatedAt: new Date().toISOString() } : template
    ));
    toast.success(`Template ${status ? 'activated' : 'deactivated'} successfully`);
  };

  const handleExport = () => {
    // Export functionality
    toast.success('Templates exported successfully');
  };

  // For now, show list view only
  if (viewMode === 'list') {
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
              <li className="breadcrumb-item">
                <Link href="/owner/offers">Offer Letters</Link>
              </li>
              <li className="breadcrumb-item active">Templates</li>
            </ol>
          </nav>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              size="small"
            >
              Export
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
                Create and manage reusable offer letter templates
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4">{stats.totalTemplates}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Templates</Typography>
                  </Box>
                  <Description sx={{ fontSize: 40, color: 'primary.light' }} />
                </Box>
                <Chip
                  label={`${stats.activeTemplates} Active`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4">{stats.totalUsed}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Uses</Typography>
                  </Box>
                  <ContentCopy sx={{ fontSize: 40, color: 'info.light' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Across all templates
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4">{stats.mostUsed.usedCount}</Typography>
                    <Typography variant="caption" color="text.secondary">Most Used</Typography>
                  </Box>
                  <Star sx={{ fontSize: 40, color: 'warning.light' }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {stats.mostUsed.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4">{stats.activeTemplates}</Typography>
                    <Typography variant="caption" color="text.secondary">Active</Typography>
                  </Box>
                  <Settings sx={{ fontSize: 40, color: 'success.light' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                  <Chip label="Standard" size="small" />
                  <Chip label="Executive" size="small" />
                  <Chip label="Contractor" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alerts */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> Use variables like {"{{candidateName}}"} for dynamic content.

          </Typography>
        </Alert>

        {/* Main Table */}
        <TemplateTable
          data={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onDuplicate={handleDuplicate}
          onStatusChange={handleStatusChange}
        />

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
              <Star sx={{ color: 'info.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
                Template Best Practices
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
                <li>
                  <Typography variant="body2">
                    <strong>Consistent Branding:</strong> Use company logos, colors, and formatting
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Clear Variables:</strong> Define all placeholders clearly.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Legal Compliance:</strong> Include all required legal clauses and disclosures
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Mobile Responsive:</strong> Ensure templates look good on all devices
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Version Control:</strong> Keep track of template versions and updates
                  </Typography>
                </li>
              </Box>
            </Box>
          </Box>
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
                <strong>Important:</strong> Deleting this template will not affect existing offers created from it.
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
      </div>
    );
  }

  // Add/Edit template view would go here
  return null;
};

export default TemplateManagement;