"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Chip,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    Description,
    ContentCopy,
    Preview,
    Star,
    StarBorder,
    Search,
    FilterList
} from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { createMockTemplates } from "../../OfferLetterTypes";

interface TemplateSelectionTabProps {
    selectedTemplate: string;
    onSelectTemplate: (templateId: string) => void;
}

const TemplateSelectionTab: React.FC<TemplateSelectionTabProps> = ({
    selectedTemplate,
    onSelectTemplate
}) => {
    const { setValue } = useFormContext();
    const [templates] = useState(createMockTemplates());
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [activeTab, setActiveTab] = useState(0);
    const [customContent, setCustomContent] = useState("");
    const { watch } = useFormContext();
    const candidateName = watch("candidateName");


    // Filter templates
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || template.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Categories for filter
    const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];

    // Sample template preview
    const sampleVariables = {
        candidateName: "John Doe",
        position: "Software Engineer",
        companyName: "Our Company",
        joiningDate: "15 March 2024",
        salary: "₹12,00,000",
        ctc: "₹15,00,000",
        location: "Bangalore"
    };

    const renderTemplatePreview = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (!template) return null;

        let preview = template.content;
        Object.entries(sampleVariables).forEach(([key, value]) => {
            preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        return preview;
    };

    const handleUseTemplate = (templateId: string) => {
        onSelectTemplate(templateId);
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setValue('customContent', template.content);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Select Offer Letter Template
            </Typography>

            <Grid container spacing={3}>
                {/* Left Column - Template Selection */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                Available Templates
                            </Typography>

                            {/* Search and Filter */}
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    size="small"
                                    InputProps={{
                                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <FormControl fullWidth size="small">
                                    <InputLabel>Filter by Category</InputLabel>
                                    <Select
                                        value={categoryFilter}
                                        label="Filter by Category"
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Tabs */}
                            <Tabs
                                value={activeTab}
                                onChange={(e, newValue) => setActiveTab(newValue)}
                                variant="fullWidth"
                                sx={{ mb: 2 }}
                            >
                                <Tab label="All Templates" />
                                <Tab label="Favorites" />
                                <Tab label="Recently Used" />
                            </Tabs>

                            {/* Templates List */}
                            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {filteredTemplates.length > 0 ? (
                                    filteredTemplates.map((template) => (
                                        <Card
                                            key={template.id}
                                            sx={{
                                                mb: 2,
                                                border: selectedTemplate === template.id ? '2px solid' : '1px solid',
                                                borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                                                cursor: 'pointer',
                                                '&:hover': { borderColor: 'primary.light' }
                                            }}
                                            onClick={() => handleUseTemplate(template.id)}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {template.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {template.description}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={template.category}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Used {template.usedCount} times
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton size="small">
                                                            <StarBorder fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small">
                                                            <ContentCopy fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            No templates found. Try a different search.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Custom Template Option */}
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    {`Don't`} see what you need?
                                </Typography>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        onSelectTemplate('');
                                        setCustomContent('');
                                    }}
                                >
                                    Start with Blank Template
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Preview & Customization */}
                <Grid item xs={12} md={7}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                {selectedTemplate ? 'Template Preview' : 'Custom Template'}
                            </Typography>

                            {selectedTemplate ? (
                                <>
                                    {/* Template Preview */}
                                    <Box sx={{
                                        p: 3,
                                        bgcolor: 'grey.50',
                                        borderRadius: 1,
                                        minHeight: '400px',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        mb: 2
                                    }}>
                                        <div dangerouslySetInnerHTML={{
                                            __html: renderTemplatePreview(selectedTemplate)?.replace(/\n/g, '<br/>') || ''
                                        }} />
                                    </Box>

                                    {/* Template Variables */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Available Variables:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {templates.find(t => t.id === selectedTemplate)?.variables.map((variable) => (
                                                <Chip
                                                    key={variable}
                                                    label={`{{${variable}}}`}
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        const currentContent = customContent || templates.find(t => t.id === selectedTemplate)?.content || '';
                                                        setCustomContent(currentContent + ` {{${variable}}}`);
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Customization Options */}
                                    <Typography variant="subtitle2" gutterBottom>
                                        Customize Template:
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        value={customContent || templates.find(t => t.id === selectedTemplate)?.content || ''}
                                        onChange={(e) => setCustomContent(e.target.value)}
                                        placeholder="Customize the template content here..."
                                        sx={{ mb: 2 }}
                                    />
                                </>
                            ) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        Create Custom Template
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Start with a blank template and create your own custom offer letter.
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={12}
                                        value={customContent}
                                        onChange={(e) => setCustomContent(e.target.value)}
                                        placeholder="Enter your custom offer letter template here...

You can use variables like:
{{candidateName}} - Candidate's full name
{{position}} - Job position
{{companyName}} - Your company name
{{joiningDate}} - Expected joining date
{{salary}} - Annual salary
{{ctc}} - Cost to Company
{{location}} - Work location

Example:
Dear {{candidateName}},

We are pleased to offer you the position of {{position}} at {{companyName}}..."
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                            )}

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Preview />}
                                    onClick={() => {
                                        // Preview logic
                                        console.log('Preview template');
                                    }}
                                >
                                    Preview
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (selectedTemplate || customContent) {
                                            setValue('customContent', customContent || templates.find(t => t.id === selectedTemplate)?.content || '');
                                        }
                                    }}
                                >
                                    Use This Template
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tips */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'info.dark' }}>
                    <strong>💡 Tip:</strong> Use variables like {"{{candidateName}}"} for dynamic content.

                    Templates ensure consistency and save time when creating multiple offers.
                </Typography>
            </Box>
        </Box>
    );
};

export default TemplateSelectionTab;