'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Bot, Shield, Terminal, Settings, RefreshCw, Cpu, Database, 
  AlertCircle, Activity, Play, ChevronDown, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';
import { Button, message, Tag } from 'antd';
import Link from 'next/link';

// Mock charts data
const requestsData = [
  { day: '07/05', requests: 120 },
  { day: '07/06', requests: 180 },
  { day: '07/07', requests: 150 },
  { day: '07/08', requests: 210 },
  { day: '07/09', requests: 280 },
  { day: '07/10', requests: 310 },
  { day: '07/11', requests: 420 },
];

const tokensData = [
  { day: '07/05', input: 300000, output: 120000 },
  { day: '07/06', input: 450000, output: 180000 },
  { day: '07/07', input: 410000, output: 160000 },
  { day: '07/08', input: 580000, output: 220000 },
  { day: '07/09', input: 710000, output: 290000 },
  { day: '07/10', input: 820000, output: 350000 },
  { day: '07/11', input: 980000, output: 420000 },
];

const toolUsageData = [
  { name: 'queryDatabase', value: 45 },
  { name: 'generateContract', value: 25 },
  { name: 'riskAnalysis', value: 15 },
  { name: 'sendTelegram', value: 15 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function AiHubDashboard() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('prompt');
  const [systemPrompt, setSystemPrompt] = useState('You are a premium CRM assistant for Xantivation Studio. Answer concisely, format numeric variables to VND currency.');
  const [testLogLoading, setTestLogLoading] = useState(false);

  const handleTestBullMqJob = () => {
    message.loading('Triggering manual BullMQ job check_overdue_payments...');
    setTimeout(() => {
      message.success('BullMQ worker checked: 0 overdue invoices flagged.');
    }, 1200);
  };

  const handleToggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">AI Analytics Dashboard</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Admin panel tracking model usage cost, BullMQ queues, and system prompts.</p>
        </div>

        {/* View mode switches */}
        <div className="flex bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-1 rounded-xl">
          <Link
            href="/ai-hub"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all"
          >
            Chat Console
          </Link>
          <Link
            href="/ai-hub/dashboard"
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-accent)] text-white shadow-sm"
          >
            AI Analytics Dashboard
          </Link>
        </div>
      </div>

      {/* 6 Metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { label: 'Total Requests', val: '1,830', change: '+12% vs yesterday' },
          { label: 'Success Rate', val: '98.5%', change: '0 failures today' },
          { label: 'Total Tokens', val: '5.1M', change: 'Input: 3.5M | Output: 1.6M' },
          { label: 'Est. Cost', val: '$10.20', change: 'Based on Groq rates' },
          { label: 'Avg Latency', val: '280ms', change: '99th percentile: 620ms' },
          { label: 'Queue Load', val: '0 pending', change: 'BullMQ status: idle' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">{item.label}</span>
            <h3 className="text-xl font-bold text-[var(--color-fg)]">{item.val}</h3>
            <p className="text-[10px] text-[var(--color-muted-fg)]">{item.change}</p>
          </div>
        ))}
      </div>

      {/* Visual Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests Chart */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block">Daily Requests</span>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestsData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-fg)" />
                <YAxis stroke="var(--color-muted-fg)" />
                <ChartTooltip />
                <Area type="monotone" dataKey="requests" stroke="#4F46E5" fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tokens Chart */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block">Token Allocation</span>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokensData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-fg)" />
                <YAxis stroke="var(--color-muted-fg)" />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="input" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Input Tokens" />
                <Bar dataKey="output" fill="#10B981" radius={[4, 4, 0, 0]} name="Output Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tool Distribution Chart */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block">Tool Trigger Frequency</span>
          <div className="h-64 text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toolUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {toolUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
                <Legend formatter={(value) => <span className="text-[10px] text-[var(--color-muted-fg)]">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BullMQ Jobs & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: BullMQ Jobs (2 cols) */}
        <div className="lg:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">BullMQ Background Workers</h3>
              <p className="text-xs text-[var(--color-muted-fg)]">Active asynchronous queue jobs matching Redis broker client.</p>
            </div>
            <Button size="small" icon={<RefreshCw size={12} />} onClick={handleTestBullMqJob}>Check Worker</Button>
          </div>

          <div className="space-y-3">
            {[
              { id: 'job_lead_bant_qualification', progress: 100, status: 'Completed', detail: 'Processed budget check for LEAD-2026-00001' },
              { id: 'job_docusign_webhook_receiver', progress: 100, status: 'Completed', detail: 'Registered signed envelope status for CON-2026-00001' },
              { id: 'job_sales_forecast_weighting_calculation', progress: 100, status: 'Completed', detail: 'Rendered weighted forecast matrix formulas' },
              { id: 'job_cron_overdue_payments_daily', progress: 0, status: 'Active (Idle)', detail: 'Trigger cron schedules check every 24 hours' }
            ].map((job, idx) => (
              <div key={idx} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-semibold text-[var(--color-fg)] block">{job.id}</span>
                  <span className="text-[10px] text-[var(--color-muted-fg)] block mt-0.5">{job.detail}</span>
                </div>
                <Tag color={job.status === 'Completed' ? 'success' : 'processing'}>{job.status}</Tag>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Activity Timeline (1 col) */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--color-fg)] border-b border-[var(--color-border)] pb-3">
            Activity Timeline
          </h3>

          <div className="relative border-l border-[var(--color-border)] ml-3 pl-4 space-y-5 text-xs">
            {[
              { text: 'RAG Document embedded: Sales_Brief_2.pdf', time: '10:30', tag: 'Vector RAG' },
              { text: 'Tool queryDatabase executed: matches CON-001', time: '10:28', tag: 'Tool execution' },
              { text: 'DocuSign Webhook processed: status completed', time: '10:15', tag: 'E-signature' },
              { text: 'Cron overdue check triggered manually', time: '09:00', tag: 'BullMQ queue' }
            ].map((event, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                <p className="font-semibold text-[var(--color-fg)]">{event.text}</p>
                <div className="flex gap-2 items-center text-[9px] text-[var(--color-muted-fg)] mt-1 font-mono">
                  <span>{event.time}</span>
                  <span>•</span>
                  <span>{event.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Admin Debug Panel Accordion */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-fg)] flex items-center gap-1.5">
          <Shield size={16} className="text-red-500" />
          <span>Admin Debug Settings</span>
        </h3>

        <div className="border border-[var(--color-border)] rounded-xl overflow-hidden divide-y divide-[var(--color-border)]">
          {/* Section 1: Prompt Editor */}
          <div>
            <button
              onClick={() => handleToggleAccordion('prompt')}
              className="w-full px-4 py-3 bg-[var(--color-surface)] flex justify-between items-center text-xs font-mono font-bold cursor-pointer text-[var(--color-fg)]"
            >
              <span>[01] System Prompt Template Tuning</span>
              {activeAccordion === 'prompt' ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {activeAccordion === 'prompt' && (
              <div className="p-4 bg-[var(--color-bg)]/20 space-y-3">
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full min-h-[100px] p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)]"
                />
                <div className="flex justify-end gap-2">
                  <Button size="small" onClick={() => setSystemPrompt('You are a premium CRM assistant for Xantivation Studio. Answer concisely.')}>Reset</Button>
                  <Button size="small" type="primary" onClick={() => message.success('System Prompt Template updated in database')}>Save Prompt</Button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: retrieved RAG */}
          <div>
            <button
              onClick={() => handleToggleAccordion('rag')}
              className="w-full px-4 py-3 bg-[var(--color-surface)] flex justify-between items-center text-xs font-mono font-bold cursor-pointer text-[var(--color-fg)]"
            >
              <span>[02] Vector RAG Retrieve Debug logs</span>
              {activeAccordion === 'rag' ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {activeAccordion === 'rag' && (
              <div className="p-4 bg-[var(--color-bg)]/20 text-xs font-mono text-[var(--color-muted-fg)] space-y-2">
                <p className="text-[10px] text-green-500">// Last matched vectors query text: "giới hạn trách nhiệm pháp lý"</p>
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg space-y-2">
                  <p><strong>chunk_1 (Score: 0.89)</strong>: "Mục 7.1: Giới hạn bồi thường tối đa của Studio..."</p>
                  <p><strong>chunk_2 (Score: 0.74)</strong>: "Mục 7.2: Thỏa thuận bồi thường không áp dụng cho..."</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Tool IO */}
          <div>
            <button
              onClick={() => handleToggleAccordion('tool-io')}
              className="w-full px-4 py-3 bg-[var(--color-surface)] flex justify-between items-center text-xs font-mono font-bold cursor-pointer text-[var(--color-fg)]"
            >
              <span>[03] Execution Tool Inputs & Outputs</span>
              {activeAccordion === 'tool-io' ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {activeAccordion === 'tool-io' && (
              <div className="p-4 bg-[var(--color-bg)]/20 text-xs font-mono text-[var(--color-muted-fg)]">
                <pre className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-x-auto">
{`{
  "tool": "forecastRevenue",
  "input": {
    "timelineDays": 30,
    "confidenceScoreThreshold": 0.5
  },
  "output": {
    "totalWeightedValue": 397000000,
    "success": true
  }
}`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
