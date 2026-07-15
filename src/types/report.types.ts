import { OpportunityStage } from './opportunity.types';
import { PaymentStatus } from './contract.types';

export interface ReportSummary {
  totalPipelineValue: number;
  wonThisMonth: number;
  overdueAmount: number;
  forecast30Days: number;
}

export interface FunnelStageData {
  stage: OpportunityStage;
  count: number;
  totalValue: number;
}

export interface PipelineReport {
  funnel: FunnelStageData[];
  conversionRates: {
    leadToCustomer: number;
    proposalToWon: number;
    qualifiedRate: number;
  };
  breakdown: Array<{
    stage: OpportunityStage;
    count: number;
    totalValue: number;
    avgDaysInStage: number;
    winRate: number;
  }>;
}

export interface TopOpportunityForecast {
  id: string;
  code: string;
  name: string;
  account: string;
  stage: OpportunityStage;
  amount: number;
  probability: number;
  weightedValue: number;
  expectedClose: string;
}

export interface SalesForecastReport {
  monthlyForecast: Array<{
    period: string;
    weightedValue: number;
    actualValue: number;
  }>;
  topOpportunities: TopOpportunityForecast[];
}

export interface InvoiceTrackingItem {
  invoiceCode: string;
  account: string;
  milestone: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  daysOverdue: number;
}

export interface PaymentReport {
  overdueSummary: {
    count: number;
    amount: number;
    avgDays: number;
  };
  cashFlow: Array<{
    period: string;
    planned: number;
    actual: number;
  }>;
  invoices: InvoiceTrackingItem[];
}
