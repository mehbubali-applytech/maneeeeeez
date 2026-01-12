// OfferLetterTypes.ts
export interface IOfferLetter {
  id: string;
  offerId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  department: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  offerStatus: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired' | 'On Hold';
  offerDate: string;
  joiningDate: string;
  probationPeriod: number; // in months
  location: string;
  reportingManager: string;
  hrContact: string;
  
  // Salary Details
  baseSalary: number;
  ctc: number;
  bonus: number;
  benefits: string[];
  equity?: number;
  
  // Documents
  offerDocumentUrl?: string;
  signedDocumentUrl?: string;
  attachments: IAttachment[];
  
  // Communication
  sentDate?: string;
  viewedDate?: string;
  respondedDate?: string;
  reminderSent: boolean;
  
  // System
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  templateId?: string;
  version: number;
}

export interface IAttachment {
  id: string;
  name: string;
  type: 'Offer Letter' | 'Contract' | 'Policy' | 'Other';
  fileUrl: string;
  fileSize: number;
  uploadedDate: string;
  description?: string;
}

export interface IOfferLetterTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  category: 'Standard' | 'Executive' | 'Contractor' | 'Intern' | 'Custom';
  department?: string;
  jobType?: string[];
  createdAt: string;
  updatedAt: string;
  usedCount: number;
}

export interface IOfferLetterForm {
  // Candidate Info
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  department: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  location: string;
  reportingManager: string;
  hrContact: string;
  
  // Dates
  offerDate: string;
  joiningDate: string;
  probationPeriod: number;
  
  // Compensation
  baseSalary: number;
  ctc: number;
  bonus: number;
  benefits: string[];
  equity?: number;
  
  // Template
  templateId?: string;
  customContent?: string;
  
  // Status
  offerStatus: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired' | 'On Hold';
  
  // Attachments
  attachments: File[];
}

export interface IOfferLetterVariable {
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
}

// Status Options
export const OFFER_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft', color: 'default', icon: '📝' },
  { value: 'Sent', label: 'Sent', color: 'info', icon: '📤' },
  { value: 'Accepted', label: 'Accepted', color: 'success', icon: '✅' },
  { value: 'Declined', label: 'Declined', color: 'error', icon: '❌' },
  { value: 'Expired', label: 'Expired', color: 'warning', icon: '⏰' },
  { value: 'On Hold', label: 'On Hold', color: 'secondary', icon: '⏸️' },
];

export const JOB_TYPE_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Intern', label: 'Intern' },
];

