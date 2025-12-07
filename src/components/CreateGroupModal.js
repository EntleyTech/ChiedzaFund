'use client'

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

export default function CreateGroupModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'weekly'
  })
  const [createdGroupCode, setCreatedGroupCode] = useState(null)
  const [copied, setCopied] = useState(false)

  // Generate unique group code
  const generateGroupCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 5).toUpperCase()
    return `MK-${timestamp}-${random}`
  }

  const handleCreate = () => {
    if (formData.name && formData.amount) {
      const groupCode = generateGroupCode()
      onCreate({
        ...formData,
        amount: parseInt(formData.amount),
        code: groupCode
      })
      setCreatedGroupCode(groupCode)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdGroupCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Success screen with group code
  if (createdGroupCode) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Group Created!</h3>
            <p className="text-slate-600">Your ChiedzaFund group is ready to go</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">Group Name</p>
              <p className="text-lg font-bold text-slate-800">{formData.name}</p>
            </div>

            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded text-sm">
              <p className="font-semibold text-blue-900 mb-1">👤 Your Role</p>
              <p className="text-blue-800">You are now the <span className="font-bold">Group Admin & Member</span></p>
              <p className="text-xs text-blue-700 mt-1">Full control over group, contributions, payouts, and security</p>
            </div>

            <p className="text-sm text-slate-600 mb-2">Share this code with members:</p>
            <div className="bg-white border-2 border-emerald-600 rounded-lg p-3 flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-lg text-emerald-600">{createdGroupCode}</span>
              <button
                onClick={handleCopyCode}
                className="ml-2 p-2 hover:bg-emerald-100 rounded-lg transition"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Copy className="w-5 h-5 text-emerald-600" />
                )}
              </button>
            </div>
            <p className="text-xs text-emerald-700">
              {copied ? '✓ Copied to clipboard!' : 'Click the icon to copy the code'}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-sm text-purple-800">
            <p className="font-semibold mb-2">📋 Admin Responsibilities:</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Share code with members to grow the group</li>
              <li>✓ Approve/reject member join requests</li>
              <li>✓ Monitor contributions and payments</li>
              <li>✓ Manage payout schedule & rotations</li>
              <li>✓ Ensure compliance & handle disputes</li>
              <li>✓ Generate financial reports</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setCreatedGroupCode(null)
                onClose()
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition"
            >
              Go to Admin Panel
            </button>
            <button
              onClick={() => {
                handleCopyCode()
                setTimeout(() => {
                  setCreatedGroupCode(null)
                  onClose()
                }, 1500)
              }}
              className="w-full border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50"
            >
              Copy & Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Create New Group</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Downtown Savings Circle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contribution Amount (USD)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Contribution Frequency</label>
            <select
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">✓ Group code will be auto-generated</p>
            <p className="text-xs">You'll be able to share it with members right after creation</p>
          </div>

          <button
            onClick={handleCreate}
            disabled={!formData.name || !formData.amount}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition disabled:from-slate-300 disabled:to-slate-400"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
}
