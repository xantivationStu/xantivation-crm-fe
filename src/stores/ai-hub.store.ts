import { create } from 'zustand';
import { AiConversation, AiAgentType, AgentStatus } from '@/types/ai-hub.types';

interface AiHubState {
  activeConversation: AiConversation | null;
  activeAgent: AiAgentType;
  agentStatus: AgentStatus;
  rightPanelTab: 'EXECUTION' | 'CONTEXT' | 'TOOLS' | 'KNOWLEDGE' | 'MEMORY';
  isSidebarCollapsed: boolean;
  setActiveConversation: (conversation: AiConversation | null) => void;
  setActiveAgent: (agent: AiAgentType) => void;
  setAgentStatus: (status: AgentStatus) => void;
  setRightPanelTab: (tab: 'EXECUTION' | 'CONTEXT' | 'TOOLS' | 'KNOWLEDGE' | 'MEMORY') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAiHubStore = create<AiHubState>((set) => ({
  activeConversation: null,
  activeAgent: AiAgentType.CRM_ASSISTANT,
  agentStatus: AgentStatus.ONLINE,
  rightPanelTab: 'EXECUTION',
  isSidebarCollapsed: false,
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  setAgentStatus: (status) => set({ agentStatus: status }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}));