export const TEMPLATE_CATEGORIES = [
  { value: 'Standard', label: 'Standard' },
  { value: 'Executive', label: 'Executive' },
  { value: 'Contractor', label: 'Contractor' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Custom', label: 'Custom' },
];

// Mock Data Generators
export const createMockOfferLetter = (overrides?: Partial<IOfferLetter>): IOfferLetter => {
  const today = new Date();
  const joiningDate = new Date();
  joiningDate.setDate(today.getDate() + 30);
  
  const baseOffer: IOfferLetter = {
    id: `OFFER-${Date.now().toString().slice(-6)}`,
    offerId: `OFF${Math.floor(1000 + Math.random() * 9000)}`,
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@example.com',
    candidatePhone: '+91 9876543210',
    position: 'Software Engineer',
    department: 'Engineering',
    jobType: 'Full-time',
    offerStatus: 'Sent',
    offerDate: today.toISOString().split('T')[0],
    joiningDate: joiningDate.toISOString().split('T')[0],
    probationPeriod: 6,
    location: 'Bangalore Office',
    reportingManager: 'Jane Smith',
    hrContact: 'hr@company.com',
    baseSalary: 1200000,
    ctc: 1500000,
    bonus: 200000,
    benefits: ['Health Insurance', 'PF', 'Gratuity', 'ESIC'],
    attachments: [],
    reminderSent: false,
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    createdBy: 'Admin',
    updatedBy: 'Admin',
    version: 1,
  };
  
  return { ...baseOffer, ...overrides };
};

export const createMockOfferLetters = (count: number): IOfferLetter[] => {
  const positions = [
    'Software Engineer', 'Senior Software Engineer', 'Product Manager',
    'UX Designer', 'Data Analyst', 'DevOps Engineer', 'QA Engineer',
    'Technical Lead', 'Project Manager', 'HR Executive'
  ];
  
  const departments = ['Engineering', 'Product', 'Design', 'Data Science', 'HR', 'Sales'];
  
  const names = [
    { first: 'Rajesh', last: 'Kumar' },
    { first: 'Priya', last: 'Sharma' },
    { first: 'Amit', last: 'Patel' },
    { first: 'Sneha', last: 'Reddy' },
    { first: 'Vikram', last: 'Singh' },
    { first: 'Anjali', last: 'Gupta' },
  ];
  
  const statuses: IOfferLetter['offerStatus'][] = ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired', 'On Hold'];
  
  return Array.from({ length: count }, (_, index) => {
    const name = names[index % names.length];
    const position = positions[index % positions.length];
    const department = departments[index % departments.length];
    const status = statuses[index % statuses.length];
    
    const offerDate = new Date();
    offerDate.setDate(offerDate.getDate() - Math.floor(Math.random() * 30));
    
    const joiningDate = new Date(offerDate);
    joiningDate.setDate(joiningDate.getDate() + 30);
    
    return createMockOfferLetter({
      id: `OFFER-${String(index + 1).padStart(3, '0')}`,
      offerId: `OFF${1000 + index}`,
      candidateName: `${name.first} ${name.last}`,
      candidateEmail: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com`,
      position,
      department,
      offerStatus: status,
      offerDate: offerDate.toISOString().split('T')[0],
      joiningDate: joiningDate.toISOString().split('T')[0],
      baseSalary: 800000 + (index * 50000),
      ctc: 1000000 + (index * 75000),
      bonus: 50000 + (index * 25000),
      jobType: index % 4 === 0 ? 'Contract' : 'Full-time',
      probationPeriod: [3, 6, 12][index % 3],
    });
  });
};

export const createMockTemplates = (): IOfferLetterTemplate[] => [
  {
    id: 'TPL-001',
    name: 'Standard Full-time Offer',
    description: 'Standard offer letter for full-time employees',
    content: '# Offer Letter\n\nDear {{candidateName}},\n\nWe are pleased to offer you the position of {{position}} at {{companyName}}.',
    variables: ['candidateName', 'position', 'companyName', 'joiningDate', 'salary'],
    isActive: true,
    category: 'Standard',
    department: 'All',
    jobType: ['Full-time'],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    usedCount: 45,
  },
  {
    id: 'TPL-002',
    name: 'Executive Package Offer',
    description: 'Offer letter for executive positions with comprehensive benefits',
    content: '# Executive Offer Letter\n\nDear {{candidateName}},\n\nWe are delighted to extend an executive offer for the role of {{position}}.',
    variables: ['candidateName', 'position', 'ctc', 'bonus', 'equity', 'benefits'],
    isActive: true,
    category: 'Executive',
    department: 'All',
    jobType: ['Full-time'],
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
    usedCount: 12,
  },
  {
    id: 'TPL-003',
    name: 'Contractor Agreement',
    description: 'Agreement for contract-based employment',
    content: '# Contractor Agreement\n\nThis agreement is between {{companyName}} and {{candidateName}} for contract services.',
    variables: ['candidateName', 'companyName', 'contractPeriod', 'rate', 'scope'],
    isActive: true,
    category: 'Contractor',
    department: 'All',
    jobType: ['Contract'],
    createdAt: '2024-01-10T11:20:00Z',
    updatedAt: '2024-01-10T11:20:00Z',
    usedCount: 28,
  },
  {
    id: 'TPL-004',
    name: 'Internship Offer',
    description: 'Offer letter for internship positions',
    content: '# Internship Offer Letter\n\nDear {{candidateName}},\n\nWe are pleased to offer you an internship position as {{position}}.',
    variables: ['candidateName', 'position', 'duration', 'stipend', 'mentor'],
    isActive: true,
    category: 'Intern',
    department: 'All',
    jobType: ['Intern'],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
    usedCount: 67,
  },
];

// Helper Functions
export const getStatusColor = (status: string): string => {
  switch(status) {
    case 'Draft': return 'bg-gray-500';
    case 'Sent': return 'bg-info';
    case 'Accepted': return 'bg-success';
    case 'Declined': return 'bg-danger';
    case 'Expired': return 'bg-warning';
    case 'On Hold': return 'bg-secondary';
    default: return 'bg-gray-500';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDaysUntil = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOfferExpired = (offer: IOfferLetter): boolean => {
  const offerDate = new Date(offer.offerDate);
  const expiryDate = new Date(offerDate);
  expiryDate.setDate(expiryDate.getDate() + 15); // Offers expire in 15 days
  
  return new Date() > expiryDate && offer.offerStatus === 'Sent';
};

