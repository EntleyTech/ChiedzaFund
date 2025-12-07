'use client'

import { useState } from 'react'
import { TrendingUp, Check, Clock, AlertCircle, Download, Send } from 'lucide-react'

export default function AdminPayoutManagement({ group, onUpdate }) {
  const [payoutHistory, setPayoutHistory] = useState([
    { id: 1, position: 1, date: '2024-11-15', amount: 15000, status: 'completed', memberId: 1 },
    { id: 2, position: 2, date: '2024-12-22', amount: 15000, status: 'pending', memberId: 2 }
  ])
  const [approvalForm, setApprovalForm] = useState({ payoutId: null, notes: '' })

  const totalPotAmount = (group?.amount || 0) * (group?.members?.length || 1)
  
  const upcomingPayouts = payoutHistory.filter(p => p.status === 'pending')
  const completedPayouts = payoutHistory.filter(p => p.status === 'completed')

  const handleApprovePayout = (payoutId) => {
    setPayoutHistory(payoutHistory.map(p => 
      p.id === payoutId ? { ...p, status: 'completed' } : p
    ))
    console.log('Payout approved:', payoutId)
  }

  const handleRejectPayout = (payoutId) => {
    if (confirm('Reject this payout? It will need to be rescheduled.')) {
      setPayoutHistory(payoutHistory.filter(p => p.id !== payoutId))
    }
  }

  const handleSchedulePayout = () => {
    console.log('Scheduling new payout')
  }

  return (
    <div className="space-y-6">
      {/* Payout Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PayoutCard
          title="Total Pot"
          amount={`$${totalPotAmount.toLocaleString()}`}
          description={`${group?.members?.length || 0} members × $${group?.amount || 0}`}
          icon={TrendingUp}
          color="bg-blue-100 text-blue-700"
        />
        <PayoutCard
          title="Upcoming Payouts"
          amount={upcomingPayouts.length}
          description="Awaiting approval"
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <PayoutCard
          title="Completed Payouts"
          amount={completedPayouts.length}
          description="This cycle"
          icon={Check}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* Current Payout Information */}
      {group?.nextPayout && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4">Next Scheduled Payout</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-emerald-100 text-sm">Recipient Position</p>
                  <p className="text-3xl font-bold mt-1">#{group.nextPayout.position}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Scheduled Date</p>
                  <p className="text-3xl font-bold mt-1">{group.nextPayout.date}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Amount</p>
                  <p className="text-3xl font-bold mt-1">${totalPotAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Status</p>
                  <p className="text-xl font-bold mt-1 bg-white bg-opacity-20 px-3 py-1 rounded w-fit">Pending</p>
                </div>
              </div>
            </div>
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
              Process Payout
            </button>
          </div>
        </div>
      )}

      {/* Payout Rotation Schedule */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Payout Rotation Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Scheduled Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {group?.members?.map((member, idx) => {
                const payout = payoutHistory.find(p => p.position === member.position)
                return (
                  <tr key={member.userId} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600">#{member.position}</td>
                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">Member {member.userId}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{payout?.date || 'TBD'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">${totalPotAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payout?.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : payout?.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {payout?.status || 'Scheduled'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {payout?.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovePayout(payout.id)}
                              className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleRejectPayout(payout.id)}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Payout History</h3>
        <div className="space-y-3">
          {payoutHistory.map(payout => (
            <div key={payout.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                    #{payout.position}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Member {payout.memberId}</p>
                    <p className="text-sm text-slate-600">{payout.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">${payout.amount.toLocaleString()}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                    payout.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payout.status === 'completed' ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
                {payout.status === 'completed' && (
                  <button className="text-emerald-600 hover:text-emerald-700">
                    <Download size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule New Payout */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Send size={20} />
          Schedule New Payout
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Recipient (Position)</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                <option value="">Choose position...</option>
                {group?.members?.map(m => (
                  <option key={m.userId} value={m.position}>Position #{m.position} - Member {m.userId}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scheduled Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
            <textarea
              placeholder="Add any notes about this payout..."
              rows="3"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSchedulePayout}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            Schedule Payout
          </button>
        </div>
      </div>
    </div>
  )
}

// Payout Card Component
function PayoutCard({ title, amount, description, icon: Icon, color }) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{amount}</p>
          <p className="text-xs opacity-75 mt-1">{description}</p>
        </div>
        <Icon size={32} className="opacity-30" />
      </div>
    </div>
  )
}
