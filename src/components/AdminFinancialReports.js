'use client'

import { useState } from 'react'
import { BarChart3, Download, TrendingUp, DollarSign, AlertCircle, Calendar } from 'lucide-react'

export default function AdminFinancialReports({ group }) {
  const [reportType, setReportType] = useState('summary')
  const [dateRange, setDateRange] = useState({ start: '2024-12-01', end: '2024-12-31' })

  // Mock financial data
  const financialData = {
    totalCollected: 30000,
    totalPaidOut: 15000,
    pendingContributions: 5000,
    penalties: 1500,
    reserves: 8500,
    transactionCount: 12
  }

  const monthlyTrend = [
    { month: 'October', collected: 25000, paidOut: 10000 },
    { month: 'November', collected: 28000, paidOut: 12000 },
    { month: 'December', collected: 30000, paidOut: 15000 }
  ]

  const transactions = [
    { id: 1, date: '2024-12-01', type: 'contribution', member: 'Member 1', amount: 5000, status: 'completed' },
    { id: 2, date: '2024-12-02', type: 'contribution', member: 'Member 2', amount: 5000, status: 'completed' },
    { id: 3, date: '2024-12-03', type: 'payout', member: 'Member 3', amount: 15000, status: 'completed' },
    { id: 4, date: '2024-12-04', type: 'penalty', member: 'Member 2', amount: 250, status: 'applied' }
  ]

  const handleExportReport = () => {
    console.log('Exporting report...')
    alert('Report exported successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {['summary', 'detailed', 'audit', 'member'].map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`p-4 rounded-lg font-medium transition border-2 ${
                reportType === type
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Report
            </button>
          ))}
        </div>
      </div>

      {/* Date Range & Export */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinancialCard
          title="Total Collected"
          amount={`$${financialData.totalCollected.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-emerald-100 text-emerald-700"
        />
        <FinancialCard
          title="Total Paid Out"
          amount={`$${financialData.totalPaidOut.toLocaleString()}`}
          icon={DollarSign}
          color="bg-blue-100 text-blue-700"
        />
        <FinancialCard
          title="Group Reserves"
          amount={`$${financialData.reserves.toLocaleString()}`}
          icon={AlertCircle}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricBox label="Pending Contributions" value={`$${financialData.pendingContributions}`} />
        <MetricBox label="Penalties Applied" value={`$${financialData.penalties}`} />
        <MetricBox label="Total Transactions" value={financialData.transactionCount} />
        <MetricBox label="Members" value={group?.members?.length} />
      </div>

      {/* Monthly Trend Chart (Text-based) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 size={20} />
          Monthly Trend
        </h3>
        <div className="space-y-4">
          {monthlyTrend.map((month, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-800">{month.month}</span>
                <span className="text-sm text-slate-600">
                  Net: ${(month.collected - month.paidOut).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2 h-8">
                <div
                  className="bg-emerald-600 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(month.collected / 30000) * 100}%` }}
                >
                  {month.collected > 10000 ? `$${month.collected / 1000}k` : ''}
                </div>
              </div>
              <div className="text-xs text-slate-600 flex justify-between">
                <span>Collected: ${month.collected.toLocaleString()}</span>
                <span>Paid Out: ${month.paidOut.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm text-slate-800">{tx.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'contribution' ? 'bg-blue-100 text-blue-800'
                      : tx.type === 'payout' ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-orange-100 text-orange-800'
                    }`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">{tx.member}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">${tx.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary Report */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-6">Financial Summary ({dateRange.start} to {dateRange.end})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 border-r border-slate-700 pr-6">
            <FinancialLine label="Total Contributions" value={`$${financialData.totalCollected.toLocaleString()}`} />
            <FinancialLine label="Pending Contributions" value={`$${financialData.pendingContributions.toLocaleString()}`} />
            <FinancialLine label="Penalties & Fines" value={`$${financialData.penalties.toLocaleString()}`} />
          </div>
          <div className="space-y-3">
            <FinancialLine label="Total Payouts" value={`$${financialData.totalPaidOut.toLocaleString()}`} />
            <FinancialLine label="Group Reserves" value={`$${financialData.reserves.toLocaleString()}`} highlight />
            <FinancialLine label="Members" value={group?.members?.length} />
          </div>
        </div>
      </div>

      {/* Audit Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">Audit & Compliance</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ All transactions are verified and recorded</li>
          <li>✓ Payout rotation is transparent and automated</li>
          <li>✓ Penalties are applied consistently per policy</li>
          <li>✓ Member contributions are tracked in real-time</li>
          <li>✓ Reserved funds protect group integrity</li>
        </ul>
      </div>
    </div>
  )
}

// Financial Card Component
function FinancialCard({ title, amount, icon: Icon, color }) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-2">{amount}</p>
        </div>
        <Icon size={32} className="opacity-30" />
      </div>
    </div>
  )
}

// Metric Box Component
function MetricBox({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  )
}

// Financial Line Component
function FinancialLine({ label, value, highlight }) {
  return (
    <div className={`flex justify-between items-center ${highlight ? 'bg-slate-700 px-3 py-2 rounded' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-bold' : ''}`}>{label}</span>
      <span className={`font-bold ${highlight ? 'text-emerald-400' : 'text-slate-300'}`}>{value}</span>
    </div>
  )
}
