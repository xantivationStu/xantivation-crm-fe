'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Select, Modal, Progress, message, Spin } from 'antd';
import { User, Briefcase, Mail, Phone, Calendar, Plus, ArrowRight, UserCheck, FileText, AlertTriangle, Trash2, HelpCircle, Bot, Zap } from 'lucide-react';
import { useOpportunity, useUpdateOpportunity, useCloseLostOpportunity, useDeleteOpportunity } from '@/hooks/api/useOpportunity';
import { useAuthStore } from '@/stores/auth.store';
import { useUsers } from '@/hooks/api/useUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OpportunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [coachingNotes, setCoachingNotes] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStartCoaching = async () => {
    setCoachingNotes('');
    setIsStreaming(true);
    try {
      const token = useAuthStore.getState().accessToken;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const response = await fetch(`${API_URL}/opportunities/${id}/coaching`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to AI Coach');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      
      if (!reader) return;

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const cleanedLine = line.trim();
          if (cleanedLine.startsWith('data:')) {
            const dataStr = cleanedLine.slice(5).trim();
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                 if (parsed && parsed.data) {
                   setCoachingNotes((prev) => prev + parsed.data);
                 } else if (parsed && typeof parsed === 'string') {
                   setCoachingNotes((prev) => prev + parsed);
                 }
              } catch (e) {
                setCoachingNotes((prev) => prev + dataStr);
              }
            }
          }
        }
      }
    } catch (error: any) {
      message.error('Lỗi kết nối với AI Coach: ' + error.message);
    } finally {
      setIsStreaming(false);
    }
  };

  // API Queries
  const { data: oppRes, isLoading } = useOpportunity(id);
  const { data: usersRes } = useUsers();

  // API Mutations
  const updateMutation = useUpdateOpportunity();
  const closeLostMutation = useCloseLostOpportunity();
  const deleteMutation = useDeleteOpportunity();

  const opp = oppRes?.data;
  const realUsers = usersRes?.data || [];

  // Modal control for Close Lost
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lostReason, setLostReason] = useState('');

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-3">
        <Spin size="large" />
        <span className="text-xs text-[var(--color-muted-fg)] font-mono">Loading opportunity details...</span>
      </div>
    );
  }

  if (!opp) {
    return <div className="p-8 text-center text-red-500 font-bold">Opportunity not found</div>;
  }

  const handleStageChange = async (newStage: any) => {
    if (newStage === 'LOST') {
      setLostReason('');
      setLostModalOpen(true);
      return;
    }

    let prob = 10;
    if (newStage === 'WON') prob = 100;
    else if (newStage === 'NEGOTIATION') prob = 80;
    else if (newStage === 'PROPOSAL') prob = 50;
    else if (newStage === 'QUALIFICATION') prob = 20;

    try {
      await updateMutation.mutateAsync({
        id: opp.id,
        dto: {
          stage: newStage,
          probability: prob,
        },
      });
    } catch (err) {
      // Handled
    }
  };

  const handleConfirmLost = async () => {
    if (!lostReason.trim()) {
      message.error('Please enter a reason for losing this opportunity');
      return;
    }

    try {
      await closeLostMutation.mutateAsync({
        id: opp.id,
        lostReason,
      });
      setLostModalOpen(false);
    } catch (err) {
      // Handled
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Xác nhận xóa cơ hội bán hàng',
      content: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?',
      okText: 'Xác nhận xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(opp.id);
          router.push('/opportunities');
        } catch (err) {
          // Handled
        }
      }
    });
  };

  const handleOwnerChange = async (ownerId: string) => {
    try {
      await updateMutation.mutateAsync({
        id: opp.id,
        dto: { ownerId },
      });
    } catch (err) {
      // Handled
    }
  };

  // Convert stage list to index for visual Stepper
  const stagesOrder = ['QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON'];
  const currentStep = stagesOrder.indexOf(opp.stage === 'LOST' ? 'WON' : opp.stage);

  const ownerName = opp.owner ? `${opp.owner.firstName || ''} ${opp.owner.lastName || ''}`.trim() : 'System Admin';

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/opportunities" className="hover:underline">Opportunities</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{opp.opportunityCode}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {opp.name}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Deal Code: {opp.opportunityCode} • {opp.serviceInterest}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            opp.stage === 'WON' ? 'bg-green-500/10 text-green-500' :
            opp.stage === 'LOST' ? 'bg-red-500/10 text-red-500' :
            'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          }`}>
            Stage: {opp.stage}
          </span>
        </div>
      </div>

      {/* Visual Stage Progress Stepper */}
      {opp.stage !== 'LOST' ? (
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-6 rounded-2xl">
          <Steps
            current={currentStep}
            items={[
              { title: 'Qualification', description: '20% Probability' },
              { title: 'Proposal', description: '50% Probability' },
              { title: 'Negotiation', description: '80% Probability' },
              { title: 'Closed Won', description: '100% Probability' },
            ]}
          />
        </div>
      ) : (
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 shrink-0" size={20} />
          <div className="text-xs text-red-800 font-mono">
            <span className="font-bold uppercase block">CLOSED LOST</span>
            <span>Reason: {opp.lostReason}</span>
          </div>
        </div>
      )}

      {/* Main Layout 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Content (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sub Navigation */}
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'progress', name: 'Stage Progress' },
              { id: 'activity', name: 'Activity Log' },
              { id: 'ai-coach', name: 'AI Coach (SSE)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Sub Tab Bodies */}
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[300px]">
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Deal Parameters
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Estimated Amount</span>
                        <span className="font-semibold font-mono">{(opp.amount || 0).toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Probability Suggestion</span>
                        <span className="font-semibold font-mono">{opp.probability || 0}%</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Target Close Date</span>
                        <span className="font-semibold font-mono">{opp.expectedCloseDate ? opp.expectedCloseDate.substring(0, 10) : ''}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Service Interest</span>
                        <span className="font-semibold">{opp.serviceInterest}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Customer Relations
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Account Customer</span>
                        {opp.accountId && (
                          <Link href={`/customers/accounts/${opp.accountId}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                            {opp.account?.name || 'View Account'}
                          </Link>
                        )}
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Primary Contact</span>
                        {opp.contactId && (
                          <Link href={`/customers/contacts/${opp.contactId}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                            {opp.contact ? `${opp.contact.firstName || ''} ${opp.contact.lastName || ''}`.trim() : 'View Contact'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--color-border)]/50">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                    Opportunity Scope Description
                  </h3>
                  <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] whitespace-pre-wrap font-mono">
                    {opp.description || 'No description provided.'}
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'progress' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Stage transition history</h3>
                <div className="relative border-l border-[var(--color-border)] ml-3 pl-6 space-y-6 text-xs font-mono">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-accent)] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">1</span>
                    <p className="font-semibold text-[var(--color-fg)]">QUALIFICATION stage reached</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)]">{opp.createdAt ? opp.createdAt.substring(0, 10) : ''} • System auto-qualify from converter</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-accent)] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">2</span>
                    <p className="font-semibold text-[var(--color-fg)]">{opp.stage} stage reached</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)]">{opp.updatedAt ? opp.updatedAt.substring(0, 10) : ''} • Transitioned by {ownerName}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Timeline logs</h3>
                <div className="p-6 bg-[var(--color-surface)]/20 border border-[var(--color-border)]/50 rounded-2xl flex flex-col gap-3 justify-center min-h-[160px] text-center text-[var(--color-muted-fg)] text-xs font-mono">
                  <HelpCircle size={32} className="mx-auto text-[var(--color-accent)]/50" />
                  <span>No customer-facing timeline logs registered.</span>
                </div>
              </div>
            )}

            {activeSubTab === 'ai-coach' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[var(--color-border)]/50 pb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-fg)] flex items-center gap-2">
                      <Bot size={18} className="text-[var(--color-accent)]" />
                      <span>Trợ lý Ảo AI Coach</span>
                    </h3>
                    <p className="text-[11px] text-[var(--color-muted-fg)] mt-1">AI phân tích hoạt động và báo giá để gợi ý đàm phán</p>
                  </div>
                  <Button 
                    type="primary" 
                    onClick={handleStartCoaching} 
                    loading={isStreaming}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer bg-[var(--color-accent)]"
                  >
                    <Zap size={14} />
                    <span>{coachingNotes ? 'Nạp lại Gợi ý' : 'Bắt đầu Coach'}</span>
                  </Button>
                </div>

                {coachingNotes ? (
                  <div className="space-y-4 pt-2">
                    <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl space-y-3 font-sans shadow-sm leading-relaxed text-xs">
                      <p className="font-semibold text-xs text-[var(--color-fg)] flex items-center gap-1.5 border-b border-[var(--color-border)]/50 pb-2">
                        <Bot size={14} className="text-[var(--color-accent)]" />
                        <span>Lời khuyên Đàm phán từ AI Coach:</span>
                      </p>
                      <div className="whitespace-pre-wrap text-xs text-[var(--color-fg)] space-y-2 pt-1 font-mono">
                        {coachingNotes}
                      </div>
                      {isStreaming && (
                        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-accent)] font-mono animate-pulse pt-2">
                          <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full"></span>
                          <span>AI đang gõ tư vấn...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-3 bg-[var(--color-surface)]/10 border border-dashed border-[var(--color-border)] rounded-2xl">
                    <Bot size={44} className="mx-auto text-[var(--color-muted-fg)]/40" />
                    <p className="text-xs text-[var(--color-muted-fg)] max-w-md mx-auto leading-relaxed">
                      Chưa có gợi ý đàm phán nào được tải. Nhấn nút <strong>Bắt đầu Coach</strong> để AI đọc thông tin cơ hội và phản hồi bằng SSE streaming.
                    </p>
                    <Button onClick={handleStartCoaching} loading={isStreaming} className="h-9 px-4 rounded-xl cursor-pointer">
                      Bắt đầu Coach
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Deal Control Panel
            </h3>

            {/* Change Stage */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Sales Stage Setting
              </label>
              <Select
                value={opp.stage}
                onChange={handleStageChange}
                options={[
                  { value: 'QUALIFICATION', label: 'Qualification' },
                  { value: 'PROPOSAL', label: 'Proposal' },
                  { value: 'NEGOTIATION', label: 'Negotiation' },
                  { value: 'WON', label: 'Closed Won' },
                  { value: 'LOST', label: 'Closed Lost' },
                ]}
                className="w-full h-10"
              />
            </div>

            {/* Change Owner */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Assigned Owner
              </label>
              <Select
                value={opp.ownerId || ''}
                onChange={handleOwnerChange}
                options={realUsers.map(u => ({ value: u.id, label: u.name }))}
                className="w-full h-10"
              />
            </div>

            {/* Delete Option */}
            <div className="pt-4 border-t border-[var(--color-border)]/50">
              <Button danger onClick={handleDelete} loading={deleteMutation.isPending} className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer">
                <Trash2 size={16} />
                <span>Delete Opportunity</span>
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Closed Lost Reason Modal */}
      <Modal
        title="Mark Opportunity as Closed Lost"
        open={lostModalOpen}
        onCancel={() => setLostModalOpen(false)}
        onOk={handleConfirmLost}
        confirmLoading={closeLostMutation.isPending}
        okText="Confirm Close Lost"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--color-muted-fg)]">To close this opportunity as lost, please provide a valid reason.</p>
          <textarea
            placeholder="Reason for loss..."
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            className="w-full min-h-[100px] p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] focus:outline-none"
          />
        </div>
      </Modal>
    </div>
  );
}
