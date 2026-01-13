// jspdf.d.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

declare module 'jspdf-autotable' {
  const autoTable: (options: any) => void;
  export default autoTable;
}