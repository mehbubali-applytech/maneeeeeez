// app/helpers/downloader.tsx
"use client";

import React from 'react';
import { ButtonGroup, Button, Menu, MenuItem, IconButton, Tooltip, Box } from '@mui/material';
import { 
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  TextSnippet as CsvIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TableData {
  headers: string[];
  rows: any[][];
  title?: string;
  fileName?: string;
}

export interface ExportOptions {
  includeHeaders?: boolean;
  fileName?: string;
  sheetName?: string;
  pdfOrientation?: 'portrait' | 'landscape';
  pdfUnit?: 'mm' | 'cm' | 'in' | 'pt';
  pdfFormat?: 'a3' | 'a4' | 'letter' | 'legal';
  dateFormat?: string;
  pdfTitle?: string; // Added pdfTitle for PDF export
}

class TableExporter {
  /**
   * Export table data to CSV format
   */
  static exportToCSV(data: TableData, options: ExportOptions = {}): void {
    const {
      includeHeaders = true,
      fileName = `export_${new Date().getTime()}.csv`,
      dateFormat = 'YYYY-MM-DD'
    } = options;

    try {
      let csvContent = '';
      
      // Add headers if requested
      if (includeHeaders && data.headers.length > 0) {
        csvContent += data.headers.map(header => this.escapeCSV(header)).join(',') + '\n';
      }
      
      // Add rows
      data.rows.forEach(row => {
        const formattedRow = row.map(cell => {
          if (cell === null || cell === undefined) return '';
          if (cell instanceof Date) {
            return this.formatDate(cell, dateFormat);
          }
          return this.escapeCSV(String(cell));
        });
        csvContent += formattedRow.join(',') + '\n';
      });
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.triggerDownload(blob, fileName);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  /**
   * Export table data to Excel (XLSX) format
   */
  static exportToExcel(data: TableData, options: ExportOptions = {}): void {
    const {
      includeHeaders = true,
      fileName = `export_${new Date().getTime()}.xlsx`,
      sheetName = 'Sheet1'
    } = options;

    try {
      const wb = XLSX.utils.book_new();
      
      // Prepare data array
      const excelData: any[][] = [];
      
      // Add headers if requested
      if (includeHeaders && data.headers.length > 0) {
        excelData.push(data.headers);
      }
      
      // Add rows
      data.rows.forEach(row => {
        const formattedRow = row.map(cell => {
          if (cell === null || cell === undefined) return '';
          if (cell instanceof Date) {
            return this.formatDate(cell, 'YYYY-MM-DD');
          }
          // Convert numbers
          if (typeof cell === 'number') return cell;
          // Convert booleans
          if (typeof cell === 'boolean') return cell ? 'Yes' : 'No';
          return String(cell);
        });
        excelData.push(formattedRow);
      });
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Auto-size columns
      const colWidths = data.headers.map((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...data.rows.map(row => 
            row[index] ? String(row[index]).length : 0
          )
        );
        return { wch: Math.min(maxLength + 2, 50) }; // Max width 50 characters
      });
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Generate and trigger download
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      this.triggerDownload(blob, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  /**
   * Export table data to PDF format
   */
  static exportToPDF(data: TableData, options: ExportOptions = {}): void {
    const {
      includeHeaders = true,
      fileName = `export_${new Date().getTime()}.pdf`,
      pdfOrientation = 'landscape',
      pdfUnit = 'mm',
      pdfFormat = 'a4',
      pdfTitle = data.title || 'Table Export' // Use pdfTitle from options or fallback to data.title
    } = options;

    try {
      // Initialize jsPDF
      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: pdfUnit,
        format: pdfFormat
      });
      
      // Add title if provided
      if (pdfTitle) {
        doc.setFontSize(16);
        doc.text(pdfTitle, 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
      }
      
      // Prepare table data
      const tableData = includeHeaders ? 
        [data.headers, ...data.rows.map(row => 
          row.map(cell => {
            if (cell === null || cell === undefined) return '';
            if (cell instanceof Date) {
              return this.formatDate(cell, 'YYYY-MM-DD');
            }
            if (typeof cell === 'boolean') return cell ? 'Yes' : 'No';
            return String(cell);
          })
        )] : 
        data.rows.map(row => 
          row.map(cell => {
            if (cell === null || cell === undefined) return '';
            if (cell instanceof Date) {
              return this.formatDate(cell, 'YYYY-MM-DD');
            }
            if (typeof cell === 'boolean') return cell ? 'Yes' : 'No';
            return String(cell);
          })
        );
      
      // Calculate column widths
      const pageWidth = doc.internal.pageSize.getWidth();
      const margins = { left: 14, right: 14 };
      const availableWidth = pageWidth - margins.left - margins.right;
      
      // Create column widths array
      const colCount = data.headers.length;
      const colWidths = Array(colCount).fill(availableWidth / colCount);
      
      // Generate autoTable
      autoTable(doc, {
        head: includeHeaders ? [tableData[0]] : [],
        body: includeHeaders ? tableData.slice(1) : tableData,
        startY: pdfTitle ? 30 : 20,
        margin: { left: margins.left, right: margins.right },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: Object.fromEntries(
          Array.from({ length: colCount }, (_, i) => [i, { cellWidth: colWidths[i] }])
        )
      });
      
      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  /**
   * Export all formats at once (ZIP file)
   */
  static async exportAllFormats(data: TableData, options: ExportOptions = {}): Promise<void> {
    try {
      // Create promises for each format
      const formats = [
        { format: 'CSV', exportFn: () => this.exportToCSV(data, options) },
        { format: 'Excel', exportFn: () => this.exportToExcel(data, options) },
        { format: 'PDF', exportFn: () => this.exportToPDF(data, options) }
      ];
      
      // Execute all exports
      await Promise.all(formats.map(f => f.exportFn()));
    } catch (error) {
      console.error('Error exporting all formats:', error);
      throw error;
    }
  }

  /**
   * Helper method to escape CSV values
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Helper method to format dates
   */
  private static formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    switch (format.toLowerCase()) {
      case 'dd/mm/yyyy':
        return `${day}/${month}/${year}`;
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
      default:
        return `${year}-${month}-${day}`;
    }
  }

  /**
   * Helper method to trigger file download
   */
  private static triggerDownload(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// React Component for Download Button Group
interface DownloadButtonGroupProps {
  data: TableData;
  options?: ExportOptions;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  showIcons?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
  onExportStart?: (format: string) => void;
  onExportComplete?: (format: string) => void;
  onExportError?: (format: string, error: Error) => void;
}

export const DownloadButtonGroup: React.FC<DownloadButtonGroupProps> = ({
  data,
  options = {},
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  showIcons = true,
  showLabels = true,
  disabled = false,
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf' | 'all') => {
    handleClose();
    
    try {
      onExportStart?.(format);
      
      switch (format) {
        case 'csv':
          TableExporter.exportToCSV(data, options);
          break;
        case 'excel':
          TableExporter.exportToExcel(data, options);
          break;
        case 'pdf':
          TableExporter.exportToPDF(data, options);
          break;
        case 'all':
          await TableExporter.exportAllFormats(data, options);
          break;
      }
      
      onExportComplete?.(format);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      onExportError?.(format, error as Error);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ButtonGroup
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        sx={{ mr: 1 }}
      >
        <Button
          onClick={() => handleExport('excel')}
          startIcon={showIcons ? <ExcelIcon /> : undefined}
        >
          {showLabels ? 'Excel' : ''}
        </Button>
        <Button
          onClick={() => handleExport('csv')}
          startIcon={showIcons ? <CsvIcon /> : undefined}
        >
          {showLabels ? 'CSV' : ''}
        </Button>
        <Button
          onClick={() => handleExport('pdf')}
          startIcon={showIcons ? <PdfIcon /> : undefined}
        >
          {showLabels ? 'PDF' : ''}
        </Button>
      </ButtonGroup>
      
      <Tooltip title="More export options">
        <IconButton
          onClick={handleClick}
          size={size}
          color={color}
          disabled={disabled}
          sx={{
            ...(variant === 'contained' && {
              bgcolor: `${color}.main`,
              color: `${color}.contrastText`,
              '&:hover': {
                bgcolor: `${color}.dark`,
              }
            }),
            ...(variant === 'outlined' && {
              border: `1px solid`,
              borderColor: `${color}.main`,
              color: `${color}.main`,
              '&:hover': {
                bgcolor: `${color}.main`,
                color: `${color}.contrastText`,
              }
            })
          }}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleExport('all')}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Export All Formats
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <ExcelIcon fontSize="small" sx={{ mr: 1 }} />
          Excel Only (.xlsx)
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <CsvIcon fontSize="small" sx={{ mr: 1 }} />
          CSV Only (.csv)
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <PdfIcon fontSize="small" sx={{ mr: 1 }} />
          PDF Only (.pdf)
        </MenuItem>
      </Menu>
    </Box>
  );
};

// React Component for Individual Download Button
interface DownloadButtonProps {
  data: TableData;
  format: 'csv' | 'excel' | 'pdf' | 'all';
  options?: ExportOptions;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  data,
  format,
  options = {},
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon,
  endIcon,
  children,
  disabled = false,
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const handleClick = async () => {
    try {
      onExportStart?.();
      
      switch (format) {
        case 'csv':
          TableExporter.exportToCSV(data, options);
          break;
        case 'excel':
          TableExporter.exportToExcel(data, options);
          break;
        case 'pdf':
          TableExporter.exportToPDF(data, options);
          break;
        case 'all':
          await TableExporter.exportAllFormats(data, options);
          break;
      }
      
      onExportComplete?.();
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      onExportError?.(error as Error);
    }
  };

  // Default icons for each format
  const getDefaultIcon = () => {
    switch (format) {
      case 'csv': return <CsvIcon />;
      case 'excel': return <ExcelIcon />;
      case 'pdf': return <PdfIcon />;
      case 'all': return <DownloadIcon />;
      default: return null;
    }
  };

  // Default labels for each format
  const getDefaultLabel = () => {
    switch (format) {
      case 'csv': return 'Download CSV';
      case 'excel': return 'Download Excel';
      case 'pdf': return 'Download PDF';
      case 'all': return 'Download All';
      default: return 'Download';
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={startIcon || getDefaultIcon()}
      endIcon={endIcon}
      onClick={handleClick}
      disabled={disabled}
    >
      {children || getDefaultLabel()}
    </Button>
  );
};

// Hook for table data export
export const useTableExport = () => {
  const exportTableData = React.useCallback((
    data: TableData,
    format: 'csv' | 'excel' | 'pdf' | 'all',
    options: ExportOptions = {}
  ) => {
    switch (format) {
      case 'csv':
        return TableExporter.exportToCSV(data, options);
      case 'excel':
        return TableExporter.exportToExcel(data, options);
      case 'pdf':
        return TableExporter.exportToPDF(data, options);
      case 'all':
        return TableExporter.exportAllFormats(data, options);
    }
  }, []);

  return { exportTableData, TableExporter };
};

// Export the main class and components
export default TableExporter;