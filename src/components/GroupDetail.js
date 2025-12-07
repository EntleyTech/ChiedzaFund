'use client'

import { DollarSign, Users, Calendar, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'

export default function GroupDetail({ group, currentUser, users, onBack, onMarkPaid }) {
  const isAdmin = group.adminId === currentUser.id
  const [copied, setCopied] = React.useState('')

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(group?.amount || 0)

  const openPaymentModal = (defaultAmount) => {
    setPaymentAmount(defaultAmount ?? group?.amount ?? 0)
    setShowPaymentModal(true)
  }

  const confirmPayment = () => {
    if (typeof onMarkPaid === 'function') {
      onMarkPaid(group.id, paymentModalUserId, parseFloat(paymentAmount))
    }
    setShowPaymentModal(false)
  }
  const [paymentModalUserId, setPaymentModalUserId] = useState(null)

  const paymentMethods = group?.paymentMethods || {
    ecocash: {
      name: 'Ecocash (Merchant)',
      details: group?.adminPhone || '+2637xxxxxxxx',
      note: 'Send to the group Ecocash number (include your name and group code)'
    },
    paynow: {
      name: 'Paynow',
      details: group?.adminEmail || 'payments@group.example',
      note: 'Use Paynow with the group reference code'
    }
  }

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    } catch (e) {
      alert('Unable to copy to clipboard')
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{group.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">Contribution Amount</p>
            <p className="text-xl font-bold text-slate-800">${group.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Frequency</p>
            <p className="text-xl font-bold text-slate-800 capitalize">{group.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Members</p>
            <p className="text-xl font-bold text-slate-800">{group.members.length}</p>
          </div>
        </div>
      </div>

      {/* Members & Contributions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Members & Contributions</h3>
        <div className="space-y-3">
          {group.members.map(member => {
            const user = users.find(u => u.id === member.userId)
            const lastContribution = member.contributions[0]
            
            return (
              <div key={member.userId} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-600">Position #{member.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                      {lastContribution ? (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lastContribution.status === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : lastContribution.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {lastContribution.status}
                      </span>
                      {isAdmin && lastContribution.status === 'pending' && (
                        <button
                          onClick={() => { setPaymentModalUserId(member.userId); openPaymentModal(lastContribution.amount ?? group.amount) }}
                          className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition"
                        >
                          Mark Paid
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-slate-500">No contributions yet</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Confirm Payment</h3>
            <p className="text-sm text-slate-600 mb-4">Enter the amount received from the member.</p>
            <div className="mb-4">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { if (typeof onMarkPaid === 'function') { onMarkPaid(group.id, paymentModalUserId, parseFloat(paymentAmount)) } setShowPaymentModal(false) }} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg">Confirm</button>
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-slate-200 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">{paymentMethods.ecocash.name}</p>
              <p className="text-sm text-slate-600">{paymentMethods.ecocash.note}</p>
              <p className="mt-2 font-mono font-bold text-slate-800">{paymentMethods.ecocash.details}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => copy(paymentMethods.ecocash.details, 'ecocash')}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
              >
                {copied === 'ecocash' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">Copy</span>
              </button>
            </div>
          </div>

          <div className="p-4 border rounded-lg flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">{paymentMethods.paynow.name}</p>
              <p className="text-sm text-slate-600">{paymentMethods.paynow.note}</p>
              <p className="mt-2 font-mono font-bold text-slate-800">{paymentMethods.paynow.details}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => copy(paymentMethods.paynow.details, 'paynow')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                {copied === 'paynow' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
