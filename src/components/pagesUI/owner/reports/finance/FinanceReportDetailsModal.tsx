"use client";
import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Chip, 
  Box, 
  Divider, 
  Grid,
  Button,
  Paper
} from "@mui/material";
import { FinanceReportDetailsStatePropsType } from "./financereports.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface IFinanceReport {
  id: number;
  reportName: string;
  reportType: string;
  period: string;
  generatedBy: string;
  generationDate: string;
  status: string;
  fileSize: string;
  totalAmount: number;
  currency: string;
  recordCount: number;
  downloadCount: number;
  description?: string;
  parameters?: Record<string, any>;
  keyMetrics?: Array<{label: string; value: string; change?: number}>;
}

interface IKeyMetric {
  label: string;
  value: string;
  change?: number;
}

const FinanceReportDetailsModal = ({ 
  open, 
  setOpen, 
  reportData 
}: FinanceReportDetailsStatePropsType) => {
  
  const handleToggle = () => setOpen(!open);

  if (!reportData) return null;

  const getReportTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "p&l statement":
        return "success-badge";
      case "balance sheet":
        return "primary-badge";
      case "cash flow":
        return "info-badge";
      case "ar aging":
        return "warning-badge";
      case "ap aging":
        return "danger-badge";
      default:
        return "default-badge";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownload = () => {
    alert(`Downloading ${reportData.reportName}...`);
  };

  const handleShare = () => {
    alert(`Sharing ${reportData.reportName}...`);
  };

  // Sample key metrics for finance report
  const sampleMetrics: IKeyMetric[] = reportData.keyMetrics || [
    { label: "Total Revenue", value: "$1,250,000", change: 12 },
    { label: "Gross Profit", value: "$750,000", change: 8 },
    { label: "Net Profit", value: "$350,000", change: 15 },
    { label: "Operating Expenses", value: "$400,000", change: -3 },
    { label: "Current Ratio", value: "2.5:1", change: 5 },
    { label: "Debt to Equity", value: "0.8:1", change: -2 },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Finance Report Details</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        <div className="card__wrapper">
          <div className="grid grid-cols-12 gap-y-5">
            <div className="col-span-12">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <DescriptionIcon className="mr-3 text-primary" fontSize="large" />
                  <div>
                    <Typography variant="h6" className="font-semibold">
                      {reportData.reportName}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip 
                        label={reportData.reportType} 
                        className={getReportTypeClass(reportData.reportType)}
                        size="small"
                      />
                      <Chip 
                        label={reportData.status} 
                        className={getTableStatusClass(reportData.status)}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
                {reportData.totalAmount > 0 && (
                  <div className="text-right">
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h5" className="font-bold text-success">
                      {formatCurrency(reportData.totalAmount, reportData.currency)}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
            
            <Divider className="col-span-12 my-2" />
            
            <Grid container spacing={2} className="col-span-12">
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <PersonIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Generated By</span>
                  </div>
                  <h6 className="label__title">{reportData.generatedBy}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Generation Date</span>
                  </div>
                  <h6 className="label__title">{reportData.generationDate}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Report Period</span>
                  <h6 className="label__title">{reportData.period}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <InsertDriveFileIcon fontSize="small" color="action" />
                    <span className="label__subtitle">File Size</span>
                  </div>
                  <h6 className="label__title">{reportData.fileSize}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Record Count</span>
                  <h6 className="label__title">{reportData.recordCount.toLocaleString()} records</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <span className="label__subtitle">Download Count</span>
                  <h6 className="label__title">{reportData.downloadCount} downloads</h6>
                </div>
              </Grid>
            </Grid>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Key Financial Metrics
              </Typography>
              <Paper variant="outlined" className="p-3">
                <Grid container spacing={2}>
                  {sampleMetrics.map((metric: IKeyMetric, index: number) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper className="p-3" elevation={0}>
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          {metric.label}
                        </Typography>
                        <div className="flex items-center justify-between">
                          <Typography variant="h6" className="font-semibold">
                            {metric.value}
                          </Typography>
                          {metric.change !== undefined && (
                            <Chip
                              label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                              color={metric.change > 0 ? "success" : "error"}
                              size="small"
                              icon={metric.change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            />
                          )}
                        </div>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </div>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Report Description
              </Typography>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Typography variant="body2">
                  {reportData.description || 
                    `This ${reportData.reportType.toLowerCase()} report provides comprehensive financial analysis and insights for the period ${reportData.period}. 
                    It includes detailed financial statements, analysis, and key performance indicators for management review and decision-making.`}
                </Typography>
              </Box>
            </div>
            
            {reportData.parameters && Object.keys(reportData.parameters).length > 0 && (
              <>
                <Divider className="col-span-12 my-4" />
                <div className="col-span-12">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    Report Parameters
                  </Typography>
                  <Box className="p-3 bg-blue-50 rounded-lg">
                    <Grid container spacing={2}>
                      {Object.entries(reportData.parameters).map(([key, value], index: number) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Typography variant="body2">
                            <strong>{key}:</strong> {String(value)}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </div>
              </>
            )}
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download Report
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleDownload}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                >
                  Share Report
                </Button>
                {reportData.status === "Complete" && reportData.totalAmount > 0 && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AttachMoneyIcon />}
                    onClick={() => alert("Exporting to accounting system...")}
                  >
                    Export to Accounting
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceReportDetailsModal;