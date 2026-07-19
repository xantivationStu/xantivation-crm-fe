import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  // AI Governance
  leadBantSync: boolean;
  oppCoach: boolean;
  quoFollowUp: boolean;
  contractRisk: boolean;
  autonomyMode: string;
  sensitivityThreshold: string;

  // Integrations - Chatwoot
  chatwootUrl: string;
  chatwootToken: string;
  chatwootAccountId: string;
  chatwootInboxId: string;
  chatwootSecret: string;

  // Integrations - DocuSign
  docusignKey: string;
  docusignSecret: string;
  docusignAccountId: string;
  docusignUserId: string;
  docusignRsaKey: string;
  docusignAuthServer: string;
  docusignBaseUrl: string;
  docusignHmacKey: string;
  docusignReturnUrl: string;

  // Integrations - Resend
  resendApiKey: string;
  resendFromEmail: string;
  resendFromName: string;

  // Integrations - ERP
  erpUrl: string;
  erpDb: string;
  erpUsername: string;
  erpPassword?: string;
  erpAutoSyncCustomers: boolean;
  erpAutoSyncLeads: boolean;
  erpAutoSyncOpportunities: boolean;
  erpAutoSyncQuotations: boolean;
  erpAutoSyncPayments: boolean;
  erpAutoSyncMeetings: boolean;
  erpAutoSyncSalesTeams: boolean;
  erpAutoSyncUtm: boolean;
  erpAutoSyncActivities: boolean;

  updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // AI Governance Defaults
      leadBantSync: true,
      oppCoach: true,
      quoFollowUp: true,
      contractRisk: true,
      autonomyMode: 'AUTO',
      sensitivityThreshold: 'MEDIUM',

      // Chatwoot Defaults
      chatwootUrl: 'http://localhost:3100',
      chatwootToken: 'cw_access_token_super_secret_991823',
      chatwootAccountId: '1',
      chatwootInboxId: '1',
      chatwootSecret: '',

      // DocuSign Defaults
      docusignKey: 'e5d8b74c-473d-4c3e-89a1-778899aabbcc',
      docusignSecret: 'ds_secret_key_mock_value',
      docusignAccountId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      docusignUserId: 'f1e2d3c4-b5a6-9f8e-7d6c-5b4a3f2e1d0c',
      docusignRsaKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0yV...\n-----END RSA PRIVATE KEY-----',
      docusignAuthServer: 'account-d.docusign.com',
      docusignBaseUrl: 'https://demo.docusign.net/restapi',
      docusignHmacKey: '',
      docusignReturnUrl: 'http://localhost:3000/contracts/{contractId}',

      // Resend Defaults
      resendApiKey: 're_dummykey_123456',
      resendFromEmail: 'crm@xantivation.studio',
      resendFromName: 'Xantivation Studio CRM',

      // ERP Defaults
      erpUrl: 'http://localhost:8069',
      erpDb: 'crm_db',
      erpUsername: 'admin',
      erpPassword: '',
      erpAutoSyncCustomers: false,
      erpAutoSyncLeads: false,
      erpAutoSyncOpportunities: false,
      erpAutoSyncQuotations: false,
      erpAutoSyncPayments: false,
      erpAutoSyncMeetings: false,
      erpAutoSyncSalesTeams: false,
      erpAutoSyncUtm: false,
      erpAutoSyncActivities: false,

      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'crm-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
