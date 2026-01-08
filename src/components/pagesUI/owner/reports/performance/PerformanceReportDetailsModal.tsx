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
  Paper,
  LinearProgress
} from "@mui/material";
import { PerformanceReportDetailsStatePropsType } from "./performance.interface";
import { getTableStatusClass } from "@/hooks/use-condition-class";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import ScoreIcon from "@mui/icons-material/Score";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const PerformanceReportDetailsModal = ({ 
  open, 
  setOpen, 
  reportData 
}: PerformanceReportDetailsStatePropsType) => {
  
  const handleToggle = () => setOpen(!open);

  if (!reportData) return null;

  const getReportTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "quarterly review":
        return "success-badge";
      case "annual review":
        return "primary-badge";
      case "360 feedback":
        return "info-badge";
      case "competency assessment":
        return "warning-badge";
      case "goal tracking":
        return "danger-badge";
      case "leadership assessment":
        return "secondary-badge";
      default:
        return "default-badge";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "success";
    if (score >= 3.5) return "info";
    if (score >= 2.5) return "warning";
    return "error";
  };

  const handleDownload = () => {
    alert(`Downloading ${reportData.reportName}...`);
  };

  const handleShare = () => {
    alert(`Sharing ${reportData.reportName}...`);
  };

  // Sample key metrics for performance report
  const sampleMetrics = reportData.keyMetrics || [
    { label: "Overall Performance", value: 4.2, change: 5, target: 4.5 },
    { label: "Goal Achievement", value: "87%", change: 8 },
    { label: "Top Performers", value: 15, change: 12 },
    { label: "Development Needed", value: 8, change: -3 },
    { label: "Turnover Risk", value: "12%", change: -2 },
    { label: "Promotion Ready", value: 22, change: 15 },
  ];

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Performance Report Details</h5>
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
                      {reportData.department && (
                        <Chip 
                          label={reportData.department} 
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {reportData.averageScore && (
                  <div className="text-right">
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Typography variant="h5" className={`font-bold text-${getScoreColor(reportData.averageScore)}`}>
                        {reportData.averageScore.toFixed(1)}
                      </Typography>
                      <Chip
                        label={`/5.0`}
                        size="small"
                        variant="outlined"
                      />
                    </div>
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
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Evaluation Period</span>
                  </div>
                  <h6 className="label__title">{reportData.evaluationPeriod}</h6>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div className="label__content-wrapper">
                  <div className="flex items-center gap-2">
                    <GroupIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Employees Assessed</span>
                  </div>
                  <h6 className="label__title">{reportData.employeeCount} employees</h6>
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
                  <div className="flex items-center gap-2">
                    <DownloadIcon fontSize="small" color="action" />
                    <span className="label__subtitle">Download Count</span>
                  </div>
                  <h6 className="label__title">{reportData.downloadCount} downloads</h6>
                </div>
              </Grid>
            </Grid>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Performance Metrics & Insights
              </Typography>
              <Paper variant="outlined" className="p-3">
                <Grid container spacing={2}>
                  {sampleMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper className="p-3" elevation={0}>
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          {metric.label}
                        </Typography>
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="h6" className="font-semibold">
                            {typeof metric.value === 'number' && metric.value <= 5 ? 
                              `${metric.value.toFixed(1)}/5.0` : metric.value}
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
                        {metric.target !== undefined && (
                          <Box className="mt-2">
                            <LinearProgress 
                              variant="determinate" 
                              value={(metric.value as number / metric.target) * 100} 
                              color={getScoreColor(metric.value as number)}
                              className="h-2 rounded"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Target: {metric.target}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </div>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Performance Distribution
              </Typography>
              <Box className="p-3 bg-gray-50 rounded-lg">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Rating Categories
                    </Typography>
                    <Box className="space-y-2">
                      {['Exceeds Expectations (4.5-5.0)', 'Meets Expectations (3.5-4.4)', 'Needs Improvement (2.5-3.4)', 'Below Expectations (<2.5)'].map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <Typography variant="body2">{cat}</Typography>
                          <Chip 
                            label={`${Math.floor(Math.random() * 25) + 10}%`}
                            size="small"
                            color={idx === 0 ? 'success' : idx === 1 ? 'info' : idx === 2 ? 'warning' : 'error'}
                          />
                        </div>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Highlights
                    </Typography>
                    <Box className="space-y-2">
                      {[
                        'Top 3 departments by average score',
                        'Fastest improving employees',
                        'High-potential employees identified',
                        'Critical development areas'
                      ].map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <EmojiEventsIcon color="action" fontSize="small" />
                          <Typography variant="body2">{highlight}</Typography>
                        </div>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </div>
            
            <Divider className="col-span-12 my-4" />
            
            <div className="col-span-12">
              <Typography variant="subtitle1" className="font-medium mb-3">
                Report Description
              </Typography>
              <Box className="p-3 bg-blue-50 rounded-lg">
                <Typography variant="body2">
                  {reportData.description || 
                    `This ${reportData.reportType.toLowerCase()} report provides comprehensive performance analysis and insights for the evaluation period ${reportData.evaluationPeriod}. 
                    It includes detailed assessments, ratings, and development recommendations for ${reportData.employeeCount} employees.`}
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
                      {Object.entries(reportData.parameters).map(([key, value], index) => (
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
                  Share with Leadership
                </Button>
                {reportData.status === "Complete" && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ScoreIcon />}
                    onClick={() => alert("Exporting to HRIS system...")}
                  >
                    Export to HRIS
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

export default PerformanceReportDetailsModal;