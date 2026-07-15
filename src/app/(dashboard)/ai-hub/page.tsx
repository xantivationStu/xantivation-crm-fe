'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Workflow, Radio, Send, UploadCloud, FileText, 
  Sparkles, Search, Plus, Pin, Trash2, Edit2, CheckCircle2, 
  X, AlertTriangle, Paperclip, MoreVertical, Terminal, 
  Brain, HelpCircle, ArrowRight, BookOpen, Clock, Activity, Settings
} from 'lucide-react';
import { Button, message, Steps, Tooltip } from 'antd';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  sender: 'assistant' | 'deerflow' | 'hermes' | 'user';
  content: string;
  timestamp: string;
  dividerText?: string;
}

interface Conversation {
  id: string;
  title: string;
  agentType: 'assistant' | 'deerflow' | 'hermes';
  isPinned: boolean;
  lastMessage: string;
  updatedAt: string;
  messages: Message[];
}

interface RagDoc {
  name: string;
  size: string;
  uploadedAt: string;
  status: 'indexing' | 'ready' | 'error';
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'CRM Assistant introductory chat',
    agentType: 'assistant',
    isPinned: true,
    lastMessage: 'Chào bạn! Tôi là CRM Assistant. Tôi có thể giúp gì cho bạn hôm nay?',
    updatedAt: '10:30',
    messages: [
      { role: 'assistant', sender: 'assistant', content: 'Chào bạn! Tôi là CRM Assistant. Tôi có thể giúp gì cho bạn hôm nay?', timestamp: '10:30' }
    ]
  },
  {
    id: 'conv-2',
    title: 'Contract risk audit CON-2026-00005',
    agentType: 'deerflow',
    isPinned: true,
    lastMessage: 'Phân tích rủi ro hoàn tất. Phát hiện 2 điều khoản có độ rủi ro trung bình.',
    updatedAt: '10:15',
    messages: [
      { role: 'user', sender: 'user', content: 'Hãy phân tích điều khoản phạt hợp đồng CON-2026-00005', timestamp: '10:14' },
      { role: 'assistant', sender: 'deerflow', content: 'Phân tích rủi ro hoàn tất. Phát hiện 2 điều khoản có độ rủi ro trung bình liên quan đến điều khoản bồi thường thiệt hại và thời gian bàn giao dự án.', timestamp: '10:15' }
    ]
  },
  {
    id: 'conv-3',
    title: 'Telegram lead status notify campaign',
    agentType: 'hermes',
    isPinned: false,
    lastMessage: 'Đã gửi thông báo thành công cho 5 thành viên nhóm Sales.',
    updatedAt: 'Yesterday',
    messages: [
      { role: 'user', sender: 'user', content: 'Gửi báo cáo trạng thái Lead hôm nay qua Telegram', timestamp: 'Yesterday' },
      { role: 'assistant', sender: 'hermes', content: 'Đã gửi thông báo thành công cho 5 thành viên nhóm Sales qua kênh Telegram Bot.', timestamp: 'Yesterday' }
    ]
  }
];

