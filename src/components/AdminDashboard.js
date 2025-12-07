'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, DollarSign, TrendingUp, AlertCircle, Settings, Plus, 
  Eye, Edit, Trash2, CheckCircle, Clock, XCircle, Activity, 
  FileText, Send, Shield, BarChart3, Calendar, Copy, Check
} from 'lucide-react'
import AdminMemberManagement from './AdminMemberManagement'
import AdminContributionMonitoring from './AdminContributionMonitoring'
import AdminPayoutManagement from './AdminPayoutManagement'
import AdminFinancialReports from './AdminFinancialReports'
import AdminCommunication from './AdminCommunication'
import AdminSecurityMonitor from './AdminSecurityMonitor'
import AdminCycleManagement from './AdminCycleManagement'

export default function AdminDashboard({ user, groups, onCreateGroup, onUpdateGroup, onApproveRequest, onRejectRequest, onUpdateContribution }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedGroup, setSelectedGroup] = useState(groups[0])

  // Keep selectedGroup synced when `groups` prop changes (e.g. after approve/reject)
  useEffect(() => {
    if (!groups || groups.length === 0) {
      setSelectedGroup(null)
      return
    }

    // Try to keep the same selected group by id, otherwise pick the first
    setSelectedGroup(prev => {
      if (!prev) return groups[0]
      const same = groups.find(g => g.id === prev.id)
      return same || groups[0]
    })
  }, [groups])

  // Calculate statistics
  const stats = {
    totalMembers: selectedGroup?.members?.length || 0,
    pendingPayments: selectedGroup?.members?.reduce((acc, m) => 
      acc + (m.contributions?.filter(c => c.status === 'pending').length || 0), 0) || 0,
    overduePayments: selectedGroup?.members?.reduce((acc, m) => 
      acc + (m.contributions?.filter(c => c.status === 'overdue').length || 0), 0) || 0,
    totalContributed: selectedGroup?.members?.reduce((acc, m) =>
      acc + (m.contributions?.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0) || 0), 0) || 0,
    payoutsPending: selectedGroup?.nextPayout ? 1 : 0
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'contributions', label: 'Contributions', icon: DollarSign },
    { id: 'payouts', label: 'Payouts', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: BarChart3 },
    { id: 'communication', label: 'Messages', icon: Send },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'cycles', label: 'Cycles', icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-8">
      {/* Header with Group Selection */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Admin Control Panel</h2>
              <p className="text-sm text-slate-600">Manage your ChiedzaFund group with full transparency</p>
            </div>
            <button
              onClick={onCreateGroup}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              <Plus size={18} />
              New Group
            </button>
          </div>

          {/* Group Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedGroup?.id === g.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedGroup && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
            <div className="flex border-b">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Group Code Display */}
              <GroupCodeCard group={selectedGroup} />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  title="Total Members"
                  value={stats.totalMembers}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Pending Payments"
                  value={stats.pendingPayments}
                  icon={Clock}
                  color="yellow"
                />
                <StatCard
                  title="Overdue Payments"
                  value={stats.overduePayments}
                  icon={AlertCircle}
                  color="red"
                />
                <StatCard
                  title="Total Contributed"
                  value={`$${stats.totalContributed.toLocaleString()}`}
                  icon={DollarSign}
                  color="green"
                />
                <StatCard
                  title="Payouts Pending"
                  value={stats.payoutsPending}
                  icon={TrendingUp}
                  color="purple"
                />
              </div>

              {/* Admin Info & Responsibilities */}
              <AdminInfoCard group={selectedGroup} user={user} />

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <QuickActionBtn
                    icon={Users}
                    label="Add Member"
                    onClick={() => setActiveTab('members')}
                  />
                  <QuickActionBtn
                    icon={CheckCircle}
                    label="Verify Payments"
                    onClick={() => setActiveTab('contributions')}
                  />
                  <QuickActionBtn
                    icon={DollarSign}
                    label="Process Payout"
                    onClick={() => setActiveTab('payouts')}
                  />
                  <QuickActionBtn
                    icon={Send}
                    label="Send Announcement"
                    onClick={() => setActiveTab('communication')}
                  />
                </div>
              </div>

              {/* Group Info Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Group Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Group Name:</span>
                      <span className="font-semibold text-slate-800">{selectedGroup.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Contribution:</span>
                      <span className="font-semibold text-slate-800">${selectedGroup.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Frequency:</span>
                      <span className="font-semibold text-slate-800 capitalize">{selectedGroup.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Next Payout</h3>
                  {selectedGroup.nextPayout ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Recipient Position:</span>
                        <span className="font-semibold text-slate-800">#{selectedGroup.nextPayout.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Scheduled Date:</span>
                        <span className="font-semibold text-slate-800">{selectedGroup.nextPayout.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Amount:</span>
                        <span className="font-semibold text-emerald-600">${selectedGroup.amount * selectedGroup.members.length}</span>
                      </div>
                      <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium">
                        Process Payout
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-600">No payout scheduled</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <AdminMemberManagement
              group={selectedGroup}
              onUpdate={onUpdateGroup}
              onApproveRequest={onApproveRequest}
              onRejectRequest={onRejectRequest}
              onUpdateContribution={onUpdateContribution}
            />
          )}

          {/* Contributions Tab */}
          {activeTab === 'contributions' && (
            <AdminContributionMonitoring group={selectedGroup} onUpdate={onUpdateGroup} />
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <AdminPayoutManagement group={selectedGroup} onUpdate={onUpdateGroup} />
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <AdminFinancialReports group={selectedGroup} />
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <AdminCommunication group={selectedGroup} members={selectedGroup.members} />
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <AdminSecurityMonitor group={selectedGroup} />
          )}

          {/* Cycles Tab */}
          {activeTab === 'cycles' && (
            <AdminCycleManagement group={selectedGroup} onUpdate={onUpdateGroup} />
          )}
        </main>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600 text-blue-100',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-100',
    red: 'from-red-500 to-red-600 text-red-100',
    green: 'from-green-500 to-green-600 text-green-100',
    purple: 'from-purple-500 to-purple-600 text-purple-100'
  }

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} rounded-lg shadow-sm p-4 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon size={32} className="opacity-50" />
      </div>
    </div>
  )
}

