'use client'

import { useState } from 'react'
import { Users, Plus, Trash2, Check, X, AlertCircle, Mail, Phone, User } from 'lucide-react'

export default function AdminMemberManagement({ group, onUpdate, onApproveRequest, onRejectRequest, onUpdateContribution }) {
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: group?.members?.length + 1 || 1
  })
  const [selectedMember, setSelectedMember] = useState(null)
  const [disputeForm, setDisputeForm] = useState({ memberId: null, issue: '' })

  const handleAddMember = () => {
    if (!newMemberForm.name || !newMemberForm.email) {
      alert('Please fill in required fields')
      return
    }

    // Add member logic
    console.log('Adding member:', newMemberForm)
    setNewMemberForm({ name: '', email: '', phone: '', position: group?.members?.length + 1 || 1 })
    setShowAddMember(false)
  }

  const handleApproveMember = (requestId) => {
    if (typeof onApproveRequest === 'function') {
      onApproveRequest(group.id, requestId)
    }
  }

  const handleRejectMember = (requestId) => {
    if (typeof onRejectRequest === 'function') {
      onRejectRequest(group.id, requestId)
    }
  }

  const handleRemoveMember = (memberId) => {
    if (confirm('Are you sure you want to remove this member?')) {
      console.log('Removing member:', memberId)
    }
  }

  const [showContributionEditor, setShowContributionEditor] = useState(false)
  const [editingContribution, setEditingContribution] = useState({ memberId: null, index: 0, amount: 0 })

  const openContributionEditor = (memberId, index, currentAmount) => {
    setEditingContribution({ memberId, index, amount: currentAmount ?? 0 })
    setShowContributionEditor(true)
  }

  const saveContributionEdit = () => {
    if (typeof onUpdateContribution === 'function') {
      onUpdateContribution(group.id, editingContribution.memberId, editingContribution.index, parseFloat(editingContribution.amount))
    }
    setShowContributionEditor(false)
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      {(group?.pendingRequests?.length || 0) > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-600" />
            Join Requests ({group?.pendingRequests?.length || 0})
          </h3>
          <div className="space-y-3">
            {(group?.pendingRequests || []).map(request => (
              <div key={request.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{request.name}</p>
                  <div className="flex gap-4 text-sm text-slate-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {request.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {request.phone}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveMember(request.id)}
                    className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectMember(request.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Member Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Add New Member</h3>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>

        {showAddMember && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={newMemberForm.name}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                placeholder="Enter member name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newMemberForm.email}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                  placeholder="member@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                  placeholder="+263..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payout Position</label>
              <input
                type="number"
                value={newMemberForm.position}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, position: parseInt(e.target.value) })}
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddMember}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowAddMember(false)}
                className="flex-1 bg-slate-300 text-slate-800 py-2 rounded-lg hover:bg-slate-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Current Members */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Current Members ({group?.members?.length || 0})</h3>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4 text-sm text-purple-800">
          <p className="font-semibold mb-1">👤 Admin Member Status</p>
          <p>You (the group admin) are also a regular member in the rotation. You must contribute, can receive payouts, and follow all group rules just like other members.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Position</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {group?.members?.map((member, idx) => (
                <tr key={member.userId} className={`hover:bg-slate-50 transition ${member.role === 'admin+member' ? 'bg-purple-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">#{member.position}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                    <div className="flex items-center gap-2">
                      {member.name}
                      {member.role === 'admin+member' && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs font-bold">ADMIN</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{member.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{member.phone || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {member.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openContributionEditor(member.userId, 0, member.contributions?.[0]?.amount ?? group.amount)}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                      >
                        Edit Payment
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contribution Editor Modal */}
      {showContributionEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Edit Contribution Amount</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input
                type="number"
                value={editingContribution.amount}
                onChange={(e) => setEditingContribution({ ...editingContribution, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={saveContributionEdit} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg">Save</button>
              <button onClick={() => setShowContributionEditor(false)} className="flex-1 bg-slate-200 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Handling */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-red-600" />
          Report Issue or Dispute
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Member</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">Choose a member...</option>
              {group?.members?.map(m => (
                <option key={m.userId} value={m.userId}>Member {m.userId}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Description</label>
            <textarea
              value={disputeForm.issue}
              onChange={(e) => setDisputeForm({ ...disputeForm, issue: e.target.value })}
              placeholder="Describe the issue, concern, or misconduct..."
              rows="4"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium">
            File Report
          </button>
        </div>
      </div>
    </div>
  )
}
