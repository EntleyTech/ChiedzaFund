'use client'

import { useState } from 'react'
import { TrendingUp, Calendar, CheckCircle, Clock, AlertCircle, Bell, Download } from 'lucide-react'

export default function UserPayoutSchedule({ user, group }) {
  const [notifyMe, setNotifyMe] = useState(false)

  // Mock payout data
  const payoutSchedule = [
    { position: 1, memberId: 1, memberName: 'Member 1', date: '2024-11-15', status: 'completed', amount: 15000 },
    { position: 2, memberId: 2, memberName: 'Member 2', date: '2024-12-22', status: 'scheduled', amount: 15000 },
    { position: 3, memberId: 3, memberName: 'Your Turn', date: '2025-01-15', status: 'upcoming', amount: 15000 },
    { position: 4, memberId: 4, memberName: 'Member 4', date: '2025-02-12', status: 'scheduled', amount: 15000 }
  ]

  const totalAmount = group?.amount ? group.amount * (group?.members?.length || 1) : 0
  const userPayout = payoutSchedule.find(p => p.memberId === user?.id)
  const userPosition = payoutSchedule.findIndex(p => p.memberId === user?.id) + 1

  const getDaysUntilPayout = (date) => {
    const payout = new Date(date)
    const today = new Date()
    const days = Math.ceil((payout - today) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  return (
    <div className="space-y-6">
      {/* User's Payout Info */}
      {userPayout && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Your Payout Status</h3>
              <h2 className="text-3xl font-bold mt-2">${totalAmount.toLocaleString()}</h2>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
            <div>
              <p className="text-emerald-100 text-sm">Position in Queue</p>
              <p className="text-2xl font-bold mt-1">#{userPosition}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Scheduled Date</p>
              <p className="text-2xl font-bold mt-1">{userPayout.date}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Days Remaining</p>
              <p className="text-2xl font-bold mt-1">{getDaysUntilPayout(userPayout.date)}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <label className="flex items-center gap-2 cursor-pointer bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition">
              <input
                type="checkbox"
                checked={notifyMe}
                onChange={(e) => setNotifyMe(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Notify Me</span>
            </label>
          </div>
        </div>
      )}

      {/* Payout Schedule Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Full Payout Schedule
        </h3>

        <div className="space-y-0">
          {payoutSchedule.map((payout, idx) => (
            <div key={idx} className="relative">
              <div className={`flex items-center gap-4 p-4 rounded-lg transition ${
                payout.memberId === user?.id
                  ? 'bg-emerald-50 border-2 border-emerald-500'
                  : 'border-b border-slate-200 hover:bg-slate-50'
              }`}>
                {/* Position Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  payout.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : payout.memberId === user?.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  #{payout.position}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold ${payout.memberId === user?.id ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {payout.memberName}
                    </p>
                    {payout.memberId === user?.id && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded">
                        YOUR TURN
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    Scheduled: {payout.date}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-slate-800">${payout.amount.toLocaleString()}</p>
                  <PayoutStatusBadge status={payout.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <CheckCircle size={18} />
          Requirements to Receive Payout
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>All previous contributions must be paid in full</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>No outstanding penalties or fines</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Your profile must be verified and current</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Your payout account must be confirmed</span>
          </li>
        </ul>
      </div>

      {/* How Payouts Work */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">How Payouts Work</h3>
        <div className="space-y-4">
          <PayoutStep
            number="1"
            title="Group Collects Funds"
            description="All members contribute their amount during the collection period"
          />
          <PayoutStep
            number="2"
            title="Your Turn Arrives"
            description="When it's your position in the rotation, you receive the full group pot"
          />
          <PayoutStep
            number="3"
            title="Admin Verification"
            description="Admin verifies all requirements are met before releasing funds"
          />
          <PayoutStep
            number="4"
            title="Receive Payment"
            description="Funds are transferred to your verified account"
          />
          <PayoutStep
            number="5"
            title="Confirm Receipt"
            description="You confirm receipt in the system for transparency"
          />
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Payout FAQ</h3>
        <div className="space-y-4">
          <FAQItem
            question="What if I can't pay my contribution?"
            answer="Contact your admin immediately. Late payments may result in penalties and could delay your payout. The group may work with you to find a solution."
          />
          <FAQItem
            question="Can I change my payout date?"
            answer="No. The rotation order is fixed to ensure fairness. However, you can temporarily swap with another member if the admin approves."
          />
          <FAQItem
            question="How will I receive my payout?"
            answer="You specify your preferred payment method (EcoCash, Bank Transfer, etc.) in your profile. Admin transfers funds according to your preference."
          />
          <FAQItem
            question="What happens if someone doesn't pay?"
            answer="Admin will pursue collection, apply penalties, and may suspend that member. This shouldn't affect your payout as the group maintains a reserve."
          />
        </div>
      </div>

      {/* Payout Confirmation Section */}
      {userPayout?.status === 'completed' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600" />
            Payout Received
          </h3>
          <p className="text-sm text-emerald-800 mb-4">
            You received your payout on {userPayout.date}. Please confirm receipt.
          </p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium">
            Confirm Receipt
          </button>
        </div>
      )}
    </div>
  )
}

// Payout Status Badge
function PayoutStatusBadge({ status }) {
  const styles = {
    completed: 'bg-emerald-100 text-emerald-800',
    scheduled: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-purple-100 text-purple-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }

  const labels = {
    completed: '✓ Completed',
    scheduled: 'Scheduled',
    upcoming: '📍 Next',
    pending: 'Pending'
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

// Payout Step Component
function PayoutStep({ number, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  )
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 text-left font-medium text-slate-800 hover:bg-slate-50 transition flex items-center justify-between"
      >
        {question}
        <span className={`transform transition ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-700">
          {answer}
        </div>
      )}
    </div>
  )
}