// Admin Info Card Component
function AdminInfoCard({ group, user }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Role */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <p className="text-xs text-purple-600 font-semibold uppercase">Your Role</p>
            <p className="text-sm font-bold text-slate-800">Group Admin & Member</p>
            <p className="text-xs text-slate-600 mt-1">Position: {group?.members?.find(m => m.userId === user?.id)?.position || 1}</p>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-semibold uppercase">Key Duties</p>
            <ul className="text-xs text-slate-700 space-y-0.5 mt-1">
              <li>• Manage members & approvals</li>
              <li>• Monitor contributions</li>
              <li>• Ensure transparency</li>
            </ul>
          </div>
        </div>

        {/* Member Status */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-semibold uppercase">Member Status</p>
            <p className="text-sm font-bold text-slate-800">Active & Participating</p>
            <p className="text-xs text-slate-600 mt-1">You must contribute & receive payouts like other members</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-200 text-xs text-slate-600">
        <p>
          As the group admin, you have full responsibility for managing the group's smooth operation, transparency, contributions, payouts, security, and success. 
          You also participate as a regular member in contributions and payout rotations.
        </p>
      </div>
    </div>
  )
}

// Group Code Card Component
function GroupCodeCard({ group }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyCode = () => {
    if (group?.code) {
      navigator.clipboard.writeText(group.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!group?.code) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-emerald-300 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">Group Code for New Members</p>
          <p className="text-lg text-slate-700 mb-2">Share this code so others can join:</p>
          <div className="flex items-center gap-3">
            <div className="bg-white border-2 border-emerald-600 rounded-lg px-4 py-3">
              <span className="font-mono font-bold text-xl text-emerald-600">{group.code}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 hover:bg-white rounded-lg transition"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-6 h-6 text-emerald-600" />
              ) : (
                <Copy className="w-6 h-6 text-emerald-600 hover:text-emerald-700" />
              )}
            </button>
          </div>
          {copied && <p className="text-xs text-emerald-700 mt-2">✓ Copied to clipboard!</p>}
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-1">How to share:</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Members use this code on their Dashboard → "Join Group"</li>
          <li>✓ Join requests will appear in the Members tab</li>
          <li>✓ Approve requests to add them officially</li>
        </ul>
      </div>
    </div>
  )
}

// Quick Action Button
function QuickActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 hover:from-emerald-50 hover:to-emerald-50 transition border border-slate-200 hover:border-emerald-200"
    >
      <Icon size={24} className="text-emerald-600" />
      <span className="text-xs font-medium text-slate-700">{label}</span>
    </button>
  )
}
