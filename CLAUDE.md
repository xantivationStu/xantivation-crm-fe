# CRM Frontend (Next.js) Developer Memory

## Run & Build Commands
- Development environment: `npm run dev`
- Build project: `npm run build`
- Run tests: `npm run test`

## Integrated AI Governance & Workflow Features
We have upgraded the AI Hub UI and Settings to support multi-model governance and real-time monitoring.

### 1. AI Governance Settings (`/settings` page)
- **AI Governance** tab (visible only to ADMIN and SALES_MANAGER).
- CRUD Providers & API Keys: Manage encrypted API keys, test connection, and auto-scan models.
- Agent Tree Canvas: Hierarchical AI agent tree diagram using `@xyflow/react` (React Flow), supports drag-and-drop and detailed configuration (role, prompt, key/model override) via sidebar.

### 2. Workflow Monitor (`/ai-hub` page)
- **Workflow Monitor** tab next to Chat Console.
- n8n-style Node Graph: Displays real-time execution flow of **Trigger ➔ Agent ➔ Action ➔ Result**.
- SSE Real-time Logs Sync: Direct connection to backend SSE stream, auto-updates execution status with blinking animation for active nodes.
- Sidebar Logs History: Execution logs with pagination, click to load detailed flow diagram.
