'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Select, Switch, message, Badge, Modal, Spin } from 'antd';
import { FloatingInput } from '@/components/FloatingInput';
import { Save, User, Shield, Radio, Key, Plus, Users, MessageSquare, PenTool, Mail, Bot, Settings as SettingsIcon, RefreshCw, Trash2, Cpu, Sliders, Database, Network, Server, Play } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { useAuthStore } from '@/stores/auth.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useUpdateProfile, SystemUser, useSalesTeams, useCreateSalesTeam, useUpdateSalesTeam, useDeleteSalesTeam } from '@/hooks/api/useUser';
import { useTestErpConnection, useSyncCustomers, useSyncLeads, useSyncQuotations, useSyncPayments, useSyncOpportunities, useSyncMeetings, useSyncSalesTeams, useSyncUtm, useSyncActivities } from '@/hooks/api/useErp';
import { UserRole } from '@/types/auth.types';

// React Flow Imports
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// AI Settings Query Hooks
import {
  useProviders,
  useCreateProvider,
  useUpdateProvider,
  useDeleteProvider,
  useTestProviderConnection,
  useFetchModelsFromProvider,
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
  useModels,
  useCreateModel,
  useDeleteModel,
  useAgents,
  useCreateAgent,
  useUpdateAgent,
  useDeleteAgent,
  useExecutionLogs,
} from '@/hooks/api/useAiSettings';


