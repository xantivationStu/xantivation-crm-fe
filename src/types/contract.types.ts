export enum ContractStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
}

export enum ContractType {
  SERVICE_AGREEMENT = 'SERVICE_AGREEMENT',
  NDA = 'NDA',
  SOW = 'SOW',
  AMENDMENT = 'AMENDMENT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface PaymentSchedule {
  id: string;
  milestoneName: string;
  milestonePercentage: number;
  amount: number;
  dueDate: string;
  invoiceCode?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paidDate?: string;
  paidAt?: string;
  paidAmount?: number;
  status: PaymentStatus;
  notes?: string;
  contractId?: string;
  contract?: any;
}

export interface Contract {
  id: string;
  contractCode: string;
  title: string;
  dealId: string;
  deal?: {
    dealCode: string;
    projectName: string;
  };
  accountId: string;
  account?: {
    name: string;
    email: string;
    phone: string;
  };
  contactId: string;
  contact?: {
    firstName?: string;
    lastName: string;
    email: string;
  };
  contractValue: number;
  contractType: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  signingDeadline?: string;
  signedDate?: string;
  termsConditions?: string;
  legalNotes?: string;
  attachments?: string[];
  esignEnvelopeId?: string;
  payments: PaymentSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractDto {
  title: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string;
  termsConditions?: string;
  legalNotes?: string;
}

export interface StartSigningDto {
  companySignerName: string;
  companySignerEmail: string;
  customerSignerName: string;
  customerSignerEmail: string;
  contractPdf?: string; // base64 or URL
}

export interface UpdatePaymentDto {
  invoiceCode?: string;
  invoiceDate?: string;
  paidDate?: string;
  paidAmount?: number;
  paymentStatus: PaymentStatus;
  paymentNotes?: string;
}
