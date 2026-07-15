import { create } from 'zustand';

interface AiAssistantState {
  isOpen: boolean;
  contextEntityId: string | null;
  contextEntityType: 'LEAD' | 'OPPORTUNITY' | 'CONTRACT' | 'CUSTOMER' | null;
  setOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  setContext: (entityId: string | null, entityType: 'LEAD' | 'OPPORTUNITY' | 'CONTRACT' | 'CUSTOMER' | null) => void;
  clearContext: () => void;
}

export const useAiAssistantStore = create<AiAssistantState>((set) => ({
  isOpen: false,
  contextEntityId: null,
  contextEntityType: null,
  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setContext: (entityId, entityType) =>
    set({
      contextEntityId: entityId,
      contextEntityType: entityType,
    }),
  clearContext: () =>
    set({
      contextEntityId: null,
      contextEntityType: null,
    }),
}));
