export enum DealStage {
  DRAFT = 'DRAFT',
  INTERNAL_REVIEW = 'INTERNAL_REVIEW',
  CUSTOMER_REVIEW = 'CUSTOMER_REVIEW',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export interface DealPaymentMilestone {
  id?: string;
  milestoneName: string;
  percentage: number;
  amount: number;
  dueDate: string;
  acceptanceCondition?: string;
}

export interface Deal {
  id: string;
  dealCode: string;
  quotationId: string;
  quotation?: {
    quotationCode: string;
    items: Array<{
      itemName: string;
      fixedPrice: number;
    }>;
  };
  projectName: string;
  accountId: string;
  account?: {
    name: string;
  };
  contactId: string;
  contact?: {
    firstName?: string;
    lastName: string;
    email: string;
    phone: string;
  };
  dealValue: number;
  status: DealStage;
  expectedStart?: string;
  paymentTerms?: string;
  timeline?: string;
  reviewNotes?: string;
  milestones: DealPaymentMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface ConfigureMilestonesDto {
  milestones: Array<{
    milestoneName: string;
    percentage: number;
    dueDate: string;
    acceptanceCondition?: string;
  }>;
}

export interface SubmitReviewDto {
  reviewNotes?: string;
}
