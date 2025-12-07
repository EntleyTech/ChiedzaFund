'use client'

import { useState } from 'react'
import { DollarSign, Upload, CheckCircle, Clock, AlertCircle, Download, Eye } from 'lucide-react'

export default function UserContributionTracking({ user, group }) {
  const [contributions, setContributions] = useState([
    { id: 1, period: '2024-12-01', amount: 5000, status: 'pending', dueDate: '2024-12-10', proof: null },
    { id: 2, period: '2024-11-01', amount: 5000, status: 'paid', paidDate: '2024-11-05', proof: 'receipt_nov.pdf' },
    { id: 3, period: '2024-10-01', amount: 5000, status: 'paid', paidDate: '2024-10-03', proof: 'receipt_oct.pdf' }
  ])

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedContribution, setSelectedContribution] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'ecocash',
    amount: 0,
    reference: '',
    proofFile: null
  })

  const pendingCount = contributions.filter(c => c.status === 'pending').length
  const paidCount = contributions.filter(c => c.status === 'paid').length
  const totalContributed = contributions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)

  const handlePayContribution = (contribution) => {
    setSelectedContribution(contribution)
    setPaymentForm({ ...paymentForm, amount: contribution.amount })
    setShowPaymentModal(true)
  }

  const handleSubmitPayment = () => {
    if (!paymentForm.reference || !paymentForm.proofFile) {
      alert('Please provide transaction reference and proof')
      return
    }

    const updatedContributions = contributions.map(c =>
      c.id === selectedContribution.id
        ? { ...c, status: 'paid', paidDate: new Date().toISOString().split('T')[0], proof: paymentForm.proofFile }
        : c
    )
    setContributions(updatedContributions)
    setShowPaymentModal(false)
    setPaymentForm({ paymentMethod: 'ecocash', amount: 0, reference: '', proofFile: null })
    alert('Payment submitted! Admin will verify shortly.')
  }

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()
    const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  return (
    <div className="space-y-6">
      {/* Contribution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContributionCard
          title="Total Contributed"
          value={`$${totalContributed.toLocaleString()}`}
          description={`${paidCount} payments completed`}
          color="emerald"
        />
        <ContributionCard
          title="Pending Payments"
          value={pendingCount}
          description={`Total: $${contributions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}`}
          color="yellow"
        />
        <ContributionCard
          title="On-Time Rate"
          value="100%"
          description="Keep it above 80%"
          color="purple"
        />
      </div>

      {/* Payment Methods Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <DollarSign size={18} />
          Accepted Payment Methods
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-blue-800">
          <div>💳 EcoCash</div>
          <div>🏦 Bank Transfer</div>
          <div>📱 Mobile Money</div>
          <div>💰 Cash (with receipt)</div>
        </div>
      </div>

      {/* Contributions List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Contribution History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Proof</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {contributions.map(contrib => (
                <tr key={contrib.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{contrib.period}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">${contrib.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{contrib.dueDate || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <ContributionStatus status={contrib.status} daysUntil={contrib.status === 'pending' ? getDaysUntilDue(contrib.dueDate) : null} />
                  </td>
                  <td className="px-4 py-3">
                    {contrib.proof ? (
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Download size={14} />
                        <span className="text-xs">Download</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">No proof</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {contrib.status === 'pending' ? (
                      <button
                        onClick={() => handlePayContribution(contrib)}
                        className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <CheckCircle size={18} />
          Payment Tips
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li>✓ Always save your transaction receipt as proof</li>
          <li>✓ Pay a few days before the deadline to avoid penalties</li>
          <li>✓ Double-check the receiving account details</li>
          <li>✓ Keep your payment method details updated</li>
          <li>✓ Report payment issues immediately to admin</li>
        </ul>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Make a Payment</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-slate-600">Amount Due</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">${paymentForm.amount}</p>
                <p className="text-xs text-slate-500 mt-1">Period: {selectedContribution?.period}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="ecocash">EcoCash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Money</option>
                  <option value="cash">Cash with Receipt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Reference</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="E.g., Txn#12345 or check number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Receipt/Proof *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-emerald-500 transition cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setPaymentForm({ ...paymentForm, proofFile: e.target.files?.[0]?.name })}
                    className="hidden"
                    id="proof-upload"
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      {paymentForm.proofFile ? paymentForm.proofFile : 'Click to upload proof'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG (max 5MB)</p>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
                <strong>Note:</strong> Your payment will be verified by admin within 24 hours.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitPayment}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Submit Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
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

// Contribution Card Component
function ContributionCard({ title, value, description, color }) {
  const colorStyles = {
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-50',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-50',
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

// Contribution Status Component
function ContributionStatus({ status, daysUntil }) {
  if (status === 'pending') {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
        daysUntil <= 3
          ? 'bg-red-100 text-red-800'
          : daysUntil <= 7
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-100 text-blue-800'
      }`}>
        <Clock size={12} />
        {daysUntil} days left
      </span>
    )
  }

  if (status === 'paid') {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit bg-emerald-100 text-emerald-800">
        <CheckCircle size={12} />
        Paid
      </span>
    )
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit bg-slate-100 text-slate-800">
      <AlertCircle size={12} />
      Overdue
    </span>
  )
}