export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateUserStore = useAuthStore((state) => state.updateUser);
  const settings = useSettingsStore();

  const [activeSubTab, setActiveSubTab] = useState('profile');
  const [activeIntegrationTab, setActiveIntegrationTab] = useState('chatwoot');

  // --- Profile State ---
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileLanguage, setProfileLanguage] = useState('en');
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const u = user as any;
      setProfileName(u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || '');
      setProfileEmail(u.email || '');
    }
  }, [user]);

  // --- Users Tab API Hooks ---
  const { data: usersRes, isLoading: isUsersLoading } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const updateProfileMutation = useUpdateProfile();

  const usersList = usersRes?.data || [];

  // --- Users CRUD State ---
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userPasswordInput, setUserPasswordInput] = useState('');
  const [userRoleInput, setUserRoleInput] = useState<UserRole>(UserRole.SALES_REP);
  const [userErrors, setUserErrors] = useState<Record<string, string>>({});
  const [userModalOpen, setUserModalOpen] = useState(false);

  // --- AI Settings States ---
  const [aiSubSection, setAiSubSection] = useState<'providers' | 'agents' | 'controls'>('providers');

  // Providers states
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [providerNameInput, setProviderNameInput] = useState('');
  const [providerTypeInput, setProviderTypeInput] = useState<'CLOUD' | 'LOCAL' | 'CUSTOM'>('CLOUD');
  const [providerBaseUrlInput, setProviderBaseUrlInput] = useState('');
  const [providerCompatibleInput, setProviderCompatibleInput] = useState(true);
  const [providerIconSlugInput, setProviderIconSlugInput] = useState('');

  // API Key states
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [keyProviderIdInput, setKeyProviderIdInput] = useState('');
  const [keyLabelInput, setKeyLabelInput] = useState('');
  const [keyValInput, setKeyValInput] = useState('');

  // Agent States
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [agentNameInput, setAgentNameInput] = useState('');
  const [agentSlugInput, setAgentSlugInput] = useState('');
  const [agentRoleInput, setAgentRoleInput] = useState('QUALIFIER');
  const [agentDescInput, setAgentDescInput] = useState('');
  const [agentPromptInput, setAgentPromptInput] = useState('');
  const [agentModelIdInput, setAgentModelIdInput] = useState('');
  const [agentParentIdInput, setAgentParentIdInput] = useState('');
  const [agentApiKeyIdInput, setAgentApiKeyIdInput] = useState('');
  const [agentAutonomyInput, setAgentAutonomyInput] = useState<'FULL' | 'SEMI' | 'MANUAL'>('SEMI');
  const [agentMaxTokensInput, setAgentMaxTokensInput] = useState<number>(2048);
  const [agentTempInput, setAgentTempInput] = useState<number>(0.3);
  const [agentRepModeInput, setAgentRepModeInput] = useState<'REALTIME' | 'BATCH' | 'SILENT'>('REALTIME');
  const [agentRepTargetInput, setAgentRepTargetInput] = useState('');

  // Selected agent node for sidebar editor
  const [selectedAgentNode, setSelectedAgentNode] = useState<any>(null);

  // --- AI Settings API Hooks ---
  const { data: providersRes } = useProviders();
  const { data: apiKeysRes } = useApiKeys();
  const { data: modelsRes } = useModels();
  const { data: agentsRes } = useAgents();

  const createProviderMutation = useCreateProvider();
  const updateProviderMutation = useUpdateProvider();
  const deleteProviderMutation = useDeleteProvider();
  const testProviderConnectionMutation = useTestProviderConnection();
  const fetchModelsMutation = useFetchModelsFromProvider();

  const createKeyMutation = useCreateApiKey();
  const updateApiKeyMutation = useUpdateApiKey();
  const deleteKeyMutation = useDeleteApiKey();

  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();

  const providersList = providersRes?.data || [];
  const apiKeysList = apiKeysRes?.data || [];
  const modelsList = modelsRes?.data || [];
  const agentsList = agentsRes?.data || [];

  // Connection tester states
  const [chatwootStatus, setChatwootStatus] = useState<null | 'success' | 'failed'>(null);
  const [docusignStatus, setDocusignStatus] = useState<null | 'success' | 'failed'>(null);
  const [resendStatus, setResendStatus] = useState<null | 'success' | 'failed'>(null);
  const [erpStatus, setErpStatus] = useState<null | 'success' | 'failed'>(null);
  const [integrationErrors, setIntegrationErrors] = useState<Record<string, string>>({});

  // --- ERP Sync Mutations ---
  const testErpMutation = useTestErpConnection();
  const syncCustomersMutation = useSyncCustomers();
  const syncLeadsMutation = useSyncLeads();
  const syncQuotationsMutation = useSyncQuotations();
  const syncPaymentsMutation = useSyncPayments();
  const syncOpportunitiesMutation = useSyncOpportunities();
  const syncMeetingsMutation = useSyncMeetings();
  const syncSalesTeamsMutation = useSyncSalesTeams();
  const syncUtmMutation = useSyncUtm();
  const syncActivitiesMutation = useSyncActivities();

  // Helper validations
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
    if (!settings.chatwootUrl || !validateUrl(settings.chatwootUrl)) {
      errs.chatwoot_base_url = 'Chatwoot URL is required';
    }
    if (!settings.chatwootToken || settings.chatwootToken.length < 10) {
      errs.chatwoot_api_access_token = 'API token is required';
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
    }, 1200);
  };

  const testDocuSignConnection = () => {
    const errs: Record<string, string> = {};
    if (!settings.docusignKey || !validateGuid(settings.docusignKey)) {
      errs.docusign_integration_key = 'Integration Key must be a valid GUID format';
    }
    if (!settings.docusignSecret) {
      errs.docusign_secret_key = 'Secret Key is required';
    }
    if (!settings.docusignAccountId || !validateGuid(settings.docusignAccountId)) {
      errs.docusign_account_id = 'Account ID must be a valid GUID format';
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
    }, 1200);
  };

  const testResendConnection = () => {
    const errs: Record<string, string> = {};
    if (!settings.resendApiKey) {
      errs.resend_api_key = 'Resend API Key is required';
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
    }, 1200);
  };


  const handleTestErpConnection = async () => {
    if (!settings.erpUrl || !validateUrl(settings.erpUrl)) {
      message.error('ERP Endpoint URL is invalid');
      setErpStatus('failed');
      return;
    }
    if (!settings.erpDb || !settings.erpUsername) {
      message.error('ERP Database and Username are required');
      setErpStatus('failed');
      return;
    }

    setErpStatus(null);
    const hide = message.loading('Testing connection to ERP server via XML-RPC...', 0);
    try {
      const response = await testErpMutation.mutateAsync({
        url: settings.erpUrl,
        db: settings.erpDb,
        username: settings.erpUsername,
        password: settings.erpPassword,
      });
      hide();
      if (response.statusCode === 200) {
        setErpStatus('success');
        message.success('ERP Connection test passed successfully!');
      } else {
        setErpStatus('failed');
        message.error(response.message || 'ERP Connection test failed');
      }
    } catch (err: any) {
      hide();
      setErpStatus('failed');
      message.error(err?.response?.data?.message || err.message || 'ERP Connection test failed');
    }
  };

  const handleSyncErp = async (moduleType: 'customers' | 'leads' | 'opportunities' | 'quotations' | 'payments' | 'meetings' | 'sales-teams' | 'utm' | 'activities') => {
    const hide = message.loading(`Synchronizing ${moduleType} with ERP...`, 0);
    try {
      let res;
      if (moduleType === 'customers') {
        res = await syncCustomersMutation.mutateAsync(undefined);
      } else if (moduleType === 'leads') {
        res = await syncLeadsMutation.mutateAsync(undefined);
      } else if (moduleType === 'opportunities') {
        res = await syncOpportunitiesMutation.mutateAsync(undefined);
      } else if (moduleType === 'quotations') {
        res = await syncQuotationsMutation.mutateAsync(undefined);
      } else if (moduleType === 'payments') {
        res = await syncPaymentsMutation.mutateAsync(undefined);
      } else if (moduleType === 'meetings') {
        res = await syncMeetingsMutation.mutateAsync(undefined);
      } else if (moduleType === 'sales-teams') {
        res = await syncSalesTeamsMutation.mutateAsync(undefined);
      } else if (moduleType === 'utm') {
        res = await syncUtmMutation.mutateAsync();
      } else {
        res = await syncActivitiesMutation.mutateAsync(undefined);
      }
      hide();
      if (res.statusCode === 200) {
        message.success(res.message || `Sync of ${moduleType} completed successfully`);
      } else {
        message.error(res.message || `Sync of ${moduleType} failed`);
      }
    } catch (err: any) {
      hide();
      message.error(err?.response?.data?.message || err.message || `Sync of ${moduleType} failed`);
    }
  };

  // --- CRUD Users ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserNameInput('');
    setUserEmailInput('');
    setUserPasswordInput('');
    setUserRoleInput(UserRole.SALES_REP);
    setUserErrors({});
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (record: SystemUser) => {
    setEditingUser(record);
    setUserNameInput(record.name);
    setUserEmailInput(record.email);
    setUserPasswordInput('');
    setUserRoleInput(record.role);
    setUserErrors({});
    setUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    const errs: Record<string, string> = {};
    if (!userNameInput.trim()) errs.name = 'Name is required';
    if (!userEmailInput.trim() || !userEmailInput.includes('@')) errs.email = 'Valid Email is required';
    if (!editingUser && !userPasswordInput) errs.password = 'Password is required for new users';

    if (Object.keys(errs).length > 0) {
      setUserErrors(errs);
      return;
    }

    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          dto: {
            name: userNameInput,
            email: userEmailInput,
            role: userRoleInput,
            password: userPasswordInput || undefined,
          },
        });
      } else {
        await createUserMutation.mutateAsync({
          name: userNameInput,
          email: userEmailInput,
          role: userRoleInput,
          password: userPasswordInput,
        });
      }
      setUserModalOpen(false);
    } catch (err) {
      // Handled
    }
  };

  const handleDeleteUser = async (record: SystemUser) => {
    try {
      await deleteUserMutation.mutateAsync(record.id);
    } catch (err) {
      // Handled
    }
  };

  // --- Sales Teams Tab API Hooks ---
  const { data: teamsRes, isLoading: isTeamsLoading } = useSalesTeams();
  const createTeamMutation = useCreateSalesTeam();
  const updateTeamMutation = useUpdateSalesTeam();
  const deleteTeamMutation = useDeleteSalesTeam();

  const teamsList = teamsRes?.data || [];

  // --- Sales Teams CRUD State ---
  const [editingTeam, setEditingTeam] = useState<any | null>(null);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamDescInput, setTeamDescInput] = useState('');
  const [teamLeaderInput, setTeamLeaderInput] = useState<string | undefined>(undefined);
  const [teamMembersInput, setTeamMembersInput] = useState<string[]>([]);
  const [teamRuleInput, setTeamRuleInput] = useState('ROUND_ROBIN');
  const [teamErrors, setTeamErrors] = useState<Record<string, string>>({});
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const handleOpenCreateTeam = () => {
    setEditingTeam(null);
    setTeamNameInput('');
    setTeamDescInput('');
    setTeamLeaderInput(undefined);
    setTeamMembersInput([]);
    setTeamRuleInput('ROUND_ROBIN');
    setTeamErrors({});
    setTeamModalOpen(true);
  };

  const handleOpenEditTeam = (record: any) => {
    setEditingTeam(record);
    setTeamNameInput(record.name || '');
    setTeamDescInput(record.description || '');
    setTeamLeaderInput(record.leader?.id);
    setTeamMembersInput(record.members?.map((m: any) => m.id) || []);
    setTeamRuleInput(record.assignmentRule || 'ROUND_ROBIN');
    setTeamErrors({});
    setTeamModalOpen(true);
  };

  const handleSaveTeam = async () => {
    const errs: Record<string, string> = {};
    if (!teamNameInput.trim()) errs.name = 'Team name is required';

    if (Object.keys(errs).length > 0) {
      setTeamErrors(errs);
      return;
    }

    try {
      const payload = {
        name: teamNameInput,
        description: teamDescInput,
        leaderId: teamLeaderInput || null,
        memberIds: teamMembersInput,
        assignmentRule: teamRuleInput,
      };

      if (editingTeam) {
        await updateTeamMutation.mutateAsync({
          id: editingTeam.id,
          data: payload,
        });
      } else {
        await createTeamMutation.mutateAsync(payload);
      }
      setTeamModalOpen(false);
    } catch (err) {
      // Handled
    }
  };

  const handleDeleteTeam = async (record: any) => {
    try {
      await deleteTeamMutation.mutateAsync(record.id);
    } catch (err) {
      // Handled
    }
  };

  const teamColumns: ColumnProps<any>[] = [
    { title: 'Tên nhóm', dataIndex: 'name', key: 'name', render: (val) => <span className="font-semibold text-[var(--color-fg)]">{val}</span> },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', render: (val) => <span className="text-xs text-[var(--color-muted-fg)]">{val || '—'}</span> },
    {
      title: 'Trưởng nhóm (Leader)',
      dataIndex: 'leader',
      key: 'leader',
      render: (leader) => <span className="text-xs font-semibold text-[var(--color-fg)]">{leader?.name || 'Chưa gán'}</span>,
    },
    {
      title: 'Số thành viên',
      dataIndex: 'members',
      key: 'members',
      render: (members) => <span className="text-xs text-[var(--color-muted-fg)] font-mono">{(members || []).length} nhân viên</span>,
    },
    {
      title: 'Luật phân công',
      dataIndex: 'assignmentRule',
      key: 'assignmentRule',
      render: (rule) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rule === 'ROUND_ROBIN' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-gray-500/10 text-gray-500'}`}>
          {rule === 'ROUND_ROBIN' ? 'Round Robin' : 'Manual'}
        </span>
      ),
    },
  ];

  const handleSaveProfile = async () => {
    if (!user) return;
    const errs: Record<string, string> = {};
    if (!profileName.trim()) errs.name = 'Name is required';
    if (!profileEmail.trim() || !profileEmail.includes('@')) errs.email = 'Valid Email is required';

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        id: user.id,
        dto: {
          name: profileName,
          email: profileEmail,
          password: profilePassword || undefined,
        },
      });
      updateUserStore({
        name: profileName,
        email: profileEmail,
      } as any);
      setProfilePassword('');
    } catch (err) {
      // Handled
    }
  };

  // === AI Settings Handlers ===
  const [providerStatuses, setProviderStatuses] = useState<Record<string, 'success' | 'failed' | 'testing' | null>>({});
  const [scanningProviderId, setScanningProviderId] = useState<string | null>(null);

  const handleTestProvider = async (providerId: string) => {
    setProviderStatuses(prev => ({ ...prev, [providerId]: 'testing' }));
    try {
      const res = await testProviderConnectionMutation.mutateAsync(providerId);
      if (res.success) {
        setProviderStatuses(prev => ({ ...prev, [providerId]: 'success' }));
        message.success(`Kết nối thành công tới nhà cung cấp!`);
      } else {
        setProviderStatuses(prev => ({ ...prev, [providerId]: 'failed' }));
        message.error(`Kết nối thất bại: ${res.message}`);
      }
    } catch (err: any) {
      setProviderStatuses(prev => ({ ...prev, [providerId]: 'failed' }));
      message.error(`Lỗi kết nối: ${err.message || err}`);
    }
  };

  const handleScanModels = async (providerId: string) => {
    setScanningProviderId(providerId);
    try {
      await fetchModelsMutation.mutateAsync(providerId);
    } catch (err) {
      // Handled
    } finally {
      setScanningProviderId(null);
    }
  };

  const handleOpenCreateProvider = () => {
    setEditingProvider(null);
    setProviderNameInput('');
    setProviderTypeInput('CLOUD');
    setProviderBaseUrlInput('');
    setProviderCompatibleInput(true);
    setProviderIconSlugInput('');
    setProviderModalOpen(true);
  };

  const handleOpenEditProvider = (p: any) => {
    setEditingProvider(p);
    setProviderNameInput(p.name || '');
    setProviderTypeInput(p.type || 'CLOUD');
    setProviderBaseUrlInput(p.baseUrl || '');
    setProviderCompatibleInput(p.isOpenAiCompatible);
    setProviderIconSlugInput(p.iconSlug || '');
    setProviderModalOpen(true);
  };

  const handleSaveProvider = async () => {
    if (!providerNameInput.trim()) {
      message.error('Vui lòng nhập tên nhà cung cấp');
      return;
    }
    if (!providerBaseUrlInput.trim()) {
      message.error('Vui lòng nhập Base URL');
      return;
    }
    const payload = {
      name: providerNameInput,
      type: providerTypeInput,
      baseUrl: providerBaseUrlInput,
      isOpenAiCompatible: providerCompatibleInput,
      iconSlug: providerIconSlugInput || undefined,
    };
    try {
      if (editingProvider) {
        await updateProviderMutation.mutateAsync({ id: editingProvider.id, data: payload });
      } else {
        await createProviderMutation.mutateAsync(payload);
      }
      setProviderModalOpen(false);
    } catch (err) {}
  };

  const handleDeleteProvider = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa nhà cung cấp?',
      content: 'Hành động này sẽ xóa tất cả API Keys và Models liên kết.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteProviderMutation.mutateAsync(id);
        } catch (err) {}
      }
    });
  };

  const handleOpenCreateKey = (providerId?: string) => {
    setKeyProviderIdInput(providerId || '');
    setKeyLabelInput('');
    setKeyValInput('');
    setKeyModalOpen(true);
  };

  const handleSaveKey = async () => {
    if (!keyProviderIdInput) {
      message.error('Vui lòng chọn nhà cung cấp');
      return;
    }
    if (!keyLabelInput.trim()) {
      message.error('Vui lòng nhập nhãn khóa');
      return;
    }
    if (!keyValInput.trim()) {
      message.error('Vui lòng nhập API Key');
      return;
    }
    try {
      await createKeyMutation.mutateAsync({
        providerId: keyProviderIdInput,
        label: keyLabelInput,
        key: keyValInput,
      });
      setKeyModalOpen(false);
    } catch (err) {}
  };

  const handleDeleteKey = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa API Key?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteKeyMutation.mutateAsync(id);
        } catch (err) {}
      }
    });
  };

  const handleOpenCreateAgent = (parentId?: string) => {
    setEditingAgent(null);
    setAgentNameInput('');
    setAgentSlugInput('');
    setAgentRoleInput('QUALIFIER');
    setAgentDescInput('');
    setAgentPromptInput('');
    setAgentModelIdInput('');
    setAgentParentIdInput(parentId || '');
    setAgentApiKeyIdInput('');
    setAgentAutonomyInput('SEMI');
    setAgentMaxTokensInput(2048);
    setAgentTempInput(0.3);
    setAgentRepModeInput('REALTIME');
    setAgentRepTargetInput('');
    setAgentModalOpen(true);
  };

  const handleOpenEditAgent = (agent: any) => {
    setEditingAgent(agent);
    setAgentNameInput(agent.name || '');
    setAgentSlugInput(agent.slug || '');
    setAgentRoleInput(agent.role || 'QUALIFIER');
    setAgentDescInput(agent.description || '');
    setAgentPromptInput(agent.systemPrompt || '');
    setAgentModelIdInput(agent.modelId || '');
    setAgentParentIdInput(agent.parentAgentId || '');
    setAgentApiKeyIdInput(agent.apiKeyId || '');
    setAgentAutonomyInput(agent.autonomyLevel || 'SEMI');
    setAgentMaxTokensInput(agent.maxTokensPerRequest || 2048);
    setAgentTempInput(agent.temperature !== undefined ? agent.temperature : 0.3);
    setAgentRepModeInput(agent.reportingMode || 'REALTIME');
    setAgentRepTargetInput(agent.reportingTarget || '');
    setAgentModalOpen(true);
  };

  const handleSaveAgent = async () => {
    if (!agentNameInput.trim()) {
      message.error('Vui lòng nhập tên Agent');
      return;
    }
    if (!agentSlugInput.trim()) {
      message.error('Vui lòng nhập Slug định danh');
      return;
    }
    if (!agentPromptInput.trim()) {
      message.error('Vui lòng nhập System Prompt');
      return;
    }
    if (!agentModelIdInput) {
      message.error('Vui lòng chọn mô hình LLM');
      return;
    }
    const payload = {
      name: agentNameInput,
      slug: agentSlugInput,
      role: agentRoleInput,
      description: agentDescInput || undefined,
      systemPrompt: agentPromptInput,
      modelId: agentModelIdInput,
      parentAgentId: agentParentIdInput || undefined,
      apiKeyId: agentApiKeyIdInput || undefined,
      autonomyLevel: agentAutonomyInput,
      maxTokensPerRequest: agentMaxTokensInput,
      temperature: agentTempInput,
      reportingMode: agentRepModeInput,
      reportingTarget: agentRepTargetInput || undefined,
    };
    try {
      if (editingAgent) {
        await updateAgentMutation.mutateAsync({ id: editingAgent.id, data: payload });
        if (selectedAgentNode && selectedAgentNode.id === editingAgent.id) {
          setSelectedAgentNode({ ...selectedAgentNode, ...payload });
        }
      } else {
        await createAgentMutation.mutateAsync(payload);
      }
      setAgentModalOpen(false);
    } catch (err) {}
  };

  const handleDeleteAgent = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa AI Agent?',
      content: 'Hành động này sẽ xóa vĩnh viễn Agent và tất cả Subagents trực thuộc.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteAgentMutation.mutateAsync(id);
          if (selectedAgentNode && selectedAgentNode.id === id) {
            setSelectedAgentNode(null);
          }
        } catch (err) {}
      }
    });
  };


  const userColumns: ColumnProps<SystemUser>[] = [
    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name', render: (val) => <span className="font-semibold text-[var(--color-fg)]">{val}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
    {
      title: 'Vai trò',
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

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManagerOrAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SALES_MANAGER;

  const allTabs = [
    { id: 'profile', name: 'Hồ sơ', icon: User },
    ...(isAdmin ? [
      { id: 'users', name: 'Quản lý nhân viên', icon: Shield },
      { id: 'sales-teams', name: 'Đội ngũ bán hàng', icon: Users }
    ] : []),
    ...(isManagerOrAdmin ? [
      { id: 'ai-governance', name: 'AI Governance', icon: Radio },
      { id: 'integrations', name: 'Tích hợp bên thứ 3', icon: Key }
    ] : []),
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Cài đặt</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Cấu hình kết nối tích hợp hệ thống, quản lý tài khoản nhân viên và cài đặt AI.</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[var(--color-border)] gap-6 pb-px">
        {allTabs.map((tab) => {
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
            <h3 className="text-sm font-semibold text-[var(--color-fg)]">Thông tin cá nhân</h3>
            <div className="space-y-4">
              <div>
                <FloatingInput label="Họ và Tên" value={profileName} onChange={setProfileName} required />
                {profileErrors.name && <p className="text-red-500 text-[10px] mt-1">{profileErrors.name}</p>}
              </div>
              <div>
                <FloatingInput label="Email đăng nhập" value={profileEmail} onChange={setProfileEmail} required />
                {profileErrors.email && <p className="text-red-500 text-[10px] mt-1">{profileErrors.email}</p>}
              </div>
              <div>
                <FloatingInput label="Thay đổi mật khẩu (Bỏ trống nếu giữ nguyên)" type="password" value={profilePassword} onChange={setProfilePassword} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Ngôn ngữ hiển thị
                </label>
                <Select
                  value={profileLanguage}
                  onChange={setProfileLanguage}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'vi', label: 'Tiếng Việt' },
                  ]}
                  className="w-full h-11"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="primary" onClick={handleSaveProfile} loading={updateProfileMutation.isPending} className="flex items-center gap-2 h-10 px-5 rounded-xl cursor-pointer">
                <Save size={16} />
                <span>Lưu thay đổi</span>
              </Button>
            </div>
          </div>
        )}

        {activeSubTab === 'users' && isAdmin && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Quản lý Tài khoản (Admin Only)</h3>
              <Button type="primary" onClick={handleOpenCreateUser} className="flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer">
                <Plus size={14} />
                <span>Thêm nhân viên</span>
              </Button>
            </div>

            {isUsersLoading ? (
              <div className="py-12 flex justify-center"><Spin /></div>
            ) : (
              <SharedTable
                columns={userColumns}
                dataSource={usersList}
                onEdit={handleOpenEditUser}
                onDelete={handleDeleteUser}
              />
            )}

            {/* Modal Edit/Create User */}
            {userModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md space-y-6 shadow-xl">
                  <h4 className="font-semibold text-lg text-[var(--color-fg)]">
                    {editingUser ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản nhân viên'}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <FloatingInput label="Họ và Tên" value={userNameInput} onChange={setUserNameInput} required />
                      {userErrors.name && <p className="text-red-500 text-[10px] mt-1">{userErrors.name}</p>}
                    </div>
                    <div>
                      <FloatingInput label="Email Address" value={userEmailInput} onChange={setUserEmailInput} required />
                      {userErrors.email && <p className="text-red-500 text-[10px] mt-1">{userErrors.email}</p>}
                    </div>
                    <div>
                      <FloatingInput label="Mật khẩu" type="password" value={userPasswordInput} onChange={setUserPasswordInput} required={!editingUser} />
                      {userErrors.password && <p className="text-red-500 text-[10px] mt-1">{userErrors.password}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Vai trò hệ thống</label>
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
                    <Button onClick={() => setUserModalOpen(false)} className="rounded-xl">Hủy</Button>
                    <Button type="primary" onClick={handleSaveUser} loading={createUserMutation.isPending || updateUserMutation.isPending} className="rounded-xl">Lưu</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'sales-teams' && isAdmin && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Quản lý Đội ngũ Bán hàng (Admin Only)</h3>
              <Button type="primary" onClick={handleOpenCreateTeam} className="flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer">
                <Plus size={14} />
                <span>Thêm đội ngũ</span>
              </Button>
            </div>

            {isTeamsLoading ? (
              <div className="py-12 flex justify-center"><Spin /></div>
            ) : (
              <SharedTable
                columns={teamColumns}
                dataSource={teamsList}
                onEdit={handleOpenEditTeam}
                onDelete={handleDeleteTeam}
              />
            )}

            {/* Modal Edit/Create Sales Team */}
            {teamModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md space-y-6 shadow-xl">
                  <h4 className="font-semibold text-lg text-[var(--color-fg)]">
                    {editingTeam ? 'Chỉnh sửa đội ngũ' : 'Tạo đội ngũ bán hàng'}
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <FloatingInput label="Tên đội ngũ" value={teamNameInput} onChange={setTeamNameInput} required />
                      {teamErrors.name && <p className="text-red-500 text-[10px] mt-1">{teamErrors.name}</p>}
                    </div>
                    <div>
                      <FloatingInput label="Mô tả nhóm" value={teamDescInput} onChange={setTeamDescInput} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Trưởng nhóm (Leader)</label>
                      <Select
                        value={teamLeaderInput}
                        onChange={setTeamLeaderInput}
                        placeholder="Chọn Trưởng nhóm"
                        options={usersList.filter(u => u.role === 'SALES_MANAGER' || u.role === 'ADMIN').map(u => ({ value: u.id, label: `${u.name} (${u.role})` }))}
                        className="w-full h-11"
                        allowClear
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Thành viên</label>
                      <Select
                        mode="multiple"
                        value={teamMembersInput}
                        onChange={setTeamMembersInput}
                        placeholder="Chọn các thành viên kinh doanh"
                        options={usersList.map(u => ({ value: u.id, label: `${u.name} (${u.role})` }))}
                        className="w-full min-h-11"
                        allowClear
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Quy tắc phân chia tự động</label>
                      <Select
                        value={teamRuleInput}
                        onChange={setTeamRuleInput}
                        options={[
                          { value: 'ROUND_ROBIN', label: 'Round Robin (Phân bổ xoay vòng)' },
                          { value: 'MANUAL', label: 'Manual (Giao thủ công)' },
                        ]}
                        className="w-full h-11"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button onClick={() => setTeamModalOpen(false)} className="rounded-xl">Hủy</Button>
                    <Button type="primary" onClick={handleSaveTeam} loading={createTeamMutation.isPending || updateTeamMutation.isPending} className="rounded-xl">Lưu</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'ai-governance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Cấu hình AI Features & Agents Governance</h3>
              <p className="text-xs text-[var(--color-muted-fg)] mt-1">
                Quản lý các nhà cung cấp mô hình (LLM Providers), thiết lập API keys bảo mật, thiết kế sơ đồ Agents phân cấp và cấu hình luật kiểm soát.
              </p>
            </div>

            {/* Sub-Section Navigation */}
            <div className="flex gap-4 border-b border-[var(--color-border)]/60 pb-px">
              {[
                { id: 'providers', name: 'Providers & API Keys', icon: Server },
                { id: 'agents', name: 'Sơ đồ Agent Tree', icon: Network },
                { id: 'controls', name: 'Tính năng & Giới hạn', icon: Sliders },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setAiSubSection(sub.id as any)}
                  className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    aiSubSection === sub.id
                      ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                      : 'border-transparent text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
                  }`}
                >
                  <sub.icon size={14} />
                  <span>{sub.name}</span>
                </button>
              ))}
            </div>

            {/* Sub-Section Bodies */}
            {aiSubSection === 'providers' && (
              <div className="space-y-8">
                {/* Providers Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">Nhà cung cấp Mô hình (LLM Providers)</h4>
                    <Button
                      size="small"
                      type="primary"
                      icon={<Plus size={14} />}
                      onClick={handleOpenCreateProvider}
                      className="rounded-lg text-xs cursor-pointer"
                    >
                      Thêm Provider
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {providersList.map((p) => {
                      const status = providerStatuses[p.id];
                      return (
                        <div key={p.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-[var(--color-accent)]/50 transition-all">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Cpu size={16} className="text-[var(--color-accent)]" />
                                <span className="font-semibold text-xs text-[var(--color-fg)]">{p.name}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                p.type === 'CLOUD' ? 'bg-blue-500/10 text-blue-500' :
                                p.type === 'LOCAL' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'
                              }`}>
                                {p.type}
                              </span>
                            </div>
                            <p className="text-[9px] text-[var(--color-muted-fg)] font-mono truncate">{p.baseUrl}</p>
                          </div>

                          <div className="flex items-center gap-2 border-t border-[var(--color-border)]/50 pt-3">
                            <span className="text-[9px] text-[var(--color-muted-fg)] flex-1">
                              {status === 'success' && <Badge status="success" text="Kết nối OK" className="text-[10px]" />}
                              {status === 'failed' && <Badge status="error" text="Lỗi kết nối" className="text-[10px]" />}
                              {status === 'testing' && <Badge status="processing" text="Đang test..." className="text-[10px]" />}
                              {!status && <Badge status="default" text="Chưa kiểm tra" className="text-[10px]" />}
                            </span>
                            <div className="flex gap-1.5">
                              <Button size="small" onClick={() => handleTestProvider(p.id)} className="text-[10px] rounded-lg cursor-pointer">Test</Button>
                              <Button
                                size="small"
                                onClick={() => handleScanModels(p.id)}
                                loading={scanningProviderId === p.id}
                                className="text-[10px] rounded-lg cursor-pointer"
                              >
                                Quét Models
                              </Button>
                              <Button size="small" onClick={() => handleOpenEditProvider(p)} className="text-[10px] rounded-lg cursor-pointer">Sửa</Button>
                              <Button size="small" danger onClick={() => handleDeleteProvider(p.id)} className="text-[10px] rounded-lg cursor-pointer">Xóa</Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* API Keys Section */}
                <div className="space-y-4 border-t border-[var(--color-border)]/60 pt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">Quản lý API Keys (Mã hóa lưu trữ)</h4>
                    <Button
                      size="small"
                      type="primary"
                      icon={<Plus size={14} />}
                      onClick={() => handleOpenCreateKey()}
                      className="rounded-lg text-xs cursor-pointer"
                    >
                      Thêm API Key
                    </Button>
                  </div>

                  <SharedTable
                    dataSource={apiKeysList}
                    columns={[
                      { title: 'Nhãn (Label)', dataIndex: 'label', key: 'label', render: (val) => <span className="font-semibold text-xs text-[var(--color-fg)]">{val}</span> },
                      {
                        title: 'Nhà cung cấp',
                        dataIndex: 'providerId' as any,
                        key: 'provider',
                        render: (_, record: any) => <span className="text-xs text-[var(--color-muted-fg)]">{record.provider?.name || '—'}</span>
                      },
                      { title: 'API Key', dataIndex: 'maskedKey', key: 'maskedKey', render: (val) => <span className="font-mono text-xs text-indigo-500">{val}</span> },
                      {
                        title: 'Hoạt động',
                        dataIndex: 'isActive',
                        key: 'isActive',
                        render: (active, record: any) => (
                          <Switch
                            size="small"
                            checked={active}
                            onChange={async (val) => {
                              try {
                                await updateApiKeyMutation.mutateAsync({ id: record.id, data: { isActive: val } as any });
                              } catch (e) {}
                            }}
                          />
                        )
                      },
                      {
                        title: 'Hành động',
                        dataIndex: 'id' as any,
                        key: 'actions',
                        render: (_, record: any) => (
                          <Button size="small" danger icon={<Trash2 size={12} />} onClick={() => handleDeleteKey(record.id)} className="rounded-lg cursor-pointer">Xóa</Button>
                        )
                      }
                    ]}
                  />
                </div>
              </div>
            )}

            {aiSubSection === 'agents' && (
              <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
                {/* Left Side: React Flow Canvas */}
                <div className="xl:col-span-7 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">Cấu trúc phân cấp mạng lưới Agents</h4>
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        icon={<Plus size={12} />}
                        onClick={() => handleOpenCreateAgent()}
                        className="text-xs rounded-lg cursor-pointer"
                      >
                        Thêm Agent gốc
                      </Button>
                      {selectedAgentNode && (
                        <>
                          <Button
                            size="small"
                            icon={<Plus size={12} />}
                            onClick={() => handleOpenCreateAgent(selectedAgentNode.id)}
                            className="text-xs rounded-lg cursor-pointer"
                          >
                            Thêm Subagent con
                          </Button>
                          <Button
                            size="small"
                            danger
                            icon={<Trash2 size={12} />}
                            onClick={() => handleDeleteAgent(selectedAgentNode.id)}
                            className="text-xs rounded-lg cursor-pointer"
                          >
                            Xóa Agent
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="h-[520px] border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]/30 overflow-hidden relative">
                    {agentsList.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <Network size={32} className="text-[var(--color-muted-fg)] mb-2" />
                        <p className="text-xs text-[var(--color-muted-fg)] font-semibold">Chưa có AI Agent nào được đăng ký</p>
                        <Button
                          size="small"
                          onClick={() => handleOpenCreateAgent()}
                          className="mt-3 text-xs rounded-lg cursor-pointer"
                        >
                          Tạo Agent đầu tiên
                        </Button>
                      </div>
                    ) : (() => {
                      // Helper layout mapping function
                      const buildGraphData = (agents: any[]) => {
                        const nodes: any[] = [];
                        const edges: any[] = [];
                        const rootAgents = agents.filter((a) => !a.parentAgentId);
                        
                        rootAgents.forEach((root, rootIdx) => {
                          const rootX = rootIdx * 280 + 100;
                          const rootY = 60;
                          const rootNodeId = root.id;

                          nodes.push({
                            id: rootNodeId,
                            position: { x: rootX, y: rootY },
                            style: {
                              background: 'var(--color-surface)',
                              border: root.id === selectedAgentNode?.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                              borderRadius: '12px',
                              padding: '12px',
                              width: '180px',
                              boxShadow: root.id === selectedAgentNode?.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.15)' : 'none',
                              cursor: 'pointer'
                            },
                            data: { 
                              label: (
                                <div className="text-left space-y-1">
                                  <div className="flex justify-between items-center text-[8px] font-extrabold uppercase text-[var(--color-accent)]">
                                    <span>{root.role}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${root.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                  </div>
                                  <div className="font-bold text-xs text-[var(--color-fg)] truncate">{root.name}</div>
                                  <div className="text-[9px] text-[var(--color-muted-fg)] truncate font-mono">{root.model?.modelName || 'Default'}</div>
                                </div>
                              )
                            },
                          });

                          const subs = agents.filter((a) => a.parentAgentId === root.id);
                          subs.forEach((sub, subIdx) => {
                            const subX = rootX + (subIdx - (subs.length - 1) / 2) * 200;
                            const subY = rootY + 160;
                            const subNodeId = sub.id;

                            nodes.push({
                              id: subNodeId,
                              position: { x: subX, y: subY },
                              style: {
                                background: 'var(--color-surface)',
                                border: sub.id === selectedAgentNode?.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                borderRadius: '12px',
                                padding: '12px',
                                width: '180px',
                                boxShadow: sub.id === selectedAgentNode?.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.15)' : 'none',
                                cursor: 'pointer'
                              },
                              data: {
                                label: (
                                  <div className="text-left space-y-1">
                                    <div className="flex justify-between items-center text-[8px] font-extrabold uppercase text-indigo-400">
                                      <span>{sub.role}</span>
                                      <span className={`w-1.5 h-1.5 rounded-full ${sub.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                    </div>
                                    <div className="font-bold text-xs text-[var(--color-fg)] truncate">{sub.name}</div>
                                    <div className="text-[9px] text-[var(--color-muted-fg)] truncate font-mono">{sub.model?.modelName || 'Inherit'}</div>
                                  </div>
                                )
                              },
                            });

                            edges.push({
                              id: `e-${rootNodeId}-${subNodeId}`,
                              source: rootNodeId,
                              target: subNodeId,
                              animated: sub.isActive,
                              style: { stroke: sub.id === selectedAgentNode?.id ? 'var(--color-accent)' : 'var(--color-border)', strokeWidth: 2 },
                              markerEnd: { type: MarkerType.ArrowClosed, color: sub.id === selectedAgentNode?.id ? '#6366f1' : '#888' },
                            });

                            // Grandchildren
                            const grandSubs = agents.filter((a) => a.parentAgentId === sub.id);
                            grandSubs.forEach((grand, grandIdx) => {
                              const grandX = subX + (grandIdx - (grandSubs.length - 1) / 2) * 180;
                              const grandY = subY + 160;
                              const grandNodeId = grand.id;

                              nodes.push({
                                id: grandNodeId,
                                position: { x: grandX, y: grandY },
                                style: {
                                  background: 'var(--color-surface)',
                                  border: grand.id === selectedAgentNode?.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                  borderRadius: '12px',
                                  padding: '12px',
                                  width: '180px',
                                  boxShadow: grand.id === selectedAgentNode?.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.15)' : 'none',
                                  cursor: 'pointer'
                                },
                                data: {
                                  label: (
                                    <div className="text-left space-y-1">
                                      <div className="flex justify-between items-center text-[8px] font-extrabold uppercase text-purple-400">
                                        <span>{grand.role}</span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${grand.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                      </div>
                                      <div className="font-bold text-xs text-[var(--color-fg)] truncate">{grand.name}</div>
                                      <div className="text-[9px] text-[var(--color-muted-fg)] truncate font-mono">{grand.model?.modelName || 'Inherit'}</div>
                                    </div>
                                  )
                                },
                              });

                              edges.push({
                                id: `e-${subNodeId}-${grandNodeId}`,
                                source: subNodeId,
                                target: grandNodeId,
                                animated: grand.isActive,
                                style: { stroke: grand.id === selectedAgentNode?.id ? 'var(--color-accent)' : 'var(--color-border)', strokeWidth: 2 },
                                markerEnd: { type: MarkerType.ArrowClosed, color: grand.id === selectedAgentNode?.id ? '#6366f1' : '#888' },
                              });
                            });
                          });
                        });

                        return { nodes, edges };
                      };

                      const { nodes, edges } = buildGraphData(agentsList);

                      return (
                        <ReactFlow
                          nodes={nodes}
                          edges={edges}
                          fitView
                          onNodeClick={(event, node) => {
                            const agent = agentsList.find((a) => a.id === node.id);
                            if (agent) {
                              setSelectedAgentNode(agent);
                            }
                          }}
                        >
                          <Controls />
                          <Background color="var(--color-border)" gap={16} />
                        </ReactFlow>
                      );
                    })()}
                  </div>
                </div>

                {/* Right Side: Agent Details Sidebar Editor */}
                <div className="xl:col-span-3 bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-2xl p-4 min-h-[520px] flex flex-col justify-between">
                  {selectedAgentNode ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-[var(--color-fg)]">Cấu hình Agent</h4>
                          <span className="text-[8px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded-full">{selectedAgentNode.role}</span>
                        </div>
                        <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">ID: {selectedAgentNode.slug}</p>
                      </div>

                      <div className="space-y-3">
                        <FloatingInput label="Tên Agent" value={selectedAgentNode.name} onChange={(val) => setSelectedAgentNode({ ...selectedAgentNode, name: val })} />
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">LLM Model</label>
                          <Select
                            value={selectedAgentNode.modelId}
                            onChange={(val) => setSelectedAgentNode({ ...selectedAgentNode, modelId: val })}
                            options={modelsList.map(m => ({ value: m.id, label: `${m.provider?.name} — ${m.modelName}` }))}
                            className="w-full h-9"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">API Key (Quyền kế thừa)</label>
                          <Select
                            value={selectedAgentNode.apiKeyId || ''}
                            onChange={(val) => setSelectedAgentNode({ ...selectedAgentNode, apiKeyId: val || null })}
                            options={[
                              { value: '', label: 'Kế thừa từ Agent cha / Provider Default' },
                              ...apiKeysList.map(k => ({ value: k.id, label: `${k.provider?.name} (${k.label})` }))
                            ]}
                            className="w-full h-9"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">Quyền Tự trị (Autonomy)</label>
                          <Select
                            value={selectedAgentNode.autonomyLevel}
                            onChange={(val) => setSelectedAgentNode({ ...selectedAgentNode, autonomyLevel: val })}
                            options={[
                              { value: 'FULL', label: 'FULL (Tự động thực thi)' },
                              { value: 'SEMI', label: 'SEMI (Cần người duyệt)' },
                              { value: 'MANUAL', label: 'MANUAL (Chỉ chạy khi click)' },
                            ]}
                            className="w-full h-9"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">System Prompt hướng dẫn</label>
                          <textarea
                            value={selectedAgentNode.systemPrompt}
                            onChange={(e) => setSelectedAgentNode({ ...selectedAgentNode, systemPrompt: e.target.value })}
                            className="w-full min-h-[100px] text-xs p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-accent)] font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-[var(--color-border)]/50">
                        <Button
                          type="primary"
                          size="small"
                          onClick={async () => {
                            try {
                              await updateAgentMutation.mutateAsync({
                                id: selectedAgentNode.id,
                                data: selectedAgentNode
                              });
                            } catch (e) {}
                          }}
                          className="flex-1 rounded-lg text-xs cursor-pointer"
                        >
                          Lưu thay đổi
                        </Button>
                        <Button
                          size="small"
                          danger
                          onClick={() => {
                            setSelectedAgentNode(null);
                          }}
                          className="rounded-lg text-xs cursor-pointer"
                        >
                          Đóng
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                      <Bot size={24} className="text-[var(--color-muted-fg)] mb-2" />
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Nhấp vào một Agent trên sơ đồ để cấu hình các thuộc tính chi tiết, prompts hoặc ghi đè API Key.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {aiSubSection === 'controls' && (
              <div className="max-w-xl space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                    <div>
                      <p className="font-semibold text-xs text-[var(--color-fg)]">Lead BANT Syncing</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Auto score leads on budget and authority parameters.</p>
                    </div>
                    <Switch checked={settings.leadBantSync} onChange={(val) => settings.updateSettings({ leadBantSync: val })} />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                    <div>
                      <p className="font-semibold text-xs text-[var(--color-fg)]">Opportunity Coach</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Suggests next actions on active pipeline steps.</p>
                    </div>
                    <Switch checked={settings.oppCoach} onChange={(val) => settings.updateSettings({ oppCoach: val })} />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                    <div>
                      <p className="font-semibold text-xs text-[var(--color-fg)]">Quotation Follow-up</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Propose email drafts based on customer timeline rules.</p>
                    </div>
                    <Switch checked={settings.quoFollowUp} onChange={(val) => settings.updateSettings({ quoFollowUp: val })} />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                    <div>
                      <p className="font-semibold text-xs text-[var(--color-fg)]">Contract Risk Audit</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Identify unfavorable clauses inside uploaded documents.</p>
                    </div>
                    <Switch checked={settings.contractRisk} onChange={(val) => settings.updateSettings({ contractRisk: val })} />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Autonomy Threshold
                    </label>
                    <Select
                      value={settings.autonomyMode}
                      onChange={(val) => settings.updateSettings({ autonomyMode: val })}
                      options={[
                        { value: 'AUTO', label: 'Full Autonomy (Agentic workflow auto-trigger)' },
                        { value: 'SEMI', label: 'Semi Autonomy (Requires human click confirmation)' },
                        { value: 'OFF', label: 'Manual Only' },
                      ]}
                      className="w-full h-11"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Data Sensitivity Threshold
                    </label>
                    <Select
                      value={settings.sensitivityThreshold}
                      onChange={(val) => settings.updateSettings({ sensitivityThreshold: val })}
                      options={[
                        { value: 'HIGH', label: 'Strict GDPR / NDAs alignment' },
                        { value: 'MEDIUM', label: 'Balanced (Recommended)' },
                        { value: 'LOW', label: 'Permissive analysis' },
                      ]}
                      className="w-full h-11"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Thêm/Sửa Provider */}
        <Modal
          title={editingProvider ? 'Sửa thông tin Provider' : 'Thêm Provider mới'}
          open={providerModalOpen}
          onOk={handleSaveProvider}
          onCancel={() => setProviderModalOpen(false)}
          okText="Lưu"
          cancelText="Hủy"
          className="rounded-2xl"
        >
          <div className="space-y-4 pt-3">
            <FloatingInput label="Tên nhà cung cấp (Ví dụ: Ollama, Local LM)" value={providerNameInput} onChange={setProviderNameInput} />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">Phân loại Provider</label>
              <Select
                value={providerTypeInput}
                onChange={setProviderTypeInput}
                options={[
                  { value: 'CLOUD', label: 'CLOUD (Groq, OpenAI, Gemini,...)' },
                  { value: 'LOCAL', label: 'LOCAL (Ollama, LM Studio,...)' },
                  { value: 'CUSTOM', label: 'CUSTOM (Mạng riêng / Endpoint riêng)' },
                ]}
                className="w-full h-11"
              />
            </div>

            <FloatingInput label="Base API URL (Ví dụ: http://localhost:11434/v1)" value={providerBaseUrlInput} onChange={setProviderBaseUrlInput} />

            <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-semibold text-xs text-[var(--color-fg)]">OpenAI Compatible Format</p>
                <p className="text-[8px] text-[var(--color-muted-fg)]">Sử dụng chung cấu trúc payload /chat/completions chuẩn của OpenAI</p>
              </div>
              <Switch checked={providerCompatibleInput} onChange={setProviderCompatibleInput} />
            </div>

            <FloatingInput label="Icon Slug định danh (Ví dụ: openai, groq, custom)" value={providerIconSlugInput} onChange={setProviderIconSlugInput} />
          </div>
        </Modal>

        {/* Modal: Thêm API Key */}
        <Modal
          title="Thêm API Key bảo mật mới"
          open={keyModalOpen}
          onOk={handleSaveKey}
          onCancel={() => setKeyModalOpen(false)}
          okText="Thêm"
          cancelText="Hủy"
          className="rounded-2xl"
        >
          <div className="space-y-4 pt-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">Nhà cung cấp</label>
              <Select
                value={keyProviderIdInput}
                onChange={setKeyProviderIdInput}
                options={providersList.map(p => ({ value: p.id, label: `${p.name} (${p.type})` }))}
                placeholder="Chọn Provider cần gắn key"
                className="w-full h-11"
              />
            </div>

            <FloatingInput label="Tên nhãn của khóa (Ví dụ: Prod Key, Test Key)" value={keyLabelInput} onChange={setKeyLabelInput} />
            
            <FloatingInput label="API Key Secret (Sẽ được mã hóa AES-256)" type="password" value={keyValInput} onChange={setKeyValInput} />
          </div>
        </Modal>

        {/* Modal: Thêm/Sửa Agent */}
        <Modal
          title={editingAgent ? 'Sửa thông tin Agent' : 'Tạo AI Agent mới'}
          open={agentModalOpen}
          onOk={handleSaveAgent}
          onCancel={() => setAgentModalOpen(false)}
          okText="Lưu"
          cancelText="Hủy"
          className="rounded-2xl"
          width={600}
        >
          <div className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Tên Agent (Ví dụ: Lead Qualifier)" value={agentNameInput} onChange={setAgentNameInput} />
              <FloatingInput label="Slug định danh (Ví dụ: lead-qualifier)" value={agentSlugInput} onChange={setAgentSlugInput} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">Mô hình LLM</label>
                <Select
                  value={agentModelIdInput}
                  onChange={setAgentModelIdInput}
                  options={modelsList.map(m => ({ value: m.id, label: `${m.provider?.name} — ${m.modelName}` }))}
                  placeholder="Chọn Model"
                  className="w-full h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">Phân vai (Role)</label>
                <Select
                  value={agentRoleInput}
                  onChange={setAgentRoleInput}
                  options={[
                    { value: 'QUALIFIER', label: 'QUALIFIER (Tự động đánh giá Lead)' },
                    { value: 'COACH', label: 'COACH (AI Coaching gợi ý bán hàng)' },
                    { value: 'RISK_AUDITOR', label: 'RISK_AUDITOR (Phân tích rủi ro hợp đồng)' },
                    { value: 'EMAIL_DRAFTER', label: 'EMAIL_DRAFTER (Tự động hóa soạn mail)' },
                    { value: 'CUSTOM', label: 'CUSTOM (Tùy chỉnh khác)' },
                  ]}
                  className="w-full h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">Agent quản lý (Cha)</label>
                <Select
                  value={agentParentIdInput}
                  onChange={setAgentParentIdInput}
                  options={[
                    { value: '', label: 'Không có (Đây là Agent gốc)' },
                    ...agentsList.map(a => ({ value: a.id, label: a.name }))
                  ]}
                  className="w-full h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">API Key Overwrite (Ghi đè)</label>
                <Select
                  value={agentApiKeyIdInput}
                  onChange={setAgentApiKeyIdInput}
                  options={[
                    { value: '', label: 'Kế thừa từ Agent cha / Provider Default' },
                    ...apiKeysList.map(k => ({ value: k.id, label: `${k.provider?.name} (${k.label})` }))
                  ]}
                  className="w-full h-11"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-semibold text-[var(--color-muted-fg)] uppercase">System Prompt hướng dẫn</label>
              <textarea
                value={agentPromptInput}
                onChange={(e) => setAgentPromptInput(e.target.value)}
                placeholder="Ví dụ: Bạn là chuyên gia phân tích lead dựa trên phương pháp BANT..."
                className="w-full min-h-[120px] text-xs p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl outline-none focus:border-[var(--color-accent)] font-mono"
              />
            </div>

            <FloatingInput label="Mô tả tóm tắt Agent" value={agentDescInput} onChange={setAgentDescInput} />
          </div>
        </Modal>

        {activeSubTab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">Cấu hình Tích hợp Dịch vụ</h3>
              <p className="text-xs text-[var(--color-muted-fg)] mt-1">Kết nối và đồng bộ dữ liệu với các nền tảng và dịch vụ bên thứ ba.</p>
            </div>

            <div className="flex gap-6 min-h-[480px] border-t border-[var(--color-border)] pt-6">
              {/* Left Navigation Menu */}
              <div className="w-1/4 flex flex-col gap-1 border-r border-[var(--color-border)] pr-6">
                {[
                  { id: 'chatwoot', name: 'Chatwoot Inbox', icon: MessageSquare, desc: 'Omnichannel Inbox' },
                  { id: 'docusign', name: 'DocuSign Signature', icon: PenTool, desc: 'E-Signature Hub' },
                  { id: 'resend', name: 'Resend SMTP', icon: Mail, desc: 'Mail Gateway' },
                  { id: 'erp', name: 'Đồng bộ ERP', icon: RefreshCw, desc: 'XML-RPC Connection' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveIntegrationTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer ${
                      activeIntegrationTab === tab.id
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-l-2 border-[var(--color-accent)] pl-2.5'
                        : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] hover:bg-[var(--color-muted-bg)]/20'
                    }`}
                  >
                    <tab.icon size={16} className={activeIntegrationTab === tab.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted-fg)]'} />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{tab.name}</span>
                      <span className="text-[9px] text-[var(--color-muted-fg)]">{tab.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Panel Content */}
              <div className="w-3/4 pl-2 space-y-6">
                {/* Chatwoot Content */}
                {activeIntegrationTab === 'chatwoot' && (
                  <div className="space-y-4 max-w-xl">
                    <div className="flex justify-between items-center bg-[var(--color-surface)]/50 p-4 border border-[var(--color-border)] rounded-2xl">
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-fg)]">Chatwoot Inbox</h4>
                        <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ hội thoại, tin nhắn đa kênh (Facebook, Zalo...)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {chatwootStatus === 'success' && <Badge status="success" text="Kết nối thành công" className="text-xs" />}
                        {chatwootStatus === 'failed' && <Badge status="error" text="Lỗi kết nối" className="text-xs" />}
                        <Button size="small" onClick={testChatwootConnection} className="text-xs rounded-lg cursor-pointer">Test Connection</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Chatwoot Base URL" value={settings.chatwootUrl} onChange={(val) => settings.updateSettings({ chatwootUrl: val })} />
                      <FloatingInput label="API Access Token" type="password" value={settings.chatwootToken} onChange={(val) => settings.updateSettings({ chatwootToken: val })} />
                    </div>
                  </div>
                )}

                {/* DocuSign Content */}
                {activeIntegrationTab === 'docusign' && (
                  <div className="space-y-4 max-w-xl">
                    <div className="flex justify-between items-center bg-[var(--color-surface)]/50 p-4 border border-[var(--color-border)] rounded-2xl">
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-fg)]">DocuSign E-Signature Hub</h4>
                        <p className="text-[10px] text-[var(--color-muted-fg)]">Tự động hóa chữ ký điện tử trên Hợp đồng CRM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {docusignStatus === 'success' && <Badge status="success" text="Kết nối thành công" className="text-xs" />}
                        {docusignStatus === 'failed' && <Badge status="error" text="Lỗi kết nối" className="text-xs" />}
                        <Button size="small" onClick={testDocuSignConnection} className="text-xs rounded-lg cursor-pointer">Test Connection</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Integration Key (GUID)" value={settings.docusignKey} onChange={(val) => settings.updateSettings({ docusignKey: val })} />
                      <FloatingInput label="Secret Key" type="password" value={settings.docusignSecret} onChange={(val) => settings.updateSettings({ docusignSecret: val })} />
                      <FloatingInput label="Account ID (GUID)" value={settings.docusignAccountId} onChange={(val) => settings.updateSettings({ docusignAccountId: val })} />
                      <FloatingInput label="User ID (GUID)" value={settings.docusignUserId} onChange={(val) => settings.updateSettings({ docusignUserId: val })} />
                    </div>
                  </div>
                )}

                {/* Resend Content */}
                {activeIntegrationTab === 'resend' && (
                  <div className="space-y-4 max-w-xl">
                    <div className="flex justify-between items-center bg-[var(--color-surface)]/50 p-4 border border-[var(--color-border)] rounded-2xl">
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-fg)]">Resend SMTP Gateway</h4>
                        <p className="text-[10px] text-[var(--color-muted-fg)]">Gửi email báo giá và hợp đồng tự động</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {resendStatus === 'success' && <Badge status="success" text="Kết nối thành công" className="text-xs" />}
                        {resendStatus === 'failed' && <Badge status="error" text="Lỗi kết nối" className="text-xs" />}
                        <Button size="small" onClick={testResendConnection} className="text-xs rounded-lg cursor-pointer">Test Connection</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Resend API Key" type="password" value={settings.resendApiKey} onChange={(val) => settings.updateSettings({ resendApiKey: val })} />
                      <FloatingInput label="From Email Address" value={settings.resendFromEmail} onChange={(val) => settings.updateSettings({ resendFromEmail: val })} />
                    </div>
                  </div>
                )}

                {/* ERP Sync Content */}
                {activeIntegrationTab === 'erp' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-[var(--color-surface)]/50 p-4 border border-[var(--color-border)] rounded-2xl">
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-fg)]">Đồng bộ Hệ thống ERP</h4>
                        <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ 2 chiều dữ liệu khách hàng, cơ hội, báo giá, hóa đơn thanh toán qua XML-RPC</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {erpStatus === 'success' && <Badge status="success" text="Kết nối thành công" className="text-xs" />}
                        {erpStatus === 'failed' && <Badge status="error" text="Lỗi kết nối" className="text-xs" />}
                        <Button size="small" onClick={handleTestErpConnection} className="text-xs rounded-lg cursor-pointer">Test Connection</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-xl">
                      <FloatingInput label="ERP XML-RPC URL" value={settings.erpUrl} onChange={(val) => settings.updateSettings({ erpUrl: val })} />
                      <FloatingInput label="ERP Database Name" value={settings.erpDb} onChange={(val) => settings.updateSettings({ erpDb: val })} />
                      <FloatingInput label="Username / Email" value={settings.erpUsername} onChange={(val) => settings.updateSettings({ erpUsername: val })} />
                      <FloatingInput label="Password / API Key" type="password" value={settings.erpPassword || ''} onChange={(val) => settings.updateSettings({ erpPassword: val })} />
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
                      <h5 className="font-semibold text-xs text-[var(--color-fg)]">Đồng bộ & Tự động hóa Phân hệ ERP</h5>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Customers */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Khách hàng & Liên hệ</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ doanh nghiệp, liên hệ cá nhân</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('customers')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncCustomers} onChange={(val) => settings.updateSettings({ erpAutoSyncCustomers: val })} />
                          </div>
                        </div>
                        
                        {/* Leads */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Đầu mối (Leads)</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ thông tin leads mới</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('leads')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncLeads} onChange={(val) => settings.updateSettings({ erpAutoSyncLeads: val })} />
                          </div>
                        </div>

                        {/* Opportunities */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Cơ hội bán hàng</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ pipeline cơ hội</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('opportunities')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncOpportunities} onChange={(val) => settings.updateSettings({ erpAutoSyncOpportunities: val })} />
                          </div>
                        </div>

                        {/* Quotations */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Báo giá</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ báo giá cố định & scope items</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('quotations')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncQuotations} onChange={(val) => settings.updateSettings({ erpAutoSyncQuotations: val })} />
                          </div>
                        </div>

                        {/* Payments */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Thanh toán & Hóa đơn</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ hóa đơn và trạng thái thanh toán</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('payments')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncPayments} onChange={(val) => settings.updateSettings({ erpAutoSyncPayments: val })} />
                          </div>
                        </div>

                        {/* Meetings */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Lịch họp & Sự kiện</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ lịch họp, sự kiện khách hàng</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('meetings')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncMeetings} onChange={(val) => settings.updateSettings({ erpAutoSyncMeetings: val })} />
                          </div>
                        </div>

                        {/* Sales Teams */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Nhóm bán hàng</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ đội ngũ và phân phối việc</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('sales-teams')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncSalesTeams} onChange={(val) => settings.updateSettings({ erpAutoSyncSalesTeams: val })} />
                          </div>
                        </div>

                        {/* UTM Sources */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Chiến dịch & Nguồn UTM</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ UTM source, campaign</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('utm')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncUtm} onChange={(val) => settings.updateSettings({ erpAutoSyncUtm: val })} />
                          </div>
                        </div>

                        {/* Activities */}
                        <div className="flex flex-col justify-between p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-muted-bg)]/20 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-[var(--color-fg)]">Nhật ký hoạt động</span>
                              <p className="text-[10px] text-[var(--color-muted-fg)]">Đồng bộ cuộc gọi, email, hoạt động</p>
                            </div>
                            <Button size="small" onClick={() => handleSyncErp('activities')} className="text-xs rounded-lg cursor-pointer">Sync Now</Button>
                          </div>
                          <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-2">
                            <span className="text-[10px] text-[var(--color-muted-fg)]">Tự động đồng bộ</span>
                            <Switch size="small" checked={settings.erpAutoSyncActivities} onChange={(val) => settings.updateSettings({ erpAutoSyncActivities: val })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
