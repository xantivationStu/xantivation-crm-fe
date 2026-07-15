export enum QuotationStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum PackageType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  CUSTOM = 'CUSTOM',
}

export enum AdjustmentType {
  DISCOUNT = 'DISCOUNT',
  RUSH_FEE = 'RUSH_FEE',
  OTHER = 'OTHER',
}

export interface QuotationScopeItem {
  id?: string;
  itemName: string;
  description?: string;
  fixedPrice: number;
  estimatedEffort?: string;
  deliverables?: string;
}

export interface Quotation {
  id: string;
  quotationCode: string;
  version: number;
  opportunityId: string;
  opportunity?: {
    id: string;
    opportunityCode: string;
    name: string;
    amount: number;
    accountId: string;
    account?: {
      name: string;
    };
  };
  projectName: string;
  serviceType: string;
  packageType: PackageType;
  status: QuotationStatus;
  subtotal: number;
  adjustmentType?: AdjustmentType;
  adjustmentAmount?: number;
  adjustmentReason?: string;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  timeline?: string;
  revisionLimit?: number;
  paymentTerms?: string;
  termsConditions?: string;
  notes?: string;
  validUntil: string;
  ownerId?: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  items: QuotationScopeItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationDto {
  opportunityId: string;
  projectName: string;
  serviceType: string;
  packageType: PackageType;
  adjustmentType?: AdjustmentType;
  adjustmentAmount?: number;
  adjustmentReason?: string;
  taxPercent?: number;
  timeline?: string;
  revisionLimit?: number;
  paymentTerms?: string;
  termsConditions?: string;
  notes?: string;
  validUntil: string;
  items: QuotationScopeItem[];
}
