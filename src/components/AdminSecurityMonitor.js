'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, User, Activity, Eye, Lock, Flag } from 'lucide-react'

export default function AdminSecurityMonitor({ group }) {
  const [securityAlerts, setSecurityAlerts] = useState([
    { id: 1, type: 'suspicious-activity', member: 'Member 2', description: 'Multiple failed login attempts', severity: 'high', date: '2024-12-05' },
    { id: 2, type: 'profile-incomplete', member: 'Member 4', description: 'Missing phone verification', severity: 'medium', date: '2024-12-04' },
    { id: 3, type: 'late-pattern', member: 'Member 5', description: 'Consistent late payments detected', severity: 'medium', date: '2024-12-03' }
  ])

  const [memberVerification, setMemberVerification] = useState([
    { id: 1, member: 'Member 1', email: 'verified', phone: 'verified', identity: 'verified', status: 'approved' },
    { id: 2, member: 'Member 2', email: 'verified', phone: 'pending', identity: 'verified', status: 'pending' },
    { id: 3, member: 'Member 3', email: 'verified', phone: 'verified', identity: 'verified', status: 'approved' }
  ])

  const handleDismissAlert = (alertId) => {
    setSecurityAlerts(securityAlerts.filter(a => a.id !== alertId))
  }

  const handleApproveVerification = (memberId) => {
    setMemberVerification(memberVerification.map(m =>
      m.id === memberId ? { ...m, status: 'approved' } : m
    ))
    alert('Member verification approved!')
  }

  const handleRejectVerification = (memberId) => {
    setMemberVerification(memberVerification.map(m =>
      m.id === memberId ? { ...m, status: 'rejected' } : m
    ))
    alert('Member verification rejected!')
  }

  const handleSuspendMember = (memberId) => {
    if (confirm('Suspend this member from the group?')) {
      console.log('Member suspended:', memberId)
      alert('Member suspended!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SecurityCard
          title="Security Alerts"
          count={securityAlerts.length}
          icon={AlertTriangle}
          color="bg-red-100 text-red-700"
        />
        <SecurityCard
          title="Verified Members"
          count={memberVerification.filter(m => m.status === 'approved').length}
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-700"
        />
        <SecurityCard
          title="Pending Verifications"
          count={memberVerification.filter(m => m.status === 'pending').length}
          icon={Lock}
          color="bg-yellow-100 text-yellow-700"
        />
      </div>

      {/* Active Alerts */}
      {securityAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Active Security Alerts ({securityAlerts.length})
            </h3>
            <div className="space-y-3">
              {securityAlerts.map(alert => (
                <div key={alert.id} className="bg-white border-l-4 border-red-500 p-4 rounded flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800">{alert.member}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800'
                        : alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{alert.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.date}</p>
                  </div>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-slate-400 hover:text-slate-600 px-3"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Member Verification Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User size={20} />
          Member Verification & Approval
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Identity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {memberVerification.map(member => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{member.member}</td>
                  <td className="px-4 py-3 text-sm">
                    <VerificationBadge status={member.email} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <VerificationBadge status={member.phone} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <VerificationBadge status={member.identity} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'approved' ? 'bg-emerald-100 text-emerald-800'
                      : member.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {member.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveVerification(member.id)}
                            className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectVerification(member.id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {member.status === 'approved' && (
                        <button
                          onClick={() => handleSuspendMember(member.id)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          Suspend
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

      {/* Fraud Detection Rules */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield size={20} />
          Fraud Detection & Prevention
        </h3>
        <div className="space-y-3">
          <FraudRule
            title="Suspicious Login Activity"
            description="Monitors unusual login patterns and failed attempts"
            isActive={true}
          />
          <FraudRule
            title="Payment Pattern Analysis"
            description="Tracks inconsistent payment behavior and anomalies"
            isActive={true}
          />
          <FraudRule
            title="Member Verification"
            description="Ensures all member details are valid and authentic"
            isActive={true}
          />
          <FraudRule
            title="Duplicate Account Detection"
            description="Identifies and prevents duplicate or fake accounts"
            isActive={true}
          />
          <FraudRule
            title="Large Transaction Alerts"
            description="Flags unusually large contributions or modifications"
            isActive={true}
          />
          <FraudRule
            title="Rate Limiting"
            description="Prevents rapid successive transactions"
            isActive={true}
          />
        </div>
      </div>

      {/* Group Security Status */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <CheckCircle size={20} className="text-emerald-600" />
          Group Security Status
        </h3>
        <div className="space-y-2 text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>All member profiles verified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>Payout rotation secured and transparent</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>Payment tracking automated</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>Fraud monitoring active 24/7</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>Financial records encrypted and backed up</span>
          </div>
        </div>
      </div>

      {/* Compliance Report */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Flag size={20} />
          Compliance Checklist
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            Member data protection compliant
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            Transaction records auditable
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            Dispute resolution procedures in place
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            Regular security audits scheduled
          </li>
        </ul>
      </div>
    </div>
  )
}

// Security Card Component
function SecurityCard({ title, count, icon: Icon, color }) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{count}</p>
        </div>
        <Icon size={32} className="opacity-30" />
      </div>
    </div>
  )
}

// Verification Badge Component
function VerificationBadge({ status }) {
  const styles = {
    verified: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-yellow-100 text-yellow-800',
    unverified: 'bg-red-100 text-red-800'
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Fraud Rule Component
function FraudRule({ title, description, isActive }) {
  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
      }`}>
        {isActive ? '✓ Active' : 'Inactive'}
      </div>
    </div>
  )
}
