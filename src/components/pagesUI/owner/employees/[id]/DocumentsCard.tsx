// components/employee/DocumentsCard.tsx
"use client";

import React, { useState } from 'react';
import { IEmployee, IDocument, ID_PROOF_TYPES } from '../EmployeeTypes';
import { 
  FileText, Download, Eye, CheckCircle, XCircle, 
  Upload, File, Shield, Plus
} from 'lucide-react';
import { formatFileSize, formatDate } from './formatters';

interface DocumentsCardProps {
  employee: IEmployee;
  onUpload?: (files: File[]) => void;
  onView?: (document: IDocument) => void;
  onVerify?: (documentId: string) => void;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ 
  employee, 
  onUpload, 
  onView, 
  onVerify 
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (onUpload && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpload && e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'ID Proof': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'Offer Letter': return <FileText className="w-5 h-5 text-green-500" />;
      case 'Joining Form': return <File className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (documentType?: string) => {
    const found = ID_PROOF_TYPES.find(type => type.value === documentType);
    return found ? found.label : documentType;
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <p className="text-sm text-gray-500">
                {employee.documents.length} document(s) uploaded
              </p>
            </div>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Upload className="w-4 h-4" />
              Upload
            </div>
          </label>
        </div>

        {/* Upload Area */}
        <div
          className={`mb-6 p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
            dragOver 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Drop files here or click to upload
          </h4>
          <p className="text-gray-500 mb-4">
            Supports PDF, DOC, JPG, PNG up to 10MB
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <File className="w-4 h-4" />
            Browse Files
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Documents List */}
        {employee.documents.length > 0 ? (
          <div className="space-y-3">
            {employee.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getDocumentIcon(doc.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                      {doc.verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{doc.type}</span>
                      {doc.documentType && (
                        <>
                          <span>•</span>
                          <span>{getDocumentTypeLabel(doc.documentType)}</span>
                        </>
                      )}
                      {doc.documentNumber && (
                        <>
                          <span>•</span>
                          <span>#{doc.documentNumber}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(doc.uploadedDate)}
                  </span>
                  <div className="flex items-center gap-1">
                    {onView && (
                      <button
                        onClick={() => onView(doc)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <a
                      href={doc.fileUrl}
                      download
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    {!doc.verified && onVerify && (
                      <button
                        onClick={() => onVerify(doc.id)}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Documents</h4>
            <p className="text-gray-500">Upload employee documents to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsCard;