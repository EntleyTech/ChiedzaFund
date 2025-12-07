'use client'

import { useState } from 'react'
import { DollarSign, Check, Clock, AlertCircle, Send, Eye } from 'lucide-react'

export default function AdminContributionMonitoring({ group, onUpdate }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [reminderForm, setReminderForm] = useState({ memberId: null, message: '' })

  // Mock contribution data
  const contributions = group?.members?.flatMap(m => 
    m.contributions?.map(c => ({
      ...c,
      memberId: m.userId,
      memberPosition: m.position
    })) || []
  ) || []

  const filteredContributions = filterStatus === 'all' 
    ? contributions 
    : contributions.filter(c => c.status === filterStatus)

  const stats = {
    pending: contributions.filter(c => c.status === 'pending').length,
    paid: contributions.filter(c => c.status === 'paid').length,
    overdue: contributions.filter(c => c.status === 'overdue').length,
    late: contributions.filter(c => c.status === 'late').length
  }

  const handleMarkPaid = (contributionIndex) => {
    console.log('Marking contribution as paid:', contributionIndex)
  }

  const handleMarkOverdue = (contributionIndex) => {
    console.log('Marking contribution as overdue:', contributionIndex)
  }

  const handleSendReminder = () => {
    if (!reminderForm.memberId) {
      alert('Please select a member')
      return
    }
    console.log('Sending reminder:', reminderForm)
    setReminderForm({ memberId: null, message: '' })
  }

  const handleApplyPenalty = (memberId) => {
    if (confirm('Apply penalty to this member?')) {
      console.log('Penalty applied to:', memberId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          title="Paid"
          count={stats.paid}
          icon={Check}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatusCard
          title="Pending"
          count={stats.pending}
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatusCard
          title="Late"
          count={stats.late}
          icon={AlertCircle}
          color="bg-orange-100 text-orange-700"
        />
        <StatusCard
          title="Overdue"
          count={stats.overdue}
          icon={AlertCircle}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* Send Reminder Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Send size={20} />
          Send Payment Reminder
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Member</label>
            <select
              value={reminderForm.memberId || ''}
              onChange={(e) => setReminderForm({ ...reminderForm, memberId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Choose a member with pending payment...</option>
              {group?.members?.filter(m => 
                m.contributions?.some(c => c.status === 'pending' || c.status === 'late')
              ).map(m => (
                <option key={m.userId} value={m.userId}>Member {m.userId} (Position #{m.position})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
            <textarea
              value={reminderForm.message}
              onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
              placeholder="Add a custom message..."
              rows="3"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSendReminder}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            Send Reminder
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex gap-2 overflow-x-auto">
        {['all', 'paid', 'pending', 'late', 'overdue'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filterStatus === status
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Position</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredContributions.map((contrib, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">#{contrib.memberPosition}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">Member {contrib.memberId}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">${contrib.amount}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{contrib.period}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={contrib.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{contrib.paid_at || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {contrib.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkPaid(idx)}
                          className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition"
                          title="Mark as paid"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {contrib.status !== 'overdue' && contrib.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkOverdue(idx)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          title="Mark as overdue"
                        >
                          Mark Overdue
                        </button>
                      )}
                      {(contrib.status === 'late' || contrib.status === 'overdue') && (
                        <button
                          onClick={() => handleApplyPenalty(contrib.memberId)}
                          className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition"
                          title="Apply penalty"
                        >
                          Penalty
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Penalty System */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-orange-600" />
          Penalty Management
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3 text-sm">
          <p className="text-slate-700">
            <span className="font-semibold">Penalty Policy:</span> Members with late payments receive progressive penalties.
          </p>
          <ul className="space-y-1 text-slate-600 ml-4">
            <li>• 1-3 days late: 5% of contribution amount</li>
            <li>• 4-7 days late: 10% of contribution amount</li>
            <li>• 8+ days late: 15% of contribution amount + may be suspended</li>
          </ul>
          <p className="text-slate-700 font-medium mt-3">
            All penalties are recorded and deducted from member's next payout.
          </p>
        </div>
      </div>
    </div>
  )
}

// Status Card Component
function StatusCard({ title, count, icon: Icon, color }) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
        <Icon size={28} className="opacity-50" />
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-yellow-100 text-yellow-800',
    late: 'bg-orange-100 text-orange-800',
    overdue: 'bg-red-100 text-red-800'
  }

  const labels = {
    paid: '✓ Paid',
    pending: 'Pending',
    late: 'Late',
    overdue: 'Overdue'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
