'use client';

import React, { useState } from 'react';
import { Button, Select, Switch, message, Badge } from 'antd';
import { FloatingInput } from '@/components/FloatingInput';
import { Save, User, Shield, Radio, Key, Plus } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
}

const initialUsers: UserRecord[] = [
  { id: '1', name: 'System Admin', email: 'admin@xantivation.studio', role: 'ADMIN' },
  { id: '2', name: 'John Doe', email: 'john@xantivation.studio', role: 'SALES_REP' },
  { id: '3', name: 'Jane Smith', email: 'jane@xantivation.studio', role: 'SALES_MANAGER' },
  { id: '4', name: 'Alice Accountant', email: 'alice@xantivation.studio', role: 'ACCOUNTANT' },
];

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // --- Profile State ---
  const [profileName, setProfileName] = useState('System Admin');
  const [profileEmail, setProfileEmail] = useState('admin@xantivation.studio');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileLanguage, setProfileLanguage] = useState('en');
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // --- Users State ---
  const [usersList, setUsersList] = useState<UserRecord[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userPasswordInput, setUserPasswordInput] = useState('');
  const [userRoleInput, setUserRoleInput] = useState('SALES_REP');
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [userModalOpen, setUserModalOpen] = useState(false);

  // --- AI Governance State ---
  const [leadBantSync, setLeadBantSync] = useState(true);
  const [oppCoach, setOppCoach] = useState(true);
  const [quoFollowUp, setQuoFollowUp] = useState(true);
  const [contractRisk, setContractRisk] = useState(true);
  const [autonomyMode, setAutonomyMode] = useState('AUTO');
  const [sensitivityThreshold, setSensitivityThreshold] = useState('MEDIUM');

  // --- Integrations State ---
  // Chatwoot
  const [chatwootUrl, setChatwootUrl] = useState('http://localhost:3100');
  const [chatwootToken, setChatwootToken] = useState('cw_access_token_super_secret_991823');
  const [chatwootAccountId, setChatwootAccountId] = useState('1');
  const [chatwootInboxId, setChatwootInboxId] = useState('1');
  const [chatwootSecret, setChatwootSecret] = useState('');
  const [chatwootStatus, setChatwootStatus] = useState<null | 'success' | 'failed'>(null);

  // DocuSign
  const [docusignKey, setDocusignKey] = useState('e5d8b74c-473d-4c3e-89a1-778899aabbcc');
  const [docusignSecret, setDocusignSecret] = useState('ds_secret_key_mock_value');
  const [docusignAccountId, setDocusignAccountId] = useState('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d');
  const [docusignUserId, setDocusignUserId] = useState('f1e2d3c4-b5a6-9f8e-7d6c-5b4a3f2e1d0c');
  const [docusignRsaKey, setDocusignRsaKey] = useState('-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0yV...\n-----END RSA PRIVATE KEY-----');
  const [docusignAuthServer, setDocusignAuthServer] = useState('account-d.docusign.com');
  const [docusignBaseUrl, setDocusignBaseUrl] = useState('https://demo.docusign.net/restapi');
  const [docusignHmacKey, setDocusignHmacKey] = useState('');
  const [docusignReturnUrl, setDocusignReturnUrl] = useState('http://localhost:3000/contracts/{contractId}');
  const [docusignStatus, setDocusignStatus] = useState<null | 'success' | 'failed'>(null);

  // Resend
  const [resendApiKey, setResendApiKey] = useState('re_dummykey_123456');
  const [resendFromEmail, setResendFromEmail] = useState('crm@xantivation.studio');
  const [resendFromName, setResendFromName] = useState('Xantivation Studio CRM');
  const [resendStatus, setResendStatus] = useState<null | 'success' | 'failed'>(null);

  // Groq
  const [groqKey, setGroqKey] = useState('gq_api_key_llama3_3_70b_versatile');
  const [groqModel, setGroqModel] = useState('llama-3.3-70b-versatile');
  const [groqMaxTokens, setGroqMaxTokens] = useState('2048');
  const [groqTemperature, setGroqTemperature] = useState('0.3');
  const [groqStatus, setGroqStatus] = useState<null | 'success' | 'failed'>(null);

  // DeerFlow
  const [deerflowUrl, setDeerflowUrl] = useState('http://localhost:8000');
  const [deerflowKey, setDeerflowKey] = useState('df_dummykey_90d21a');
  const [deerflowModel, setDeerflowModel] = useState('deerflow-llama3-8b');
  const [deerflowTimeout, setDeerflowTimeout] = useState('30000');
  const [deerflowStatus, setDeerflowStatus] = useState<null | 'success' | 'failed'>(null);

  // Hermes
  const [hermesUrl, setHermesUrl] = useState('http://localhost:9000');
  const [hermesKey, setHermesKey] = useState('hermes_dummykey_88b122');
  const [hermesModel, setHermesModel] = useState('hermes-agent-v1');
  const [hermesTgToken, setHermesTgToken] = useState('');
  const [hermesZaloToken, setHermesZaloToken] = useState('');
  const [hermesStatus, setHermesStatus] = useState<null | 'success' | 'failed'>(null);

  const [integrationErrors, setIntegrationErrors] = useState<Record<string, string>>({});

  // --- Helper Validations ---
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateGuid = (guid: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid);
  };

  // --- Connection Testers ---
  const testChatwootConnection = () => {
    const errs: Record<string, string> = {};
    if (!chatwootUrl || !validateUrl(chatwootUrl)) {
      errs.chatwoot_base_url = 'Chatwoot URL is required';
    }
    if (!chatwootToken || chatwootToken.length < 20) {
      errs.chatwoot_api_access_token = 'API token is required';
    }
    if (!chatwootAccountId || isNaN(Number(chatwootAccountId))) {
      errs.chatwoot_account_id = 'Account ID is required';
    }

    if (Object.keys(errs).length > 0) {
      setIntegrationErrors(errs);
      setChatwootStatus('failed');
      message.error('Validation failed for Chatwoot Integration.');
      return;
    }

    setIntegrationErrors({});
    setChatwootStatus(null);
    message.loading('Testing connection to Chatwoot...');
    setTimeout(() => {
      setChatwootStatus('success');
      message.success('Chatwoot Connection test passed successfully!');
    }, 1500);
  };

  const testDocuSignConnection = () => {
    const errs: Record<string, string> = {};
    if (!docusignKey || !validateGuid(docusignKey)) {
      errs.docusign_integration_key = 'Integration Key must be a valid GUID format';
    }
    if (!docusignSecret) {
      errs.docusign_secret_key = 'Secret Key is required';
    }
    if (!docusignAccountId || !validateGuid(docusignAccountId)) {
      errs.docusign_account_id = 'Account ID must be a valid GUID format';
    }
    if (!docusignUserId || !validateGuid(docusignUserId)) {
      errs.docusign_user_id = 'User ID must be a valid GUID format';
    }
    if (!docusignRsaKey || !docusignRsaKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')) {
      errs.docusign_rsa_private_key = 'RSA Private Key is required and must start with -----BEGIN RSA PRIVATE KEY-----';
    }

    if (Object.keys(errs).length > 0) {
      setIntegrationErrors(errs);
      setDocusignStatus('failed');
      message.error('Validation failed for DocuSign Integration.');
      return;
    }

    setIntegrationErrors({});
    setDocusignStatus(null);
    message.loading('Requesting DocuSign JWT Token...');
    setTimeout(() => {
      setDocusignStatus('success');
      message.success('DocuSign Connection verified successfully!');
    }, 1500);
  };

  const testResendConnection = () => {
    const errs: Record<string, string> = {};
    if (!resendApiKey) {
      errs.resend_api_key = 'Resend API Key is required';
    }
    if (!resendFromEmail || !resendFromEmail.includes('@')) {
      errs.resend_from_email = 'From Email is required';
    }
    if (!resendFromName) {
      errs.resend_from_name = 'From Name is required';
    }

    if (Object.keys(errs).length > 0) {
      setIntegrationErrors(errs);
      setResendStatus('failed');
      message.error('Validation failed for Resend Integration.');
      return;
    }

    setIntegrationErrors({});
    setResendStatus(null);
    message.loading('Testing Resend mail gateway...');
    setTimeout(() => {
      setResendStatus('success');
      message.success('Resend connection verified!');
    }, 1500);
  };

  const testGroqConnection = () => {
    const errs: Record<string, string> = {};
    if (!groqKey) {
      errs.groq_api_key = 'Groq API Key is required';
    }
    if (!groqModel) {
      errs.groq_model = 'Model is required';
    }

    if (Object.keys(errs).length > 0) {
      setIntegrationErrors(errs);
      setGroqStatus('failed');
      message.error('Validation failed for Groq Integration.');
      return;
    }

    setIntegrationErrors({});
    setGroqStatus(null);
    message.loading('Testing Groq Llama-3.3 inference...');
    setTimeout(() => {
      setGroqStatus('success');
      message.success('Groq connection verified!');
    }, 1500);
  };

  const testDeerFlowConnection = () => {
    const errs: Record<string, string> = {};
    if (!deerflowUrl || !validateUrl(deerflowUrl)) {
      errs.deerflow_base_url = 'DeerFlow Endpoint is required';
    }
    if (!deerflowKey) {
      errs.deerflow_api_key = 'DeerFlow API Key is required';
    }
    if (!deerflowModel) {
      errs.deerflow_model = 'DeerFlow Model is required';
    }

    if (Object.keys(errs).length > 0) {
      setIntegrationErrors(errs);
      setDeerflowStatus('failed');
      message.error('Validation failed for DeerFlow Integration.');
      return;
    }

    setIntegrationErrors({});
    setDeerflowStatus(null);
    message.loading('Testing connection to Python DeerFlow sidecar...');
    setTimeout(() => {
      setDeerflowStatus('success');
      message.success('DeerFlow connection verified!');
    }, 1500);
  };

  const testHermesConnection = () => {
    const errs: Record<string, string> = {};
    if (!hermesUrl || !validateUrl(hermesUrl)) {
      errs.hermes_base_url = 'Hermes Endpoint is required';
    }
    if (!hermesKey) {
      errs.hermes_api_key = 'Hermes API Key is required';
    }
    if (!hermesModel) {
      errs.hermes_model = 'Hermes Model is required';
    }

    if (Object.keys(errs).length > 0) {
      setIntegrationErrors(errs);
      setHermesStatus('failed');
      message.error('Validation failed for Hermes Integration.');
      return;
    }

    setIntegrationErrors({});
    setHermesStatus(null);
    message.loading('Testing connection to Hermes Telegram/Zalo gateway...');
    setTimeout(() => {
      setHermesStatus('success');
      message.success('Hermes connection verified!');
    }, 1500);
  };

  // --- CRUD Users ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserNameInput('');
    setUserEmailInput('');
    setUserPasswordInput('');
    setUserRoleInput('SALES_REP');
    setUserErrors({});
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (record: UserRecord) => {
    setEditingUser(record);
    setUserNameInput(record.name);
    setUserEmailInput(record.email);
    setUserPasswordInput('');
    setUserRoleInput(record.role);
    setUserErrors({});
    setUserModalOpen(true);
  };

  const handleSaveUser = () => {
    const errs: Record<string, string> = {};
    if (!userNameInput.trim()) errs.name = 'Name is required';
    if (!userEmailInput.trim() || !userEmailInput.includes('@')) errs.email = 'Valid Email is required';
    if (!editingUser && !userPasswordInput) errs.password = 'Password is required for new users';

    if (Object.keys(errs).length > 0) {
      setUserErrors(errs);
      return;
    }

    if (editingUser) {
      setUsersList(
        usersList.map((u) => (u.id === editingUser.id ? { ...u, name: userNameInput, email: userEmailInput, role: userRoleInput } : u)),
      );
      message.success('User updated successfully');
    } else {
      const newUser: UserRecord = {
        id: String(usersList.length + 1),
        name: userNameInput,
        email: userEmailInput,
        role: userRoleInput,
      };
      setUsersList([...usersList, newUser]);
      message.success('User created successfully');
    }
    setUserModalOpen(false);
  };

  const handleDeleteUser = (record: UserRecord) => {
    setUsersList(usersList.filter((u) => u.id !== record.id));
    message.success('User deleted successfully');
  };

  const handleSaveProfile = () => {
    const errs: Record<string, string> = {};
    if (!profileName.trim()) errs.name = 'Name is required';
    if (!profileEmail.trim() || !profileEmail.includes('@')) errs.email = 'Valid Email is required';

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    message.loading('Saving profile changes...');
    setTimeout(() => {
      message.success('Profile changes saved successfully.');
    }, 1000);
  };

  const userColumns: ColumnProps<UserRecord>[] = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (val) => <span className="font-semibold text-[var(--color-fg)]">{val}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (role === 'ADMIN') color = 'bg-red-500/10 text-red-500';
        if (role === 'SALES_MANAGER') color = 'bg-indigo-500/10 text-indigo-500';
        if (role === 'ACCOUNTANT') color = 'bg-amber-500/10 text-amber-500';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{role}</span>;
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Settings</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Configure external integrations, user management, and AI thresholds.</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[var(--color-border)] gap-6 pb-px">
        {[
          { id: 'profile', name: 'Profile', icon: User },
          { id: 'users', name: 'User Management', icon: Shield },
          { id: 'ai-governance', name: 'AI Governance', icon: Radio },
          { id: 'integrations', name: 'Integrations', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-transparent text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
              }`}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Bodies */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[400px]">
        {activeSubTab === 'profile' && (
          <div className="max-w-xl space-y-6">
            <h3 className="text-sm font-semibold text-[var(--color-fg)]">Personal Profile Information</h3>
            <div className="space-y-4">
              <div>
                <FloatingInput label="Full Name" value={profileName} onChange={setProfileName} required />
                {profileErrors.name && <p className="text-red-500 text-[10px] mt-1">{profileErrors.name}</p>}
              </div>
              <div>
                <FloatingInput label="Email Address" value={profileEmail} onChange={setProfileEmail} required />
                {profileErrors.email && <p className="text-red-500 text-[10px] mt-1">{profileErrors.email}</p>}
              </div>
              <div>
                <FloatingInput label="Change Password (Optional)" type="password" value={profilePassword} onChange={setProfilePassword} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Preferred Language
                </label>
                <Select
                  value={profileLanguage}
                  onChange={setProfileLanguage}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'vi', label: 'Tiếng Việt' },
                    { value: 'ja', label: '日本語' },
                  ]}
                  className="w-full h-11"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="primary" onClick={handleSaveProfile} className="flex items-center gap-2 h-10 px-5 rounded-xl cursor-pointer">
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        )}

        {activeSubTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">User Accounts (Admin Only)</h3>
              <Button type="primary" onClick={handleOpenCreateUser} className="flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer">
                <Plus size={14} />
                <span>Add User</span>
              </Button>
            </div>

            <SharedTable
              columns={userColumns}
              dataSource={usersList}
              onEdit={handleOpenEditUser}
              onDelete={handleDeleteUser}
            />

            {/* Simulated CRUD Modal */}
            {userModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md space-y-6 shadow-xl">
                  <h4 className="font-semibold text-lg text-[var(--color-fg)]">
                    {editingUser ? 'Edit User details' : 'Create User account'}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <FloatingInput label="Full Name" value={userNameInput} onChange={setUserNameInput} required />
                      {userErrors.name && <p className="text-red-500 text-[10px] mt-1">{userErrors.name}</p>}
                    </div>
                    <div>
                      <FloatingInput label="Email Address" value={userEmailInput} onChange={setUserEmailInput} required />
                      {userErrors.email && <p className="text-red-500 text-[10px] mt-1">{userErrors.email}</p>}
                    </div>
                    <div>
                      <FloatingInput label="Password" type="password" value={userPasswordInput} onChange={setUserPasswordInput} required={!editingUser} />
                      {userErrors.password && <p className="text-red-500 text-[10px] mt-1">{userErrors.password}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">User Role</label>
                      <Select
                        value={userRoleInput}
                        onChange={setUserRoleInput}
                        options={[
                          { value: 'SALES_REP', label: 'Sales Representative' },
                          { value: 'SALES_MANAGER', label: 'Sales Manager' },
                          { value: 'ACCOUNTANT', label: 'Accountant' },
                          { value: 'ADMIN', label: 'Administrator' },
                        ]}
                        className="w-full h-11"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button onClick={() => setUserModalOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button type="primary" onClick={handleSaveUser} className="rounded-xl">Save</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'ai-governance' && (
          <div className="max-w-xl space-y-8">
            <h3 className="text-sm font-semibold text-[var(--color-fg)]">AI Features Governance</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-semibold text-xs text-[var(--color-fg)]">Lead BANT Syncing</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)]">Auto score leads on budget and authority parameters.</p>
                </div>
                <Switch checked={leadBantSync} onChange={setLeadBantSync} />
              </div>

              <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-semibold text-xs text-[var(--color-fg)]">Opportunity Coach</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)]">Suggests next actions on active pipeline steps.</p>
                </div>
                <Switch checked={oppCoach} onChange={setOppCoach} />
              </div>

              <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-semibold text-xs text-[var(--color-fg)]">Quotation Follow-up</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)]">Propose email drafts based on customer timeline rules.</p>
                </div>
                <Switch checked={quoFollowUp} onChange={setQuoFollowUp} />
              </div>

              <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-semibold text-xs text-[var(--color-fg)]">Contract Risk Audit</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)]">DeerFlow analysis flags problematic clauses.</p>
                </div>
                <Switch checked={contractRisk} onChange={setContractRisk} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Autonomy Mode</label>
                <Select
                  value={autonomyMode}
                  onChange={setAutonomyMode}
                  options={[
                    { value: 'AUTO', label: 'Autonomous (Auto Pilot)' },
                    { value: 'MANUAL', label: 'Manual Approval' },
                  ]}
                  className="w-full h-11"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Sensitivity Threshold</label>
                <Select
                  value={sensitivityThreshold}
                  onChange={setSensitivityThreshold}
                  options={[
                    { value: 'LOW', label: 'Low sensitivity' },
                    { value: 'MEDIUM', label: 'Medium sensitivity' },
                    { value: 'HIGH', label: 'High sensitivity' },
                  ]}
                  className="w-full h-11"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="primary" onClick={() => message.success('AI Governance thresholds updated successfully')} className="flex items-center gap-2 h-10 px-5 rounded-xl cursor-pointer">
                <Save size={16} />
                <span>Save Governance Settings</span>
              </Button>
            </div>
          </div>
        )}

        {activeSubTab === 'integrations' && (
          <div className="space-y-8">
            <h3 className="text-sm font-semibold text-[var(--color-fg)]">Integrations Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chatwoot Section */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--color-fg)]">Chatwoot Gateway</h4>
                  <div className="flex items-center gap-2">
                    {chatwootStatus === 'success' && <Badge status="success" text="Connected" />}
                    {chatwootStatus === 'failed' && <Badge status="error" text="Failed" />}
                    <Button size="small" onClick={testChatwootConnection}>Test Connection</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FloatingInput label="Chatwoot Base URL" value={chatwootUrl} onChange={setChatwootUrl} required />
                  {integrationErrors.chatwoot_base_url && <p className="text-red-500 text-[10px]">{integrationErrors.chatwoot_base_url}</p>}
                  <FloatingInput label="API Access Token" type="password" value={chatwootToken} onChange={setChatwootToken} required />
                  {integrationErrors.chatwoot_api_access_token && <p className="text-red-500 text-[10px]">{integrationErrors.chatwoot_api_access_token}</p>}
                  <FloatingInput label="Account ID" value={chatwootAccountId} onChange={setChatwootAccountId} required />
                  {integrationErrors.chatwoot_account_id && <p className="text-red-500 text-[10px]">{integrationErrors.chatwoot_account_id}</p>}
                  <FloatingInput label="Inbox ID (Optional)" value={chatwootInboxId} onChange={setChatwootInboxId} />
                  <FloatingInput label="Webhook Secret (Optional)" type="password" value={chatwootSecret} onChange={setChatwootSecret} />
                </div>
              </div>

              {/* DocuSign Section */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--color-fg)]">DocuSign (E-Signature)</h4>
                  <div className="flex items-center gap-2">
                    {docusignStatus === 'success' && <Badge status="success" text="Connected" />}
                    {docusignStatus === 'failed' && <Badge status="error" text="Failed" />}
                    <Button size="small" onClick={testDocuSignConnection}>Test Connection</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FloatingInput label="Integration Key (GUID)" value={docusignKey} onChange={setDocusignKey} required />
                  {integrationErrors.docusign_integration_key && <p className="text-red-500 text-[10px]">{integrationErrors.docusign_integration_key}</p>}
                  <FloatingInput label="Secret Key" type="password" value={docusignSecret} onChange={setDocusignSecret} required />
                  {integrationErrors.docusign_secret_key && <p className="text-red-500 text-[10px]">{integrationErrors.docusign_secret_key}</p>}
                  <FloatingInput label="Account ID (GUID)" value={docusignAccountId} onChange={setDocusignAccountId} required />
                  {integrationErrors.docusign_account_id && <p className="text-red-500 text-[10px]">{integrationErrors.docusign_account_id}</p>}
                  <FloatingInput label="User ID (GUID)" value={docusignUserId} onChange={setDocusignUserId} required />
                  {integrationErrors.docusign_user_id && <p className="text-red-500 text-[10px]">{integrationErrors.docusign_user_id}</p>}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">RSA Private Key</label>
                    <textarea
                      value={docusignRsaKey}
                      onChange={(e) => setDocusignRsaKey(e.target.value)}
                      className="w-full h-20 p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[10px] font-mono text-[var(--color-fg)]"
                    />
                    {integrationErrors.docusign_rsa_private_key && <p className="text-red-500 text-[10px]">{integrationErrors.docusign_rsa_private_key}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Auth Server</label>
                    <Select
                      value={docusignAuthServer}
                      onChange={setDocusignAuthServer}
                      options={[
                        { value: 'account-d.docusign.com', label: 'account-d.docusign.com (Developer)' },
                        { value: 'account.docusign.com', label: 'account.docusign.com (Production)' },
                      ]}
                      className="h-10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Base URL</label>
                    <Select
                      value={docusignBaseUrl}
                      onChange={setDocusignBaseUrl}
                      options={[
                        { value: 'https://demo.docusign.net/restapi', label: 'https://demo.docusign.net/restapi (Developer)' },
                        { value: 'https://na1.docusign.net/restapi', label: 'https://na1.docusign.net/restapi (Production US)' },
                      ]}
                      className="h-10"
                    />
                  </div>

                  <FloatingInput label="Webhook HMAC Key (Optional)" type="password" value={docusignHmacKey} onChange={setDocusignHmacKey} />
                  <FloatingInput label="Return URL Reference" value={docusignReturnUrl} onChange={setDocusignReturnUrl} />
                  <FloatingInput label="Webhook URL (Read Only)" value="http://localhost:3001/api/v1/contracts/esign/webhook" onChange={() => {}} />
                </div>
              </div>

              {/* Resend Section */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--color-fg)]">Resend (Email Gateway)</h4>
                  <div className="flex items-center gap-2">
                    {resendStatus === 'success' && <Badge status="success" text="Connected" />}
                    {resendStatus === 'failed' && <Badge status="error" text="Failed" />}
                    <Button size="small" onClick={testResendConnection}>Test Connection</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FloatingInput label="Resend API Key" type="password" value={resendApiKey} onChange={setResendApiKey} required />
                  {integrationErrors.resend_api_key && <p className="text-red-500 text-[10px]">{integrationErrors.resend_api_key}</p>}
                  <FloatingInput label="From Email" value={resendFromEmail} onChange={setResendFromEmail} required />
                  {integrationErrors.resend_from_email && <p className="text-red-500 text-[10px]">{integrationErrors.resend_from_email}</p>}
                  <FloatingInput label="From Name" value={resendFromName} onChange={setResendFromName} required />
                  {integrationErrors.resend_from_name && <p className="text-red-500 text-[10px]">{integrationErrors.resend_from_name}</p>}
                </div>
              </div>

              {/* Groq Section */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--color-fg)]">Groq (AI Engine)</h4>
                  <div className="flex items-center gap-2">
                    {groqStatus === 'success' && <Badge status="success" text="Connected" />}
                    {groqStatus === 'failed' && <Badge status="error" text="Failed" />}
                    <Button size="small" onClick={testGroqConnection}>Test Connection</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FloatingInput label="Groq API Key" type="password" value={groqKey} onChange={setGroqKey} required />
                  {integrationErrors.groq_api_key && <p className="text-red-500 text-[10px]">{integrationErrors.groq_api_key}</p>}
                  <FloatingInput label="Custom Model Name" value={groqModel} onChange={setGroqModel} required />
                  {integrationErrors.groq_model && <p className="text-red-500 text-[10px]">{integrationErrors.groq_model}</p>}
                  <FloatingInput label="Max Tokens Limit (Optional)" type="number" value={groqMaxTokens} onChange={setGroqMaxTokens} />
                  <FloatingInput label="Temperature Float (Optional)" value={groqTemperature} onChange={setGroqTemperature} />
                </div>
              </div>

              {/* DeerFlow Section */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--color-fg)]">DeerFlow Sidecar</h4>
                  <div className="flex items-center gap-2">
                    {deerflowStatus === 'success' && <Badge status="success" text="Connected" />}
                    {deerflowStatus === 'failed' && <Badge status="error" text="Failed" />}
                    <Button size="small" onClick={testDeerFlowConnection}>Test Connection</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FloatingInput label="Endpoint Base URL" value={deerflowUrl} onChange={setDeerflowUrl} required />
                  {integrationErrors.deerflow_base_url && <p className="text-red-500 text-[10px]">{integrationErrors.deerflow_base_url}</p>}
                  <FloatingInput label="API Key" type="password" value={deerflowKey} onChange={setDeerflowKey} required />
                  {integrationErrors.deerflow_api_key && <p className="text-red-500 text-[10px]">{integrationErrors.deerflow_api_key}</p>}
                  <FloatingInput label="Model Name" value={deerflowModel} onChange={setDeerflowModel} required />
                  {integrationErrors.deerflow_model && <p className="text-red-500 text-[10px]">{integrationErrors.deerflow_model}</p>}
                  <FloatingInput label="Timeout Milliseconds (Optional)" type="number" value={deerflowTimeout} onChange={setDeerflowTimeout} />
                </div>
              </div>

              {/* Hermes Section */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--color-fg)]">Hermes Gateway</h4>
                  <div className="flex items-center gap-2">
                    {hermesStatus === 'success' && <Badge status="success" text="Connected" />}
                    {hermesStatus === 'failed' && <Badge status="error" text="Failed" />}
                    <Button size="small" onClick={testHermesConnection}>Test Connection</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <FloatingInput label="Endpoint Base URL" value={hermesUrl} onChange={setHermesUrl} required />
                  {integrationErrors.hermes_base_url && <p className="text-red-500 text-[10px]">{integrationErrors.hermes_base_url}</p>}
                  <FloatingInput label="API Key" type="password" value={hermesKey} onChange={setHermesKey} required />
                  {integrationErrors.hermes_api_key && <p className="text-red-500 text-[10px]">{integrationErrors.hermes_api_key}</p>}
                  <FloatingInput label="Model Name" value={hermesModel} onChange={setHermesModel} required />
                  {integrationErrors.hermes_model && <p className="text-red-500 text-[10px]">{integrationErrors.hermes_model}</p>}
                  <FloatingInput label="Telegram Bot Token (Optional)" type="password" value={hermesTgToken} onChange={setHermesTgToken} />
                  <FloatingInput label="Zalo OA Token (Optional)" type="password" value={hermesZaloToken} onChange={setHermesZaloToken} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="primary" onClick={() => message.success('All settings saved successfully')} className="flex items-center gap-2 h-10 px-5 rounded-xl cursor-pointer">
                <Save size={16} />
                <span>Save All Integrations</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