const agents = [
  { id: 'assistant', name: 'CRM Assistant', description: 'Handles pipeline statistics & client matching', icon: Bot, color: 'indigo', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-500', dot: 'bg-indigo-500' },
  { id: 'deerflow', name: 'DeerFlow Sidecar', description: 'Enforces business rules & contract risk forecasting', icon: Workflow, color: 'emerald', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500' },
  { id: 'hermes', name: 'Hermes Gateway', description: 'Telegram / Zalo integration auto-responses', icon: Radio, color: 'amber', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
];

const slashCommands = [
  { cmd: '/create-lead', desc: 'Tạo Lead mới trên hệ thống', agent: 'assistant' },
  { cmd: '/create-opportunity', desc: 'Tạo cơ hội kinh doanh mới', agent: 'assistant' },
  { cmd: '/generate-quotation', desc: 'Soạn thảo báo giá từ deal history', agent: 'deerflow' },
  { cmd: '/generate-contract', desc: 'Tạo dự thảo hợp đồng pháp lý', agent: 'deerflow' },
  { cmd: '/forecast', desc: 'Dự báo doanh thu bán hàng 30 ngày', agent: 'deerflow' },
  { cmd: '/risk-analysis', desc: 'Phân tích rủi ro điều khoản hợp đồng', agent: 'deerflow' },
  { cmd: '/send-telegram', desc: 'Gửi tin nhắn thông báo Telegram', agent: 'hermes' },
  { cmd: '/send-zalo', desc: 'Gửi thông báo tin nhắn Zalo OA', agent: 'hermes' }
];

const entityMentions = [
  { id: '@lead:LEAD-2026-00001', name: 'Lead: CRM Integration Project - Phan Manh' },
  { id: '@customer:ACC-2026-00001', name: 'Client Account: Xantivation Dev' },
  { id: '@opportunity:OPP-2026-00001', name: 'Opportunity: CRM Phase 1' },
  { id: '@contract:CON-2026-00001', name: 'Contract: Service Agreement - Xantivation' },
  { id: '@deal:DEAL-2026-00001', name: 'Deal: CRM Enterprise Setup' }
];

export default function AIHub() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [activeAgent, setActiveAgent] = useState<'assistant' | 'deerflow' | 'hermes'>('assistant');
  const [autoRoute, setAutoRoute] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'execution' | 'context' | 'tools' | 'knowledge' | 'memory'>('context');
  
  // Input search fields
  const [searchConvQuery, setSearchConvQuery] = useState('');
  const [filterAgentType, setFilterAgentType] = useState('ALL');

  // Streaming mock state
  const [streamingMessage, setStreamingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);

  // RAG mock store
  const [documents, setDocuments] = useState<RagDoc[]>([
    { name: 'Xantivation_Studio_Branding_Guidelines_2026.pdf', size: '2.4 MB', uploadedAt: '2026-07-01', status: 'ready' },
    { name: 'CRM_Service_Agreement_Template.docx', size: '154 KB', uploadedAt: '2026-07-05', status: 'ready' }
  ]);

  // Memory items mock state
  const [memoryItems, setMemoryItems] = useState([
    { key: 'Client preference', value: 'Prefers VND currency for all pricing agreements.' },
    { key: 'Payment policy', value: 'Defaults to 50% deposit / 50% delivery terms.' },
    { key: 'Support contact', value: 'Primary legal counsel is contact@xantivation.com.' }
  ]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, streamingMessage]);

  // Handle command triggering or selection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Show popup lists dynamically
    if (val.endsWith('/')) {
      setShowSlashMenu(true);
      setShowMentionMenu(false);
    } else if (val.includes('/') && !val.endsWith(' ')) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }

    if (val.endsWith('@')) {
      setShowMentionMenu(true);
      setShowSlashMenu(false);
    } else if (val.includes('@') && !val.endsWith(' ')) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSelectSlashCommand = (cmd: string, agent: string) => {
    setInputValue(cmd + ' ');
    setShowSlashMenu(false);
    if (autoRoute) {
      setActiveAgent(agent as any);
      message.info(`Auto Mode switched active agent to ${agent.toUpperCase()}`);
    }
  };

  const handleSelectMention = (mentionId: string) => {
    const parts = inputValue.split('@');
    parts[parts.length - 1] = mentionId;
    setInputValue(parts.join('') + ' ');
    setShowMentionMenu(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || loading) return;

    const prompt = inputValue.trim();
    setInputValue('');
    setShowSlashMenu(false);
    setShowMentionMenu(false);

    // Add user message
    const updatedMessages = [
      ...activeConv.messages,
      {
        role: 'user' as const,
        sender: 'user' as const,
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setConversations(
      conversations.map(c => 
        c.id === activeConv.id 
          ? { ...c, messages: updatedMessages, lastMessage: prompt, updatedAt: 'Just now' }
          : c
      )
    );

    setLoading(true);
    setStreamingMessage('');
    setExecutionStep(1); // planner active

    // Simulate Agent Step-by-Step execution (vertical stepper updates)
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      setExecutionStep(Math.min(currentStep, 7));
    }, 400);

    // Call real backend SSE streaming API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const sseUrl = `${apiUrl}/integrations/ai-hub/chat?prompt=${encodeURIComponent(prompt)}&agent=${activeAgent}`;
    
    let eventSource: EventSource | null = null;
    let accumulatedText = '';
    let hasReceivedData = false;

    try {
      eventSource = new EventSource(sseUrl);
      
      eventSource.onmessage = (event) => {
        hasReceivedData = true;
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.content) {
            accumulatedText += parsed.content;
            setStreamingMessage(accumulatedText);
          }
        } catch (err) {
          // fallback to reading raw text if not JSON
          accumulatedText += event.data;
          setStreamingMessage(accumulatedText);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) eventSource.close();
        clearInterval(interval);
        
        if (hasReceivedData) {
          // Stream completed successfully or ended
          finalizeChat(accumulatedText, updatedMessages);
        } else {
          // Backend offline or error, fallback to client mock simulation
          triggerAiResponseFallback(prompt, updatedMessages);
        }
      };
    } catch (e) {
      clearInterval(interval);
      triggerAiResponseFallback(prompt, updatedMessages);
    }
  };

  const finalizeChat = (content: string, messageHistory: Message[]) => {
    setConversations(
      conversations.map(c => 
        c.id === activeConv.id 
          ? {
              ...c,
              messages: [
                ...messageHistory,
                {
                  role: 'assistant',
                  sender: activeAgent,
                  content,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ],
              lastMessage: content.substring(0, 60) + '...',
              updatedAt: 'Just now'
            }
          : c
      )
    );
    setStreamingMessage('');
    setLoading(false);
    setExecutionStep(8); // completed
  };

  const triggerAiResponseFallback = (prompt: string, messageHistory: Message[]) => {
    let responseText = `Tôi đã nhận được yêu cầu "${prompt}". Với vai trò là ${activeAgent === 'assistant' ? 'CRM Assistant' : activeAgent === 'deerflow' ? 'DeerFlow Sidecar' : 'Hermes Gateway'}, tôi đang phân tích các tài nguyên liên quan...`;
    
    if (prompt.startsWith('/forecast')) {
      responseText = `### 📊 Báo cáo dự báo doanh thu 30 ngày (Weighted Forecast)
Dựa trên pipeline của Xantivation Studio và xác suất các cơ hội:

| Stage | Số lượng | Tổng giá trị (VND) | Trọng số (%) | Giá trị dự báo |
|---|---|---|---|---|
| Discovery | 5 | 120,000,000 | 10% | 12,000,000 |
| Proposal | 3 | 450,000,000 | 50% | 225,000,000 |
| Negotiation | 2 | 200,000,000 | 80% | 160,000,000 |
| **Tổng cộng** | **10** | **770,000,000** | - | **397,000,000 VND** |

Dự báo dòng tiền thực nhận sẽ đạt đỉnh vào ngày 05/08/2026 khi mốc nghiệm thu của cơ hội **CRM Setup** hoàn thành.`;
    } else if (prompt.startsWith('/risk-analysis')) {
      responseText = `### ⚠️ Kết quả rà soát rủi ro pháp lý hợp đồng
Tôi đã kiểm tra nội dung file thỏa thuận và phát hiện:
- **Điều khoản thanh toán**: Thiếu quy định phạt chậm trả tiền (Lãi suất phạt quá hạn). *Mức độ rủi ro: Trung bình*.
- **Giới hạn trách nhiệm**: Trách nhiệm bồi thường của studio chưa được giới hạn bằng 100% giá trị hợp đồng thực nhận. *Mức độ rủi ro: Cao*.

*Khuyến nghị*: Bổ sung điều khoản giới hạn trách nhiệm bồi thường tại Mục 7.2 trước khi kích hoạt DocuSign gửi đối tác.`;
    }

    let words = responseText.split(' ');
    let wordIdx = 0;
    let accumulatedText = '';
    
    const streamInterval = setInterval(() => {
      if (wordIdx < words.length) {
        accumulatedText += words[wordIdx] + ' ';
        setStreamingMessage(accumulatedText);
        wordIdx++;
      } else {
        clearInterval(streamInterval);
        finalizeChat(accumulatedText, messageHistory);
      }
    }, 60);
  };

  const handleCreateNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newChat: Conversation = {
      id: newId,
      title: `Conversation ${conversations.length + 1}`,
      agentType: activeAgent,
      isPinned: false,
      lastMessage: `Hello, active agent is ${activeAgent.toUpperCase()}`,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          role: 'assistant',
          sender: activeAgent,
          content: `Chào bạn! Tôi là ${agents.find(a => a.id === activeAgent)?.name}. Tôi có thể giúp gì cho bạn?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setConversations([newChat, ...conversations]);
    setActiveConvId(newId);
    message.success('New conversation initialized.');
  };

  const handlePinChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(
      conversations.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c)
    );
    message.success('Conversation status updated.');
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      message.error('At least one conversation is required.');
      return;
    }
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeConvId === id) {
      setActiveConvId(remaining[0].id);
    }
    message.warning('Conversation deleted.');
  };

  const handleUploadRag = () => {
    message.loading('Scanning PDF paragraphs and computing embeddings vector mapping...');
    setTimeout(() => {
      setDocuments([
        ...documents,
        { name: `Sales_Brief_Draft_${documents.length + 1}.pdf`, size: '820 KB', uploadedAt: new Date().toISOString().substring(0, 10), status: 'ready' }
      ]);
      message.success('Vector mapping indexed successfully into FAISS database.');
    }, 1500);
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchConvQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchConvQuery.toLowerCase());
    const matchesAgent = filterAgentType === 'ALL' || c.agentType === filterAgentType;
    return matchesSearch && matchesAgent;
  });

  const pinnedConvs = filteredConversations.filter(c => c.isPinned);
  const recentConvs = filteredConversations.filter(c => !c.isPinned);

  const selectedAgentData = agents.find(a => a.id === activeAgent) || agents[0];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)] flex items-center gap-2">
            <span>AI Hub Workspace</span>
            <span className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5 rounded-full border border-[var(--color-accent)]/20 font-mono">
              V3 Pipeline
            </span>
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Multi-Agent cognitive console, automatic workflows routing, and CRM context sidecar.</p>
        </div>

        {/* View mode page switches */}
        <div className="flex bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-1 rounded-xl">
          <Link
            href="/ai-hub"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-accent)] text-white shadow-sm"
          >
            Chat Console
          </Link>
          <Link
            href="/ai-hub/dashboard"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all"
          >
            AI Analytics Dashboard
          </Link>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Column 1: Conversations History Sidebar */}
        <div className="lg:col-span-1 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden">
          {/* Header search & create */}
          <div className="p-4 border-b border-[var(--color-border)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Chat History
              </span>
              <button
                onClick={handleCreateNewChat}
                className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                <Plus size={12} />
                <span>New Chat</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-2.5 py-1.5">
              <Search size={14} className="text-[var(--color-muted-fg)]" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchConvQuery}
                onChange={(e) => setSearchConvQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-[var(--color-fg)] placeholder-[var(--color-muted-fg)] w-full"
              />
            </div>

            {/* Agent filter tab dropdown */}
            <select
              value={filterAgentType}
              onChange={(e) => setFilterAgentType(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 rounded-lg text-[10px] text-[var(--color-fg)] outline-none"
            >
              <option value="ALL">All Agents</option>
              <option value="assistant">CRM Assistant</option>
              <option value="deerflow">DeerFlow Sidecar</option>
              <option value="hermes">Hermes Gateway</option>
            </select>
          </div>

          {/* Conversations list container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Pinned section */}
            {pinnedConvs.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-[var(--color-muted-fg)] uppercase px-2 flex items-center gap-1">
                  <Pin size={10} className="rotate-45" /> Pinned
                </p>
                {pinnedConvs.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`group w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2 relative ${
                      activeConvId === c.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                        : 'border-transparent hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <span className={`p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] ${
                      c.agentType === 'assistant' ? 'text-indigo-500' : c.agentType === 'deerflow' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {c.agentType === 'assistant' ? <Bot size={12} /> : c.agentType === 'deerflow' ? <Workflow size={12} /> : <Radio size={12} />}
                    </span>
                    <div className="truncate flex-1">
                      <p className="text-xs font-semibold text-[var(--color-fg)] truncate pr-4">{c.title}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                    <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handlePinChat(c.id, e)} className="p-0.5 text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]">
                        <Pin size={10} className="rotate-45" />
                      </button>
                      <button onClick={(e) => handleDeleteChat(c.id, e)} className="p-0.5 text-red-500 hover:text-red-700">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent section */}
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-[var(--color-muted-fg)] uppercase px-2">Recent chats</p>
              {recentConvs.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`group w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2 relative ${
                    activeConvId === c.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                      : 'border-transparent hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <span className={`p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] ${
                    c.agentType === 'assistant' ? 'text-indigo-500' : c.agentType === 'deerflow' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {c.agentType === 'assistant' ? <Bot size={12} /> : c.agentType === 'deerflow' ? <Workflow size={12} /> : <Radio size={12} />}
                  </span>
                  <div className="truncate flex-1">
                    <p className="text-xs font-semibold text-[var(--color-fg)] truncate pr-4">{c.title}</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handlePinChat(c.id, e)} className="p-0.5 text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]">
                      <Pin size={10} />
                    </button>
                    <button onClick={(e) => handleDeleteChat(c.id, e)} className="p-0.5 text-red-500 hover:text-red-700">
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}
              {recentConvs.length === 0 && pinnedConvs.length === 0 && (
                <p className="text-[10px] text-[var(--color-muted-fg)] text-center py-4">No conversations found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Chat Panel (Center) */}
        <div className="lg:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden min-w-0">
          {/* Top Selector Bar */}
          <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/20 flex items-center justify-between gap-4 shrink-0">
            <div className="flex gap-2">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = activeAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setActiveAgent(agent.id as any);
                      // Add system divider when switching agents mid-conversation
                      if (activeConv.messages.length > 0 && activeConv.messages[activeConv.messages.length - 1].sender !== agent.id) {
                        setConversations(
                          conversations.map(c => 
                            c.id === activeConv.id 
                              ? {
                                  ...c,
                                  messages: [
                                    ...c.messages,
                                    {
                                      role: 'assistant',
                                      sender: agent.id as any,
                                      content: `── Switched active model agent to ${agent.name} ──`,
                                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                      dividerText: `Switched to ${agent.name}`
                                    }
                                  ]
                                }
                              : c
                          )
                        );
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? `border-${agent.color}-500 bg-${agent.color}-500/10 ${agent.text} shadow-sm`
                        : 'border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)]'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{agent.name.split(' ')[0]}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Auto Mode Mode Toggle */}
            <div className="flex items-center gap-2 border-l border-[var(--color-border)] pl-4">
              <span className="text-[10px] font-mono text-[var(--color-muted-fg)] uppercase">Auto Mode</span>
              <button
                onClick={() => setAutoRoute(!autoRoute)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  autoRoute 
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-500' 
                    : 'border-[var(--color-border)] text-[var(--color-muted-fg)]'
                }`}
                title="Automatically route queries to optimal agent"
              >
                <Sparkles size={13} />
              </button>
            </div>
          </div>

          {/* Agent Status Bar */}
          <div className="bg-[var(--color-bg)]/40 px-6 py-2 border-b border-[var(--color-border)]/50 text-[10px] font-mono text-[var(--color-muted-fg)] flex justify-between items-center">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${selectedAgentData.dot}`} />
              <span>{selectedAgentData.name} • Active routing</span>
            </span>
            <span>SSE connection: active</span>
          </div>

          {/* Messages Console */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 min-h-0 bg-[var(--color-bg)]/20">
            {activeConv.messages.map((msg, idx) => {
              if (msg.dividerText) {
                return (
                  <div key={idx} className="flex justify-center my-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Terminal size={10} />
                      {msg.dividerText}
                    </span>
                  </div>
                );
              }

              const isUser = msg.role === 'user';
              const agentData = agents.find(a => a.id === msg.sender);
              const Icon = agentData?.icon || Bot;

              return (
                <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <span className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center shrink-0 border border-[var(--color-border)] ${agentData?.bg} ${agentData?.text}`}>
                      <Icon size={16} />
                    </span>
                  )}

                  <div className={`max-w-[75%] space-y-1`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-semibold text-[var(--color-fg)]">
                        {isUser ? 'You' : agentData?.name}
                      </span>
                      <span className="text-[8px] font-mono text-[var(--color-muted-fg)]">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[var(--color-accent)] text-white shadow-sm rounded-tr-none'
                        : `bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)] rounded-tl-none border-l-4 ${agentData?.border || 'border-indigo-500/30'}`
                    }`}>
                      {/* Simple custom markdown renderer for tables & lists */}
                      {msg.content.includes('|') ? (
                        <div className="space-y-3 overflow-x-auto">
                          <p className="font-semibold">{msg.content.split('\n')[0]}</p>
                          <table className="min-w-full divide-y divide-[var(--color-border)] text-[10px]">
                            <thead>
                              <tr className="bg-[var(--color-bg)]">
                                {msg.content.split('\n')[2].split('|').filter(x => x.trim()).map((cell, cIdx) => (
                                  <th key={cIdx} className="px-2 py-1.5 text-left font-mono font-bold uppercase">{cell.trim()}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]/50">
                              {msg.content.split('\n').slice(4).filter(line => line.includes('|')).map((line, lIdx) => (
                                <tr key={lIdx}>
                                  {line.split('|').filter(x => x.trim()).map((cell, cIdx) => (
                                    <td key={cIdx} className="px-2 py-1.5 font-mono">{cell.trim()}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Streaming block display */}
            {streamingMessage && (
              <div className="flex gap-3 justify-start">
                <span className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center shrink-0 border border-[var(--color-border)] ${selectedAgentData.bg} ${selectedAgentData.text}`}>
                  {React.createElement(selectedAgentData.icon, { size: 16 })}
                </span>
                <div className="max-w-[75%] space-y-1">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-semibold text-[var(--color-fg)]">
                      {selectedAgentData.name}
                    </span>
                    <span className="text-[8px] font-mono text-[var(--color-muted-fg)]">Streaming...</span>
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)] rounded-tl-none border-l-4 ${selectedAgentData.border}`}>
                    <p className="whitespace-pre-line">{streamingMessage}</p>
                    <span className="inline-block w-1.5 h-3.5 bg-[var(--color-accent)] animate-pulse ml-0.5" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Autocomplete overlays */}
          <div className="relative">
            {showSlashMenu && (
              <div className="absolute bottom-4 left-4 right-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg p-2 max-h-[160px] overflow-y-auto z-50 text-xs">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] px-3 py-1 border-b border-[var(--color-border)]/50">Slash Commands</p>
                {slashCommands.map((item) => (
                  <div
                    key={item.cmd}
                    onClick={() => handleSelectSlashCommand(item.cmd, item.agent)}
                    className="p-2 hover:bg-[var(--color-bg)] rounded-lg cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-mono font-semibold text-[var(--color-accent)]">{item.cmd}</span>
                    <span className="text-[10px] text-[var(--color-muted-fg)]">{item.desc} ({item.agent})</span>
                  </div>
                ))}
              </div>
            )}

            {showMentionMenu && (
              <div className="absolute bottom-4 left-4 right-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg p-2 max-h-[160px] overflow-y-auto z-50 text-xs">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] px-3 py-1 border-b border-[var(--color-border)]/50">Reference CRM Entities</p>
                {entityMentions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMention(item.id)}
                    className="p-2 hover:bg-[var(--color-bg)] rounded-lg cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-mono font-semibold text-indigo-500">{item.id}</span>
                    <span className="text-[10px] text-[var(--color-muted-fg)]">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat input block */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-tint)] flex items-center gap-3 shrink-0">
            {/* mini selector */}
            <div className="relative">
              <span className={`p-2.5 rounded-xl border border-[var(--color-border)] flex items-center justify-center bg-[var(--color-surface)] ${selectedAgentData.text}`}>
                {React.createElement(selectedAgentData.icon, { size: 14 })}
              </span>
            </div>

            <input
              type="text"
              placeholder={`Ask ${selectedAgentData.name} or type / command...`}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--color-fg)] placeholder-[var(--color-muted-fg)] focus:outline-none focus:border-[var(--color-accent)] transition-all"
            />

            <button
              onClick={handleUploadRag}
              className="p-2.5 text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)] rounded-xl transition-all cursor-pointer"
              title="Attach document reference"
            >
              <Paperclip size={14} />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="p-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Column 3: Right Panel Context / Steppers */}
        <div className="lg:col-span-1 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden min-w-0">
          {/* Tabs header */}
          <div className="flex border-b border-[var(--color-border)] p-1.5 gap-0.5 bg-[var(--color-surface)]/20 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { id: 'context', label: 'Context' },
              { id: 'execution', label: 'Exec' },
              { id: 'tools', label: 'Tools' },
              { id: 'knowledge', label: 'RAG' },
              { id: 'memory', label: 'Memory' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightPanelTab(tab.id as any)}
                className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rightPanelTab === tab.id
                    ? 'bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] font-bold'
                    : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel content body */}
          <div className="flex-1 p-4 overflow-y-auto text-xs space-y-4 min-h-0">
            
            {rightPanelTab === 'context' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                    Active Business Context
                  </h4>
                  <span className="text-[8px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-mono font-bold">
                    DETECTED
                  </span>
                </div>

                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-2">
                  <p className="text-[9px] font-mono text-[var(--color-muted-fg)] uppercase">Account Context</p>
                  <p className="font-semibold text-[var(--color-fg)]">CyberCore LLC</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)]">B2B client • Tax code: 010928811</p>
                  <div className="flex gap-2 pt-1 border-t border-[var(--color-border)]/50 mt-2">
                    <Link href="/customers" className="text-[10px] text-[var(--color-accent)] hover:underline flex items-center gap-0.5 font-bold">
                      <span>View Account</span>
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-2">
                  <p className="text-[9px] font-mono text-[var(--color-muted-fg)] uppercase">Linked Deal & Score</p>
                  <p className="font-semibold text-[var(--color-fg)]">CyberCore Brand Strategy Setup</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[var(--color-muted-fg)]">BANT Status:</span>
                    <span className="font-mono text-emerald-500 font-bold">80% Qualified</span>
                  </div>
                </div>
              </div>
            )}

            {rightPanelTab === 'execution' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                    Agent Workflow Steps
                  </h4>
                  {loading && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />}
                </div>

                <Steps
                  direction="vertical"
                  size="small"
                  current={executionStep - 1}
                  items={[
                    { title: 'Receive Prompt', description: 'Parser check.' },
                    { title: 'Execution Planning', description: 'Assigning optimal agent.' },
                    { title: 'Search CRM DB', description: 'Querying entities references.' },
                    { title: 'Execute SQL Query', description: 'Retrieving data structures.' },
                    { title: 'Invoke Groq API', description: 'Running inference.' },
                    { title: 'Execute Sidecar Tools', description: 'Calculating weights.' },
                    { title: 'Format Markdown', description: 'Organizing tables.' },
                    { title: 'Finalize Response', description: 'SSE dispatch completed.' },
                  ]}
                  className="text-xs"
                />
              </div>
            )}

            {rightPanelTab === 'tools' && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] mb-2">
                  Executed CRM Tools
                </h4>

                {[
                  { name: 'queryDatabase', status: 'success', time: '142ms', desc: 'Queried opportunities and clients matches' },
                  { name: 'estimateRevenue', status: 'success', time: '89ms', desc: 'Simulated cash flow weighting formulas' },
                  { name: 'vectorRAGSearch', status: 'success', time: '210ms', desc: 'Matched context terms with indexed files' }
                ].map((tool, idx) => (
                  <div key={idx} className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[var(--color-accent)]">{tool.name}</span>
                      <span className="text-[8px] font-mono text-[var(--color-muted-fg)]">{tool.time}</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-muted-fg)]">{tool.desc}</p>
                    <span className="text-[8px] bg-green-500/10 text-green-500 px-1.5 py-0.2 rounded font-mono font-bold inline-block">SUCCESS</span>
                  </div>
                ))}
              </div>
            )}

            {rightPanelTab === 'knowledge' && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Vector Knowledge RAG
                </h4>

                <div
                  onClick={handleUploadRag}
                  className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-xl p-4 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud size={20} className="mx-auto text-[var(--color-muted-fg)] mb-1" />
                  <p className="text-[10px] font-semibold text-[var(--color-fg)]">Add PDF Reference</p>
                </div>

                <div className="space-y-2">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText size={10} className="text-[var(--color-accent)]" />
                        <span className="font-bold truncate text-[10px]">{doc.name}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-[var(--color-muted-fg)]">
                        <span>{doc.size}</span>
                        <span className="text-green-500 font-bold">READY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rightPanelTab === 'memory' && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Agent Memory Items
                </h4>

                {memoryItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-1">
                    <p className="font-bold text-[10px] text-[var(--color-fg)]">{item.key}</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
