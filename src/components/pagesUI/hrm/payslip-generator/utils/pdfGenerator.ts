// app/hr/salary-slip/utils/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ISalarySlipData } from "../SalarySlipTypes";

export const generateSalarySlipPDF = (slipData: ISalarySlipData): jsPDF => {
  const doc = new jsPDF();
  const { employeeInfo, calculation, attendance } = slipData;
  const monthYear = `${calculation.month} ${calculation.year}`;

  // Add company logo and header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR COMPANY NAME", 105, 20, { align: "center" });

  // Add salary slip title
  doc.setFontSize(16);
  doc.text("SALARY SLIP", 105, 35, { align: "center" });
  doc.setFontSize(12);
  doc.text(`For the month of ${monthYear}`, 105, 42, { align: "center" });

  // Employee information table
  autoTable(doc, {
    startY: 50,
    head: [['Employee Details', 'Payment Details']],
    body: [
      [`Name: ${employeeInfo.employeeName}`, `Payment Date: ${slipData.paymentDate}`],
      [`Employee ID: ${employeeInfo.employeeCode}`, `Bank: ${employeeInfo.bankName}`],
      [`Department: ${employeeInfo.department}`, `Account No: ${employeeInfo.bankAccount}`],
      [`Designation: ${employeeInfo.designation}`, `IFSC: ${employeeInfo.bankIFSC}`],
      [`Date of Joining: ${new Date(employeeInfo.dateOfJoining).toLocaleDateString()}`, `PAN: ${employeeInfo.panNumber || 'N/A'}`]
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
  });

  // Earnings table
  const earnings = [
    ['Basic Salary', calculation.basic],
    ['House Rent Allowance (HRA)', calculation.hra],
    ['Dearness Allowance (DA)', calculation.da],
    ['Special Allowance', calculation.specialAllowance],
    ['Leave Travel Allowance (LTA)', calculation.lta],
    ['Medical Allowance', calculation.medical],
    ['Conveyance Allowance', calculation.conveyance],
    ['Other Allowances', calculation.otherAllowances],
    ['Total Earnings', calculation.totalEarnings]
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable?.finalY || 50,
    head: [['Earnings', 'Amount (₹)']],
    body: earnings.map(([name, amount]) => [name, amount.toLocaleString('en-IN')]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold' }
  });

  // Deductions table
  const deductions = [
    ['Provident Fund (PF)', calculation.pf],
    ['Employee State Insurance (ESIC)', calculation.esic],
    ['Professional Tax', calculation.professionalTax],
    ['Tax Deducted at Source (TDS)', calculation.tds],
    ['Loan/Advance Recovery', calculation.loanAdvance],
    ['Other Deductions', calculation.otherDeductions],
    ['Total Deductions', calculation.totalDeductions]
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable?.finalY || 50,
    head: [['Deductions', 'Amount (₹)']],
    body: deductions.map(([name, amount]) => [name, amount.toLocaleString('en-IN')]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold' }
  });

  // Net Salary section
  const finalY = doc.lastAutoTable?.finalY || 50;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Net Salary Payable: ₹${calculation.netSalary.toLocaleString('en-IN')}`, 14, finalY + 20);

  // In words
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`In Words: ${calculation.inWords}`, 14, finalY + 28);

  // Attendance summary
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Attendance: ${attendance.presentDays} Days Present | ${attendance.paidLeaves} Paid Leaves | ${attendance.holidays} Holidays`, 14, finalY + 38);

  // Footer
  doc.setFontSize(8);
  doc.text("This is a computer generated document and does not require signature.", 105, finalY + 55, { align: "center" });
  doc.text(`Generated on: ${new Date(slipData.generatedOn).toLocaleString()} by ${slipData.generatedBy}`, 105, finalY + 60, { align: "center" });

  return doc;
};

export const downloadPDF = (slipData: ISalarySlipData, fileName?: string): void => {
  const doc = generateSalarySlipPDF(slipData);
  const defaultFileName = `Salary_Slip_${slipData.employeeInfo.employeeCode}_${slipData.calculation.month}_${slipData.calculation.year}.pdf`;
  doc.save(fileName || defaultFileName);
};

export const openPDFInNewTab = (slipData: ISalarySlipData): void => {
  const doc = generateSalarySlipPDF(slipData);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};