'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Bank, Settings, Edit, Save, Eye, EyeOff, Award, ActivitySquare } from 'lucide-react'

export default function UserProfile({ user }) {
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: 'Zimbabwe',
    paymentMethod: 'ecocash',
    accountDetails: {
      ecocash: '+263...',
      bank: 'Account pending',
      mobile: 'Account pending'
    }
  })

  const [personalRecords] = useState({
    joinDate: '2024-11-01',
    totalGroups: 2,
    totalContributed: 30000,
    totalReceived: 15000,
    onTimePaymentRate: 100,
    penalties: 0,
    suspensions: 0,
    trustScore: 95
  })

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData)
    setEditMode(false)
    alert('Profile updated successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-emerald-100">Member since {personalRecords.joinDate}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Active Member</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full flex items-center gap-1">
                  <Award size={14} />
                  Trust: {personalRecords.trustScore}%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium"
          >
            {editMode ? (
              <>
                <Save size={18} />
                Save
              </>
            ) : (
              <>
                <Edit size={18} />
                Edit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Personal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <RecordCard
          icon={<ActivitySquare size={20} />}
          label="Active Groups"
          value={personalRecords.totalGroups}
          color="blue"
        />
        <RecordCard
          icon={<Award size={20} />}
          label="On-Time Rate"
          value={`${personalRecords.onTimePaymentRate}%`}
          color="emerald"
        />
        <RecordCard
          icon={<User size={20} />}
          label="Trust Score"
          value={`${personalRecords.trustScore}%`}
          color="purple"
        />
        <RecordCard
          icon={<MapPin size={20} />}
          label="Member Status"
          value="Good Standing"
          color="yellow"
        />
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User size={20} />
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!editMode}
              className={`w-full px-3 py-2 border rounded-lg ${
                editMode
                  ? 'border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                  : 'border-slate-200 bg-slate-50 cursor-default'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Mail size={14} />
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!editMode}
                className={`w-full px-3 py-2 border rounded-lg ${
                  editMode
                    ? 'border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    : 'border-slate-200 bg-slate-50 cursor-default'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Phone size={14} />
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!editMode}
                className={`w-full px-3 py-2 border rounded-lg ${
                  editMode
                    ? 'border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    : 'border-slate-200 bg-slate-50 cursor-default'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <MapPin size={14} />
              Location
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              disabled={!editMode}
              className={`w-full px-3 py-2 border rounded-lg ${
                editMode
                  ? 'border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                  : 'border-slate-200 bg-slate-50 cursor-default'
              }`}
            />
          </div>

          {editMode && (
            <button
              onClick={handleSaveProfile}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium mt-4"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bank size={20} />
          Payment Methods
        </h3>

        <div className="space-y-3">
          <PaymentMethodItem
            title="EcoCash"
            account={profileData.accountDetails.ecocash}
            isDefault={profileData.paymentMethod === 'ecocash'}
            icon="💳"
          />
          <PaymentMethodItem
            title="Bank Transfer"
            account={profileData.accountDetails.bank}
            isDefault={profileData.paymentMethod === 'bank'}
            icon="🏦"
          />
          <PaymentMethodItem
            title="Mobile Money"
            account={profileData.accountDetails.mobile}
            isDefault={profileData.paymentMethod === 'mobile'}
            icon="📱"
          />
        </div>

        {editMode && (
          <button className="w-full mt-4 border-2 border-dashed border-slate-300 rounded-lg p-3 hover:border-emerald-500 transition text-slate-700 font-medium">
            + Add Payment Method
          </button>
        )}
      </div>

      {/* Contribution & Payout Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-4">Contribution Records</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Total Contributions:</span>
              <span className="font-bold">${personalRecords.totalContributed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>On-Time Payments:</span>
              <span className="font-bold">{personalRecords.onTimePaymentRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Penalties Paid:</span>
              <span className="font-bold">${personalRecords.penalties}</span>
            </div>
            <div className="flex justify-between">
              <span>Groups Joined:</span>
              <span className="font-bold">{personalRecords.totalGroups}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-bold text-emerald-900 mb-4">Payout Records</h3>
          <div className="space-y-3 text-sm text-emerald-800">
            <div className="flex justify-between">
              <span>Total Received:</span>
              <span className="font-bold">${personalRecords.totalReceived.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Confirmed Payouts:</span>
              <span className="font-bold">1</span>
            </div>
            <div className="flex justify-between">
              <span>Suspensions:</span>
              <span className="font-bold text-emerald-700">{personalRecords.suspensions}</span>
            </div>
            <div className="flex justify-between">
              <span>Good Standing:</span>
              <span className="font-bold">✓ Yes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Score Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Award size={20} />
          Trust Score Breakdown
        </h3>

        <div className="space-y-4">
          <TrustScoreBar
            label="Payment Timeliness"
            percentage={100}
            color="emerald"
          />
          <TrustScoreBar
            label="Contribution Completion"
            percentage={95}
            color="emerald"
          />
          <TrustScoreBar
            label="Profile Verification"
            percentage={100}
            color="emerald"
          />
          <TrustScoreBar
            label="Communication"
            percentage={85}
            color="blue"
          />
          <TrustScoreBar
            label="Compliance"
            percentage={90}
            color="emerald"
          />
        </div>

        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
          <p className="font-semibold mb-1">Overall Trust Score: 95%</p>
          <p>Excellent! You're maintaining a high level of trust in the ChiedzaFund system. Keep up the good work!</p>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Settings size={20} />
          Account Settings
        </h3>

        <div className="space-y-3">
          <SettingItem
            label="Email Notifications"
            description="Receive updates about contributions and payouts"
            enabled={true}
          />
          <SettingItem
            label="SMS Alerts"
            description="Get text reminders for payment due dates"
            enabled={true}
          />
          <SettingItem
            label="Two-Factor Authentication"
            description="Extra security for your account"
            enabled={false}
          />
        </div>

        <button className="w-full mt-4 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium">
          Deactivate Account
        </button>
      </div>
    </div>
  )
}

// Record Card Component
function RecordCard({ icon, label, value, color }) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600 text-blue-50',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-50',
    purple: 'from-purple-500 to-purple-600 text-purple-50',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-50'
  }

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} rounded-lg shadow-sm p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-30">{icon}</div>
      </div>
    </div>
  )
}

// Payment Method Item Component
function PaymentMethodItem({ title, account, isDefault, icon }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-medium text-slate-800">{title}</p>
            <p className="text-sm text-slate-600">{account}</p>
          </div>
        </div>
        {isDefault && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
            Default
          </span>
        )}
      </div>
    </div>
  )
}

// Trust Score Bar Component
function TrustScoreBar({ label, percentage, color }) {
  const colorStyles = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-800">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colorStyles[color]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Setting Item Component
function SettingItem({ label, description, enabled }) {
  const [isEnabled, setIsEnabled] = useState(enabled)

  return (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
      <div>
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`w-10 h-6 rounded-full transition ${isEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transition transform ${isEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
