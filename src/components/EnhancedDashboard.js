'use client'

import { useState } from 'react'
import { Plus, DollarSign, Users, AlertCircle, Award, TrendingUp, Calendar, Bell, Settings, BookOpen, MessageSquare, LogIn } from 'lucide-react'
import StatCard from './StatCard'
import GroupCard from './GroupCard'
import UserContributionTracking from './UserContributionTracking'
import UserPayoutSchedule from './UserPayoutSchedule'
import UserProfile from './UserProfile'
import UserCommunication from './UserCommunication'
import GroupRulesAndPolicies from './GroupRulesAndPolicies'

export default function Dashboard({ user, groups, stats, onSelectGroup, onCreateGroup, notifications, onUpdateProfile }) {
  const [showJoinGroup, setShowJoinGroup] = useState(false)
  const [joinGroupForm, setJoinGroupForm] = useState({
    groupCode: '',
    agree: false
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedGroupForRules, setSelectedGroupForRules] = useState(null)

  const handleJoinGroup = () => {
    if (!joinGroupForm.groupCode || !joinGroupForm.agree) {
      alert('Please enter a group code and agree to the rules')
      return
    }
    console.log('Joining group:', joinGroupForm.groupCode)
    alert('Join request submitted to admin!')
    setJoinGroupForm({ groupCode: '', agree: false })
    setShowJoinGroup(false)
  }

  // Get sample group for demo purposes
  const demoGroup = groups && groups.length > 0 ? groups[0] : {
    id: 1,
    name: 'Demo ChiedzaFund Group',
    members: 5,
    totalAmount: 25000,
    nextPayout: 'John Doe',
    nextPayoutDate: '2024-02-01'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'contributions', label: 'Contributions', icon: DollarSign },
    { id: 'payouts', label: 'Payouts', icon: TrendingUp },
    { id: 'rules', label: 'Rules & Policies', icon: BookOpen },
    { id: 'communication', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-emerald-100">Your ChiedzaFund Dashboard</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {tabs.map(tab => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab user={user} groups={groups} stats={stats} notifications={notifications} onJoinGroup={() => setShowJoinGroup(true)} />}
        {activeTab === 'contributions' && <UserContributionTracking user={user} group={demoGroup} />}
        {activeTab === 'payouts' && <UserPayoutSchedule user={user} group={demoGroup} />}
        {activeTab === 'rules' && <GroupRulesAndPolicies group={demoGroup} user={user} />}
        {activeTab === 'communication' && <UserCommunication user={user} group={demoGroup} />}
        {activeTab === 'profile' && <UserProfile user={user} onUpdateProfile={onUpdateProfile} />}
      </div>

      {/* Join Group Modal */}
      {showJoinGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Join a Group</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Group Code</label>
              <input
                type="text"
                placeholder="Enter the group code (e.g., MK-2024-001)"
                value={joinGroupForm.groupCode}
                onChange={(e) => setJoinGroupForm({ ...joinGroupForm, groupCode: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={joinGroupForm.agree}
                  onChange={(e) => setJoinGroupForm({ ...joinGroupForm, agree: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded mt-1"
                />
                <div className="text-sm">
                  <p className="text-slate-700 mb-1">
                    <span className="font-semibold">I agree to:</span>
                  </p>
                  <ul className="text-slate-600 space-y-1 text-xs">
                    <li>✓ Pay the required contribution amount on time</li>
                    <li>✓ Respect the group's payout order</li>
                    <li>✓ Follow all group rules and policies</li>
                    <li>✓ Maintain honesty and integrity</li>
                  </ul>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinGroup(false)
                  setJoinGroupForm({ groupCode: '', agree: false })
                }}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinGroup}
                disabled={!joinGroupForm.agree}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ user, groups, stats, notifications, onJoinGroup }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Active Groups"
          value={stats.activeGroups}
          color="emerald"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Total Contributed"
          value={`$${stats.totalContributed.toLocaleString()}`}
          color="blue"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Reliability Score"
          value={`${stats.reliabilityScore}%`}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Groups Joined"
          value={stats.totalGroups}
          color="teal"
        />
      </div>

      {/* Quick Action Alerts */}
      {notifications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Action Required ({notifications.length})
          </h3>
          <div className="space-y-2">
            {notifications.map(notif => (
              <div key={notif.id} className="flex items-start gap-3 p-3 bg-white rounded border-l-4 border-amber-400">
                <Bell className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">{notif.message}</p>
                  <button className="text-xs text-amber-700 hover:text-amber-900 mt-1 font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickStatCard
          title="Pending Contributions"
          value="$0"
          description="Due by next cycle"
          color="blue"
        />
        <QuickStatCard
          title="Next Payout"
          value="Scheduled"
          description="In 15 days"
          color="emerald"
        />
        <QuickStatCard
          title="Compliance Score"
          value="100%"
          description="Keep it up!"
          color="purple"
        />
      </div>

      {/* Groups Section */}
      {groups && groups.length > 0 ? (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Your Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} currentUser={user} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyStateCard onJoinGroup={onJoinGroup} />
      )}
    </div>
  )
}

// Quick Stat Card Component
function QuickStatCard({ title, value, description, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-lg shadow-sm p-6`}>
      <h4 className="text-sm font-medium opacity-90">{title}</h4>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs opacity-75 mt-1">{description}</p>
    </div>
  )
}

// Empty State Component
function EmptyStateCard({ onJoinGroup }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">No Groups Yet</h3>
      <p className="text-slate-600 mb-6">Join an existing group or create a new one to get started</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onJoinGroup}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
        >
          <LogIn className="w-4 h-4 inline mr-2" />
          Join Group
        </button>
        <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
          <Plus className="w-4 h-4 inline mr-2" />
          Create Group
        </button>
      </div>
    </div>
  )
}
