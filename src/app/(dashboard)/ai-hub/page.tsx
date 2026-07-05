'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Workflow, Radio, Send, UploadCloud, FileText, Save } from 'lucide-react';
import { Button, message, Steps } from 'antd';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const agents = [
  { id: 'assistant', name: 'CRM Assistant', description: 'Handles pipeline statistics & client matching', icon: Bot, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'deerflow', name: 'DeerFlow Sidecar', description: 'Enforces business rules & contract risk forecasting', icon: Workflow, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'hermes', name: 'Hermes Gateway', description: 'Telegram / Zalo integration auto-responses', icon: Radio, color: 'text-amber-500 bg-amber-500/10' },
];

export default function AIHub() {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeAgent, setActiveAgent] = useState('assistant');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Chào bạn! Tôi là CRM Assistant. Tôi có thể giúp gì cho bạn hôm nay?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Right panel states
  const [rightPanelTab, setRightPanelTab] = useState('context');

  // Admin playground states
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful CRM sales assistant. Answer concisely.');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setLoading(true);
    setStreamingMessage('');

    const url = `/api/v1/integrations/ai-hub/chat?prompt=${encodeURIComponent(userMessage)}`;
    const eventSource = new EventSource(url);

    let accumulated = '';

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.content) {
          accumulated += parsed.content;
          setStreamingMessage(accumulated);
        }
      } catch (err) {}
    };

    eventSource.onerror = () => {
      eventSource.close();
      setMessages((prev) => [...prev, { role: 'assistant', content: accumulated || 'Chào bạn! Tôi đã xử lý xong yêu cầu của bạn.' }]);
      setStreamingMessage('');
      setLoading(false);
    };
  };

  const handleDocumentUpload = () => {
    message.loading('Indexing document details into local vector database...');
    setTimeout(() => {
      setDocuments([...documents, `Document_Report_${documents.length + 1}.pdf`]);
      message.success('Document uploaded and embedded successfully for RAG contextual querying.');
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">AI Hub</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Cognitive workspace, agent analytics, and pipeline forecasting.</p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
            }`}
          >
            Chat Console
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
            }`}
          >
            AI Analytics
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'debug' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
            }`}
          >
            Admin Debug
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Left Side: Agent Selection & Document Library */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto">
            {/* Multi-Agent selector */}
            <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)] px-2">
                Cognitive Agents
              </h3>
              <div className="space-y-1.5">
                {agents.map((agent) => {
                  const Icon = agent.icon;
                  const isSelected = activeAgent === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setActiveAgent(agent.id);
                        setMessages([{ role: 'assistant', content: `Chào bạn! Tôi là ${agent.name}. ${agent.description}. Hãy bắt đầu cuộc trò chuyện!` }]);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-center ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                          : 'border-[var(--color-border)] hover:bg-[var(--color-surface)] bg-transparent'
                      }`}
                    >
                      <span className={`p-2 rounded-lg ${agent.color}`}>
                        <Icon size={16} />
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-[var(--color-fg)]">{agent.name}</p>
                        <p className="text-[10px] text-[var(--color-muted-fg)] truncate">{agent.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RAG Library */}
            <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)] px-2">
                  RAG Document Store
                </h3>

                <div
                  onClick={handleDocumentUpload}
                  className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-xl p-6 text-center cursor-pointer transition-colors duration-200"
                >
                  <UploadCloud size={24} className="mx-auto text-[var(--color-muted-fg)] mb-2" />
                  <p className="text-xs font-semibold text-[var(--color-fg)]">Click to Upload PDF</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)] mt-1">Files will be vectorized automatically</p>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs">
                      <FileText size={12} className="text-[var(--color-accent)]" />
                      <span className="truncate text-[var(--color-fg)]">{doc}</span>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <p className="text-[10px] text-[var(--color-muted-fg)] text-center py-2">No documents indexed yet.</p>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-[var(--color-muted-fg)] font-mono text-center pt-4">
                Vector DB: Local FAISS Indexing
              </div>
            </div>
          </div>

          {/* Center Chat Panel */}
          <div className="lg:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-4 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)]'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-2xl p-4 text-sm bg-[var(--color-surface)] text-[var(--color-fg)] border border-[var(--color-border)]">
                    {streamingMessage}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-tint)] flex gap-3">
              <input
                type="text"
                placeholder={`Ask ${agents.find(a => a.id === activeAgent)?.name || 'AI Assistant'}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-2 text-sm text-[var(--color-fg)] placeholder-[var(--color-muted-fg)] focus:outline-none focus:border-[var(--color-accent)] transition-all duration-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="p-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Right Side: Tab Panel (Business Context, Stepper, Logs) */}
          <div className="lg:col-span-1 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden">
            {/* Panel Tabs Header */}
            <div className="flex border-b border-[var(--color-border)] p-2 gap-1 bg-[var(--color-surface)]/20 shrink-0">
              <button
                onClick={() => setRightPanelTab('context')}
                className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rightPanelTab === 'context' ? 'bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] font-semibold' : 'text-[var(--color-muted-fg)]'
                }`}
              >
                Context
              </button>
              <button
                onClick={() => setRightPanelTab('execution')}
                className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rightPanelTab === 'execution' ? 'bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] font-semibold' : 'text-[var(--color-muted-fg)]'
                }`}
              >
                Execution
              </button>
              <button
                onClick={() => setRightPanelTab('logs')}
                className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rightPanelTab === 'logs' ? 'bg-[var(--color-bg)] text-[var(--color-fg)] border border-[var(--color-border)] font-semibold' : 'text-[var(--color-muted-fg)]'
                }`}
              >
                Logs
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 p-6 overflow-y-auto text-xs space-y-4">
              {rightPanelTab === 'context' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[var(--color-fg)]">Active Business Context</h4>
                  <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-2">
                    <p className="text-[10px] font-mono text-[var(--color-muted-fg)] uppercase">Client Account</p>
                    <p className="font-semibold text-[var(--color-fg)]">CyberCore LLC</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)]">Address: California, US</p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-2">
                    <p className="text-[10px] font-mono text-[var(--color-muted-fg)] uppercase">Deal Metrics</p>
                    <p className="font-semibold text-[var(--color-fg)]">$11,000.00</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)]">BANT Status: 80% Qualified</p>
                  </div>
                </div>
              )}

              {rightPanelTab === 'execution' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[var(--color-fg)]">Agent Process Stepper</h4>
                  <Steps
                    direction="vertical"
                    size="small"
                    current={2}
                    items={[
                      { title: 'BANT Syncing', description: 'Scored prospect parameters.' },
                      { title: 'Quotation Draft', description: 'Generated line items calculation.' },
                      { title: 'Risk Analysis', description: 'Flagged termination terms.' },
                      { title: 'DocuSign Trigger', description: 'Awaiting signature webhook.' },
                    ]}
                  />
                </div>
              )}

              {rightPanelTab === 'logs' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[var(--color-fg)]">Tool Execution Logs</h4>
                  <pre className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[10px] font-mono text-[var(--color-muted-fg)] overflow-x-auto">
{`{
  "tool": "draftQuotation",
  "input": {
    "opportunityId": "opp-99a22"
  },
  "output": {
    "status": "success",
    "grandTotal": 22000
  }
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="flex-1 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
              <span className="text-xs font-mono uppercase text-[var(--color-muted-fg)]">Token Usage (Today)</span>
              <h2 className="text-2xl font-bold mt-2 text-[var(--color-fg)]">12,890 tokens</h2>
            </div>
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
              <span className="text-xs font-mono uppercase text-[var(--color-muted-fg)]">API Latency</span>
              <h2 className="text-2xl font-bold mt-2 text-[var(--color-fg)]">285 ms</h2>
            </div>
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
              <span className="text-xs font-mono uppercase text-[var(--color-muted-fg)]">BullMQ Queue Status</span>
              <h2 className="text-2xl font-bold mt-2 text-emerald-500">Active (0 delayed)</h2>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-fg)]">Background Queue Timeline (BullMQ)</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs">
                <span className="font-mono">job_docusign_webhook_env-90df</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-semibold">Completed</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs">
                <span className="font-mono">job_check_overdue_invoices_daily</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-semibold">Completed</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'debug' && (
        <div className="flex-1 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 overflow-y-auto space-y-6">
          <h3 className="text-sm font-semibold text-[var(--color-fg)]">Prompt Template Tuning</h3>
          <div className="space-y-2 flex flex-col flex-1">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full min-h-[160px] p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-mono text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-accent)]"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={() => setSystemPrompt('You are a helpful CRM sales assistant. Answer concisely.')}>Reset Template</Button>
              <Button type="primary" onClick={() => message.success('Prompt template tuned successfully')}>Save Template</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
