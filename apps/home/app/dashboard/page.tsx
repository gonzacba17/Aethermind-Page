"use client"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AgentOS Dashboard</h1>
        <div className="grid gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome to AgentOS</h2>
            <p className="text-neutral-400">
              Your AI orchestration dashboard. Connect to the API at /api to manage agents, workflows, and executions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Agents</h3>
              <p className="text-neutral-400 text-sm">Manage your AI agents</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Workflows</h3>
              <p className="text-neutral-400 text-sm">Orchestrate multi-agent workflows</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-neutral-400 text-sm">Track costs and performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
