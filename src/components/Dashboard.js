'use client'

import { useState } from 'react'
import { Plus, DollarSign, Users, AlertCircle, Award, TrendingUp, Calendar, Bell, Settings, Eye, LogIn } from 'lucide-react'
import StatCard from './StatCard'
import GroupCard from './GroupCard'

export default function Dashboard({ user, groups, stats, onSelectGroup, onCreateGroup, notifications, onRequestJoin }) {
  const [showJoinGroup, setShowJoinGroup] = useState(false)
  const [joinGroupForm, setJoinGroupForm] = useState({
    groupCode: '',
    agree: false
  })

  const handleJoinGroup = () => {
    if (!joinGroupForm.groupCode || !joinGroupForm.agree) {
      alert('Please enter a group code and agree to the rules')
      return
    }
    console.log('Joining group:', joinGroupForm.groupCode)
    if (typeof onRequestJoin === 'function') {
      onRequestJoin(joinGroupForm.groupCode, user)
    }
    alert('Join request submitted to admin!')
    setJoinGroupForm({ groupCode: '', agree: false })
    setShowJoinGroup(false)
  }

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
          value="In 45 days"
          description="Your turn to receive"
          color="emerald"
        />
        <QuickStatCard
          title="Compliance Score"
          value={`${stats.reliabilityScore}%`}
          description="Keep it above 80%"
          color="purple"
        />
      </div>

      {/* Groups Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">My Groups</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowJoinGroup(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Join Group
            </button>
            <button
              onClick={onCreateGroup}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition"
            >
              <Plus className="w-4 h-4" />
              Create Group
            </button>
          </div>
        </div>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} currentUser={user} onClick={() => onSelectGroup(group)} />
            ))}
          </div>
        ) : (
          <EmptyState onJoin={() => setShowJoinGroup(true)} onCreateGroup={onCreateGroup} />
        )}
      </div>

      {/* Join Group Modal */}
      {showJoinGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Join a ChiedzaFund Group</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Group Code or Invite Link</label>
                <input
                  type="text"
                  value={joinGroupForm.groupCode}
                  onChange={(e) => setJoinGroupForm({ ...joinGroupForm, groupCode: e.target.value })}
                  placeholder="Ask admin for the group code..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">Group Rules</h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  <li>✓ Pay contributions on time</li>
                  <li>✓ Follow the payout order</li>
                  <li>✓ Maintain honesty and transparency</li>
                  <li>✓ Respect all group members</li>
                </ul>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={joinGroupForm.agree}
                  onChange={(e) => setJoinGroupForm({ ...joinGroupForm, agree: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-2"
                />
                <span className="text-sm text-slate-700">
                  I agree to the group rules and will honor all commitments
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleJoinGroup}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Request to Join
                </button>
                <button
                  onClick={() => setShowJoinGroup(false)}
                  className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Quick Stat Card Component
function QuickStatCard({ title, value, description, color }) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600 text-blue-50',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-50',
    purple: 'from-purple-500 to-purple-600 text-purple-50'
  }

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} rounded-lg shadow-sm p-4`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs opacity-75 mt-1">{description}</p>
    </div>
  )
}

// Empty State Component
function EmptyState({ onJoin, onCreateGroup }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-800 mb-2">No Groups Yet</h3>
    <p className="text-slate-600 mb-6">Start your ChiedzaFund journey by joining or creating a group</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onJoin}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <LogIn className="w-4 h-4" />
          Join a Group
        </button>
        <button
          onClick={onCreateGroup}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>
    </div>
  )
}
