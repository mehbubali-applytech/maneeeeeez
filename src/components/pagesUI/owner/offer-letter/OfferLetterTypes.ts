export interface ITemplateVariable {
  id: string;
  name: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'select' | 'currency';
  defaultValue?: string;
  description?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface ITemplateVersion {
  id: string;
  version: number;
  content: string;
  variables: ITemplateVariable[];
  status: 'Draft' | 'Published' | 'Archived';
  createdAt: string;
  createdBy: string;
  notes?: string;
  changes?: string;
}

export interface IOfferLetterTemplate {
  id: string;
  name: string;
  code: string;
  description?: string;
  companyName?: string;
  companyAddress?: string;
  department?: string;
  position?: string;
  category: 'Full-time' | 'Intern' | 'Contract' | 'Consultant';
  versions: ITemplateVersion[];
  status: 'Draft' | 'Published' | 'Archived';
  isActive: boolean;
  usageCount: number;
  lastUsedAt?: string;
  tags: string[];
  accessLevel: 'Public' | 'Restricted' | 'Private';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Mock data generator
export const generateMockTemplates = (): IOfferLetterTemplate[] => {
  return [
    {
      id: "TEMP001",
      name: "Standard Full-time Offer",
      code: "FT-STANDARD",
      description: "Standard offer letter for full-time employees",
      department: "Engineering",
      position: "Software Engineer",
      category: "Full-time",
      versions: [
        {
          id: "VER001",
          version: 3,
          content: `<!DOCTYPE html><html><body><h1>Offer Letter</h1><p>Dear {{candidateName}},</p></body></html>`,
          variables: [
            { id: "1", name: "Candidate Name", key: "candidateName", type: "text", required: true },
            { id: "2", name: "Position", key: "position", type: "text", required: true },
            { id: "3", name: "Start Date", key: "startDate", type: "date", required: true },
            { id: "4", name: "Salary", key: "salary", type: "currency", required: true }
          ],
          status: "Published",
          createdAt: "2024-01-15T10:30:00Z",
          createdBy: "HR Admin",
          changes: "Updated salary structure and benefits"
        },
        {
          id: "VER002",
          version: 2,
          content: `<!DOCTYPE html><html><body><h1>Older Template</h1></body></html>`,
          variables: [],
          status: "Archived",
          createdAt: "2024-01-10T09:15:00Z",
          createdBy: "HR Admin"
        }
      ],
      status: "Published",
      isActive: true,
      usageCount: 45,
      lastUsedAt: "2024-01-20T14:30:00Z",
      tags: ["engineering", "full-time", "standard"],
      accessLevel: "Public",
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      createdBy: "HR Admin",
      updatedBy: "HR Admin"
    },
    {
      id: "TEMP002",
      name: "Internship Offer Letter",
      code: "INTERN-BASIC",
      description: "Offer letter for internship positions",
      department: "All",
      position: "Intern",
      category: "Intern",
      versions: [
        {
          id: "VER003",
          version: 2,
          content: `<!DOCTYPE html><html><body><h1>Intern Offer</h1></body></html>`,
          variables: [
            { id: "1", name: "Candidate Name", key: "candidateName", type: "text", required: true },
            { id: "2", name: "Stipend", key: "stipend", type: "currency", required: true },
            { id: "3", name: "Duration", key: "duration", type: "text", required: true }
          ],
          status: "Published",
          createdAt: "2024-01-12T11:20:00Z",
          createdBy: "HR Team"
        }
      ],
      status: "Published",
      isActive: true,
      usageCount: 23,
      lastUsedAt: "2024-01-18T16:45:00Z",
      tags: ["internship", "stipend", "training"],
      accessLevel: "Public",
      createdAt: "2024-01-05T09:30:00Z",
      updatedAt: "2024-01-12T11:20:00Z",
      createdBy: "HR Team",
      updatedBy: "HR Team"
    }
  ];
};

// Helper functions
export const extractVariables = (content: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = content.match(regex);
  return matches ? matches.map(match => match.replace(/\{\{|\}\}/g, '')) : [];
};

export const validateTemplate = (template: Partial<IOfferLetterTemplate>): string[] => {
  const errors: string[] = [];
  
  if (!template.name?.trim()) {
    errors.push('Template name is required');
  }
  
  if (!template.code?.trim()) {
    errors.push('Template code is required');
  }
  
  if (template.versions && template.versions.length === 0) {
    errors.push('At least one version is required');
  }
  
  return errors;
};

export const formatTemplateContent = (content: string, variables: Record<string, string>): string => {
  let formattedContent = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    formattedContent = formattedContent.replace(regex, value || '');
  });
  return formattedContent;
};

// Add to existing OfferLetterTypes.ts

export interface IOfferLetter {
  id: string;
  templateId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  startDate: string;
  salary: string;
  location: string;
  reportingManager: string;
  employeeId?: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Withdrawn';
  generatedContent: string;
  variables: Record<string, string>;
  sentAt?: string;
  acceptedAt?: string;
  viewedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  attachments?: string[];
  notes?: string;
}

export interface ICandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  experience?: string;
  status: 'Applied' | 'Interviewed' | 'Offered' | 'Hired' | 'Rejected';
  resumeUrl?: string;
  createdAt: string;
}