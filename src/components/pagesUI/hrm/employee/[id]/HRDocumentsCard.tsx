// Enhanced HRDocumentsCard.tsx with proper expiration logic
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { IHREmployee } from '../HREmployeeTypes';
import { 
  FileText, Upload, Eye, Download, 
  CheckCircle, AlertCircle, Clock, Shield,
  Search, Filter, X, FileCheck, FileX,
  Calendar, AlertTriangle, RefreshCw
} from 'lucide-react';
import { formatDate } from '../../../owner/employees/[id]/formatters';

interface IDocumentWithExpiry {
  id: string;
  type: "ID Proof" | "Offer Letter" | "Joining Form" | "Other" | "Education" | "Employment" | "Legal";
  documentType?: "Aadhaar" | "PAN" | "Passport" | "Driving License" | "Degree" | "Experience" | "Contract";
  documentNumber?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedDate: string;
  verified: boolean;
  expiryDate?: string; // Add expiry date
  daysUntilExpiry?: number;
  isExpired?: boolean;
}

interface HRDocumentsCardProps {
  employee: IHREmployee;
  onUpload: (files: File[]) => void;
  onView: (document: any) => void;
  onVerify: (documentId: string) => void;
  onRenew?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
}

const HRDocumentsCard: React.FC<HRDocumentsCardProps> = ({ 
  employee, 
  onUpload,
  onView,
  onVerify,
  onRenew,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [dragOver, setDragOver] = useState(false);
  const [documents, setDocuments] = useState<IDocumentWithExpiry[]>([]);

  // Calculate expiry status for documents
  const calculateExpiryStatus = (docs: IDocumentWithExpiry[]) => {
    const today = new Date();
    
    return docs.map(doc => {
      if (!doc.expiryDate) {
        return { ...doc, isExpired: false, daysUntilExpiry: undefined };
      }
      
      const expiryDate = new Date(doc.expiryDate);
      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const isExpired = daysUntilExpiry < 0;
      
      return { ...doc, isExpired, daysUntilExpiry: Math.abs(daysUntilExpiry) };
    });
  };

  // Initialize documents with expiry data
  useEffect(() => {
    // Add mock expiry dates for demonstration
    const docsWithExpiry: IDocumentWithExpiry[] = employee.documents.map((doc, index) => ({
      ...doc,
      expiryDate: getExpiryDateForDocument(doc, index),
    }));
    
    const docsWithExpiryStatus = calculateExpiryStatus(docsWithExpiry);
    setDocuments(docsWithExpiryStatus);
  }, [employee.documents]);

  // Helper function to assign expiry dates based on document type
  const getExpiryDateForDocument = (doc: any, index: number) => {
    const today = new Date();
    
    switch(doc.documentType) {
      case 'Passport':
        // Passport expires in 10 years
        return new Date(today.getFullYear() + 10, today.getMonth(), today.getDate()).toISOString();
      case 'Driving License':
        // Driving license expires in 20 years
        return new Date(today.getFullYear() + 20, today.getMonth(), today.getDate()).toISOString();
      case 'PAN':
        // PAN doesn't expire (in India)
        return undefined;
      case 'Aadhaar':
        // Aadhaar doesn't expire
        return undefined;
      default:
        // For demo purposes, some documents are already expired
        if (index % 4 === 0) {
          return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString();
        } else if (index % 4 === 1) {
          return new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString();
        }
        return undefined;
    }
  };

  // Document categories for HR
  const documentCategories = [
    { value: 'All', label: 'All Documents', count: documents.length },
    { value: 'ID Proof', label: 'ID Proof', count: documents.filter(d => d.type === 'ID Proof').length },
    { value: 'Education', label: 'Education', count: documents.filter(d => d.type === 'Education').length },
    { value: 'Employment', label: 'Employment', count: documents.filter(d => d.type === 'Employment').length },
    { value: 'Legal', label: 'Legal', count: documents.filter(d => d.type === 'Legal').length },
    { value: 'Other', label: 'Other', count: documents.filter(d => d.type === 'Other').length },
  ];

  const statusFilters = [
    { value: 'All', label: 'All Status', color: 'gray', count: documents.length },
    { value: 'Verified', label: 'Verified', color: 'green', count: documents.filter(d => d.verified).length },
    { value: 'Pending', label: 'Pending', color: 'yellow', count: documents.filter(d => !d.verified).length },
    { value: 'Expired', label: 'Expired', color: 'red', count: documents.filter(d => d.isExpired).length },
    { value: 'Expiring Soon', label: 'Expiring Soon', color: 'orange', count: documents.filter(d => 
      !d.isExpired && d.daysUntilExpiry && d.daysUntilExpiry <= 30
    ).length },
  ];

  // Enhanced mandatory documents with expiry tracking
  const mandatoryDocuments = [
    { 
      type: 'PAN Card', 
      status: documents.find(d => d.documentType === 'PAN') ? 'Submitted' : 'Missing', 
      required: true,
      expiryInfo: 'Never expires',
      badgeColor: 'green'
    },
    { 
      type: 'Aadhaar Card', 
      status: 'Submitted', 
      required: true,
      expiryInfo: 'Never expires',
      badgeColor: 'green'
    },
    { 
      type: 'Passport', 
      status: documents.find(d => d.documentType === 'Passport') ? 'Submitted' : 'Not Required', 
      required: false,
      expiryInfo: documents.find(d => d.documentType === 'Passport')?.expiryDate 
        ? `Expires ${formatDate(documents.find(d => d.documentType === 'Passport')!.expiryDate!)}`
        : 'Not submitted',
      badgeColor: documents.find(d => d.documentType === 'Passport')?.isExpired ? 'red' : 'gray'
    },
    { 
      type: 'Address Proof', 
      status: 'Submitted', 
      required: true,
      expiryInfo: 'Valid indefinitely',
      badgeColor: 'green'
    },
    { 
      type: 'Educational Certificates', 
      status: 'Submitted', 
      required: true,
      expiryInfo: 'Never expires',
      badgeColor: 'green'
    },
    { 
      type: 'Previous Employment', 
      status: 'Pending', 
      required: true,
      expiryInfo: 'N/A',
      badgeColor: 'yellow'
    },
    { 
      type: 'Bank Proof', 
      status: 'Submitted', 
      required: true,
      expiryInfo: 'Valid while account active',
      badgeColor: 'green'
    },
    { 
      type: 'Medical Certificate', 
      status: documents.find(d => d.type === 'Legal' && d.fileName.includes('Medical')) ? 'Submitted' : 'Missing', 
      required: false,
      expiryInfo: documents.find(d => d.type === 'Legal' && d.fileName.includes('Medical'))?.expiryDate
        ? `Expires ${formatDate(documents.find(d => d.type === 'Legal' && d.fileName.includes('Medical'))!.expiryDate!)}`
        : 'Not submitted',
      badgeColor: documents.find(d => d.type === 'Legal' && d.fileName.includes('Medical'))?.isExpired ? 'red' : 'gray'
    },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'Verified') {
      matchesStatus = doc.verified;
    } else if (filterStatus === 'Pending') {
      matchesStatus = !doc.verified;
    } else if (filterStatus === 'Expired') {
      matchesStatus = doc.isExpired === true;
    } else if (filterStatus === 'Expiring Soon') {
      matchesStatus =
  !doc.isExpired &&
  typeof doc.daysUntilExpiry === 'number' &&
  doc.daysUntilExpiry <= 30;

    }
    
    const matchesType = filterType === 'All' || doc.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      default: return '📎';
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getExpiryBadge = (doc: IDocumentWithExpiry) => {
    if (!doc.expiryDate) {
      return null;
    }
    
    if (doc.isExpired) {
      return (
        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Expired
        </span>
      );
    }
    
    if (doc.daysUntilExpiry && doc.daysUntilExpiry <= 30) {
      return (
        <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Expires in {doc.daysUntilExpiry} days
        </span>
      );
    }
    
    return (
      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        Valid
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Documents & Compliance
          </h3>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-gray-500">
              {documents.length} documents • {documents.filter(d => d.verified).length} verified
            </p>
            {documents.filter(d => d.isExpired).length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {documents.filter(d => d.isExpired).length} expired
              </span>
            )}
          </div>
        </div>
        
        {/* Upload Area */}
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Mandatory Documents Status */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-600" />
          Mandatory Documents Status
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {mandatoryDocuments.map((doc, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${
                doc.status === 'Submitted' ? 'border-green-200 bg-green-50' :
                doc.status === 'Missing' ? 'border-red-200 bg-red-50' :
                doc.status === 'Pending' ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{doc.type}</p>
                  <p className={`text-xs ${
                    doc.status === 'Submitted' ? 'text-green-700' :
                    doc.status === 'Missing' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {doc.status}
                  </p>
                </div>
                <div className={`p-1.5 rounded-full ${
                  doc.status === 'Submitted' ? 'bg-green-100' :
                  doc.status === 'Missing' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {doc.status === 'Submitted' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {doc.status === 'Missing' && <AlertCircle className="w-4 h-4 text-red-600" />}
                  {doc.status === 'Pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {doc.expiryInfo}
                </span>
                {doc.badgeColor && doc.badgeColor !== 'gray' && (
                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                    doc.badgeColor === 'green' ? 'bg-green-100 text-green-800' :
                    doc.badgeColor === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.badgeColor === 'green' ? '✓' : 
                     doc.badgeColor === 'red' ? '⚠' : '⏳'}
                  </span>
                )}
              </div>
              
              {!doc.required && (
                <span className="text-xs text-gray-500 mt-2 inline-block">Optional</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by name, type, or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label} ({filter.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Document Type Filters */}
        <div className="flex flex-wrap gap-2">
          {documentCategories.map(category => (
            <button
              key={category.value}
              onClick={() => setFilterType(category.value)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterType === category.value
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                filterType === category.value
                  ? 'bg-indigo-200 text-indigo-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div 
        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Drag & drop documents here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Browse Files
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Supports PDF, JPG, PNG, DOC (Max 10MB each)
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Verified
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Pending
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Expired
            </span>
          </div>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documents found</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm ? 'Try a different search term' : 'Upload documents to get started'}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className={`group flex items-center justify-between p-4 border rounded-lg transition-all ${
                doc.isExpired 
                  ? 'border-red-200 bg-red-50/50 hover:bg-red-50' 
                  : doc.verified 
                    ? 'border-green-200 hover:border-indigo-300 hover:bg-indigo-50/50' 
                    : 'border-yellow-200 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-2xl">
                  {getFileIcon(doc.fileName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-medium truncate">{doc.fileName}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {doc.verified ? (
                        <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Pending
                        </span>
                      )}
                      
                      {getExpiryBadge(doc)}
                      
                      {doc.documentNumber && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                          {doc.documentNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span>{getFileSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span>{doc.documentType || doc.type}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(doc.uploadedDate)}</span>
                    {doc.expiryDate && (
                      <>
                        <span>•</span>
                        <span className={doc.isExpired ? 'text-red-600 font-medium' : ''}>
                          {doc.isExpired ? 'Expired' : 'Expires'} {formatDate(doc.expiryDate)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onView(doc)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                
                <a
                  href={doc.fileUrl}
                  download
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </a>
                
                {!doc.verified && onVerify && (
                  <button
                    onClick={() => onVerify(doc.id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Verify Document"
                  >
                    <FileCheck className="w-4 h-4 text-green-600" />
                  </button>
                )}
                
                {doc.isExpired && onRenew && (
                  <button
                    onClick={() => onRenew(doc.id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Renew Document"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-red-600"
                    title="Delete Document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compliance Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Compliance Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-500">Background Check</p>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm font-medium ${
                employee.backgroundCheckStatus === 'Completed' ? 'text-green-700' :
                employee.backgroundCheckStatus === 'In Progress' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {employee.backgroundCheckStatus}
              </span>
              {employee.backgroundCheckStatus === 'Completed' && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-500">Document Verification</p>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm font-medium ${
                documents.filter(d => d.verified).length >= 3 ? 'text-green-700' :
                documents.filter(d => d.verified).length >= 1 ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {documents.filter(d => d.verified).length}/{documents.length} Verified
              </span>
              <FileCheck className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-500">Expired Documents</p>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-sm font-medium ${
                documents.filter(d => d.isExpired).length === 0 ? 'text-green-700' :
                documents.filter(d => d.isExpired).length <= 2 ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {documents.filter(d => d.isExpired).length} Expired
              </span>
              {documents.filter(d => d.isExpired).length > 0 ? (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-500">Compliance Score</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium">
                {Math.round(
                  (documents.filter(d => d.verified && !d.isExpired).length / 
                  Math.max(documents.length, 1)) * 100
                )}%
              </span>
              <Shield className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDocumentsCard;