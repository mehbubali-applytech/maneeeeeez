// DocumentsTab.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Description,
  CloudUpload,
  Delete,
  Visibility,
  Download,
  CheckCircle,
  Error,
  Add,
  Search,
  FilterList,
  VerifiedUser
} from "@mui/icons-material";
import { useFormContext, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { IDocument, ID_PROOF_TYPES } from "../EmployeeTypes";

const DocumentsTab: React.FC = () => {
  const { control, watch, setValue } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  
 const watchedDocuments = watch('documents');
const watchedNewDocuments = watch('newDocuments');

const documents = useMemo(
  () => watchedDocuments || [],
  [watchedDocuments]
);

const newDocuments = useMemo(
  () => watchedNewDocuments || [],
  [watchedNewDocuments]
);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      uploaded: false
    }));
    
    setValue('newDocuments', [...newDocuments, ...acceptedFiles]);
    
    // Simulate upload progress
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        
        // Convert uploaded files to documents
        const newDocs: IDocument[] = files.map(file => ({
          id: file.id,
          type: 'Other',
          fileName: file.file.name,
          fileUrl: file.preview,
          fileSize: file.file.size,
          uploadedDate: new Date().toISOString(),
          verified: false
        }));
        
        setValue('documents', [...documents, ...newDocs]);
        setValue('newDocuments', []);
      }
    }, 200);
  }, [documents, newDocuments, setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const handleDeleteDocument = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      const updatedDocuments = documents.filter((doc: IDocument) => doc.id !== documentToDelete);
      setValue('documents', updatedDocuments);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

const handleDownload = (doc: IDocument) => {
  const link = window.document.createElement('a');
  link.href = doc.fileUrl;
  link.download = doc.fileName;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
};


  const handleVerifyDocument = (id: string) => {
    const updatedDocuments = documents.map((doc: IDocument) => 
      doc.id === id ? { ...doc, verified: !doc.verified } : doc
    );
    setValue('documents', updatedDocuments);
  };

  const handleUpdateDocumentType = (id: string, type: string, documentType?: string, documentNumber?: string) => {
    const updatedDocuments = documents.map((doc: IDocument) => 
      doc.id === id ? { 
        ...doc, 
        type: type as any,
        documentType: documentType as any,
        documentNumber 
      } : doc
    );
    setValue('documents', updatedDocuments);
  };

  const filteredDocuments = documents.filter((doc: IDocument) => {
    const matchesSearch = 
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.documentNumber && doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      filterType === "All" || 
      doc.type === filterType ||
      (filterType === "ID Proof" && doc.type === "ID Proof");
    
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return '🖼️';
    } else if (extension === 'pdf') {
      return '📄';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return '📝';
    }
    return '📎';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Description sx={{ mr: 1 }} />
        Documents & Attachments
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Upload & ID Proof */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Upload Area */}
            <Paper
              {...getRootProps()}
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                bgcolor: isDragActive ? 'primary.light' : 'grey.50',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light'
                }
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or click to browse files
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports JPG, PNG, PDF, DOC (Max 5MB per file)
              </Typography>
              
              {uploading && (
                <Box sx={{ mt: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Uploading... {uploadProgress}%
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* ID Proof Section */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                ID Proof Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>ID Proof Type</InputLabel>
                    <Select
                      value=""
                      label="ID Proof Type"
                      onChange={(e) => {
                        const type = e.target.value;
                        if (type) {
                          // Find or create ID proof document
                          const existingIdProof = documents.find((doc: IDocument) => doc.type === 'ID Proof');
                          if (!existingIdProof) {
                            const newDoc: IDocument = {
                              id: Math.random().toString(36).substr(2, 9),
                              type: 'ID Proof',
                              documentType: type as any,
                              fileName: `${type} Document`,
                              fileUrl: '',
                              fileSize: 0,
                              uploadedDate: new Date().toISOString(),
                              verified: false
                            };
                            setValue('documents', [...documents, newDoc]);
                          }
                        }
                      }}
                    >
                      <MenuItem value="">Select ID Type</MenuItem>
                      {ID_PROOF_TYPES.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="ID Proof Number"
                    placeholder="e.g., ABCD1234XYZ"
                    onChange={(e) => {
                      // Update ID proof document number if exists
                      const idProof = documents.find((doc: IDocument) => doc.type === 'ID Proof');
                      if (idProof) {
                        handleUpdateDocumentType(
                          idProof.id,
                          'ID Proof',
                          idProof.documentType,
                          e.target.value
                        );
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  ID proofs are required for payroll and compliance purposes.
                </Typography>
              </Alert>
            </Paper>

            {/* Required Documents Checklist */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Required Documents Checklist
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { type: 'ID Proof', label: 'Government ID Proof', required: true },
                  { type: 'Offer Letter', label: 'Offer Letter', required: true },
                  { type: 'Joining Form', label: 'Joining Form', required: true },
                  { type: 'Other', label: 'PAN Card', required: true },
                  { type: 'Other', label: 'Bank Passbook', required: true },
                  { type: 'Other', label: 'Educational Certificates', required: false }
                ].map((doc, index) => {
                  const hasDocument = documents.some((d: IDocument) => 
                    (doc.type === 'Other' && d.fileName.toLowerCase().includes(doc.label.toLowerCase())) ||
                    d.type === doc.type
                  );
                  
                  return (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: hasDocument ? 'success.light' : 'grey.50',
                      borderRadius: 1
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {hasDocument ? (
                          <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                        ) : (
                          <Error sx={{ color: doc.required ? 'error.main' : 'warning.main', fontSize: 16 }} />
                        )}
                        <Typography variant="body2">
                          {doc.label}
                        </Typography>
                        {doc.required && (
                          <Chip label="Required" size="small" color="error" variant="outlined" />
                        )}
                      </Box>
                      {!hasDocument && doc.required && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            // Trigger file upload for missing document
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
                            input.onchange = (e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                onDrop([file]);
                              }
                            };
                            input.click();
                          }}
                        >
                          Upload
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right Column - Document List */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search & Filter */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                  />
                </Box>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="All">All Types</MenuItem>
                    <MenuItem value="ID Proof">ID Proof</MenuItem>
                    <MenuItem value="Offer Letter">Offer Letter</MenuItem>
                    <MenuItem value="Joining Form">Joining Form</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            {/* Documents Summary */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Documents ({filteredDocuments.length})
                </Typography>
                <Chip 
                  label={`${documents.filter((d: IDocument) => d.verified).length} Verified`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>

              {filteredDocuments.length === 0 ? (
                <Alert severity="info">
                  No documents uploaded yet. Drag and drop files or use the upload area.
                </Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Document</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Uploaded</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDocuments.map((document: IDocument) => (
                        <TableRow key={document.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">
                                {getDocumentIcon(document.fileName)}
                              </Typography>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {document.fileName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(document.fileSize)}
                                  {document.documentNumber && ` • ${document.documentNumber}`}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={document.type}
                              size="small"
                              color={
                                document.type === 'ID Proof' ? 'primary' :
                                document.type === 'Offer Letter' ? 'success' :
                                document.type === 'Joining Form' ? 'warning' : 'default'
                              }
                              variant="outlined"
                            />
                            {document.documentType && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {document.documentType}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(document.uploadedDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={document.verified ? "Verified" : "Pending Verification"}>
                              <IconButton
                                size="small"
                                onClick={() => handleVerifyDocument(document.id)}
                                color={document.verified ? "success" : "default"}
                              >
                                {document.verified ? (
                                  <VerifiedUser fontSize="small" />
                                ) : (
                                  <Error fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(document.fileUrl, '_blank')}
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownload(document)}
                                >
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteDocument(document.id)}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

            {/* Document Statistics */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Document Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color="primary">
                      {documents.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Documents
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color="success.main">
                      {documents.filter((d: IDocument) => d.verified).length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Verified
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4">
                      {documents.filter((d: IDocument) => d.type === 'ID Proof').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID Proofs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4">
                      {Math.round(documents.reduce((sum: number, d: IDocument) => sum + d.fileSize, 0) / (1024 * 1024))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MB Total Size
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Tips */}
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Best Practices:</strong>
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                <li>
                  <Typography variant="caption">
                    Upload clear, legible copies of all documents
                  </Typography>
                </li>
                <li>
                  <Typography variant="caption">
                    Keep file sizes under 2MB for faster processing
                  </Typography>
                </li>
                <li>
                  <Typography variant="caption">
                    Verify all documents after upload
                  </Typography>
                </li>
                <li>
                  <Typography variant="caption">
                    Required documents are marked with red badges
                  </Typography>
                </li>
              </Box>
            </Alert>
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this document? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsTab;