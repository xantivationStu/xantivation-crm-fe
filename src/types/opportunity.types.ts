import { ServiceInterest } from './lead.types';

export enum OpportunityStage {
  PROSPECTING = 'PROSPECTING',
  QUALIFICATION = 'QUALIFICATION',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export interface Opportunity {
  id: string;
  opportunityCode: string;
  name: string;
  accountId: string;
  account?: {
    id: string;
    customerCode: string;
    name: string;
  };
  contactId: string;
  contact?: {
    id: string;
    firstName?: string;
    lastName: string;
    email: string;
    phone: string;
  };
  amount: number;
  stage: OpportunityStage;
  probability?: number;
  expectedCloseDate: string;
  serviceInterest?: ServiceInterest;
  description?: string;
  lostReason?: string;
  leadId?: string;
  ownerId?: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityDto {
  name: string;
  accountId: string;
  contactId: string;
  amount: number;
  stage?: OpportunityStage;
  probability?: number;
  expectedCloseDate: string;
  serviceInterest?: ServiceInterest;
  description?: string;
  leadId?: string;
  ownerId?: string;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {
  lostReason?: string;
}
