'use client'

import { useState } from 'react'
import { BookOpen, CheckCircle, AlertCircle, Users, DollarSign, Calendar, Shield, TrendingUp } from 'lucide-react'

export default function GroupRulesAndPolicies({ group, user }) {
  const [agreedToRules, setAgreedToRules] = useState(true)

  const groupRules = {
    contribution: [
      { rule: 'Contribution Amount', detail: '$5,000 per member', icon: DollarSign },
      { rule: 'Frequency', detail: 'Monthly on the 1st of each month', icon: Calendar },
      { rule: 'Payment Method', detail: 'EcoCash, Bank Transfer, or Mobile Money', icon: Shield },
      { rule: 'Late Payment Grace Period', detail: '10 days before penalty applies', icon: AlertCircle }
    ],
    payout: [
      { rule: 'Payout Order', detail: 'Fixed rotation by membership position', icon: Users },
      { rule: 'Amount', detail: 'Total pool = $5,000 × number of members', icon: DollarSign },
      { rule: 'Payout Schedule', detail: 'Every month to next in rotation', icon: Calendar },
      { rule: 'Minimum Requirement', detail: '80% of members must have paid', icon: CheckCircle }
    ],
    penalties: [
      { rule: '1-3 Days Late', detail: '5% of contribution amount', icon: AlertCircle },
      { rule: '4-7 Days Late', detail: '10% of contribution amount', icon: AlertCircle },
      { rule: '8+ Days Late', detail: '15% of contribution amount + suspension risk', icon: AlertCircle },
      { rule: 'Repeated Default', detail: 'May be removed from group', icon: Shield }
    ],
    compliance: [
      { rule: 'Profile Verification', detail: 'All members must provide valid ID', icon: Shield },
      { rule: 'Honesty & Transparency', detail: 'No false information or deception', icon: CheckCircle },
      { rule: 'Respect for Members', detail: 'Treat all members equally and fairly', icon: Users },
      { rule: 'Confidentiality', detail: 'Do not share other members\' financial info', icon: Shield }
    ]
  }

  const penalties = [
    { days: '1-3 days late', percentage: 5, description: 'Minor penalty' },
    { days: '4-7 days late', percentage: 10, description: 'Standard penalty' },
    { days: '8-14 days late', percentage: 15, description: 'Major penalty' },
    { days: '15+ days late', percentage: 20, description: 'Critical - may face suspension' }
  ]

  return (
    <div className="space-y-6">
      {/* Rules Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Group Rules & Policies</h1>
              <p className="text-blue-100">
              {group?.name || 'Your ChiedzaFund Group'} - Please read and understand all rules
            </p>
          </div>
          <BookOpen className="w-8 h-8 opacity-50" />
        </div>
      </div>

      {/* Contribution Rules */}
      <RuleSection
        title="Contribution Rules"
        icon={DollarSign}
        color="blue"
        rules={groupRules.contribution}
      />

      {/* Payout Rules */}
      <RuleSection
        title="Payout Rules"
        icon={TrendingUp}
        color="emerald"
        rules={groupRules.payout}
      />

      {/* Penalty System */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Penalty System
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {penalties.map((penalty, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800">{penalty.days}</span>
                <span className="text-2xl font-bold text-red-600">{penalty.percentage}%</span>
              </div>
              <p className="text-sm text-slate-600">{penalty.description}</p>
              <p className="text-xs text-slate-500 mt-2">
                Formula: Your contribution amount × {penalty.percentage}%
              </p>
            </div>
          ))}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          <p className="font-semibold mb-1">⚠️ Important</p>
          <p>All penalties are deducted from your next payout. Repeated late payments may result in suspension or removal from the group.</p>
        </div>
      </div>

      {/* Compliance & Ethics */}
      <RuleSection
        title="Compliance & Ethics"
        icon={Shield}
        color="purple"
        rules={groupRules.compliance}
      />

      {/* Dispute Resolution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Dispute Resolution Process
        </h3>

        <div className="space-y-4">
          <ResolutionStep
            number="1"
            title="Report to Admin"
            description="Contact the admin with details of the issue"
          />
          <ResolutionStep
            number="2"
            title="Investigation"
            description="Admin reviews evidence and gathers information from all parties"
          />
          <ResolutionStep
            number="3"
            title="Group Discussion"
            description="If needed, the matter is presented to the group for collective decision"
          />
          <ResolutionStep
            number="4"
            title="Resolution"
            description="Admin enforces the decision with support from the group"
          />
          <ResolutionStep
            number="5"
            title="Appeal"
            description="If unhappy, you may appeal to an independent mediator"
          />
        </div>
      </div>

      {/* Member Rights */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Your Rights as a Member
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li>✓ Transparent access to all group financial records</li>
          <li>✓ Fair and equal treatment in payout rotation</li>
          <li>✓ Right to be heard in case of disputes</li>
          <li>✓ Protection of personal and financial information</li>
          <li>✓ Right to receive your full payout amount</li>
          <li>✓ Right to request changes to group rules (with majority approval)</li>
        </ul>
      </div>

      {/* Member Responsibilities */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Your Responsibilities
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Pay your contribution on time and in full</li>
          <li>✓ Maintain honest and accurate information in your profile</li>
          <li>✓ Respect all group members equally</li>
          <li>✓ Follow the agreed payout order without exception</li>
          <li>✓ Communicate promptly about any payment issues</li>
          <li>✓ Maintain confidentiality of other members' information</li>
          <li>✓ Participate responsibly in group decisions</li>
        </ul>
      </div>

      {/* Suspension & Removal Policy */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Suspension & Removal Policy
        </h3>

        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <h4 className="font-semibold mb-1">Temporary Suspension (30 days):</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>30+ days overdue on contributions</li>
              <li>Repeated non-responsiveness to admin</li>
              <li>False information provided to group</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Permanent Removal:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>60+ days overdue without communication</li>
              <li>Fraudulent activity or deception</li>
              <li>Abusive behavior toward other members</li>
              <li>Repeated suspension violations</li>
            </ul>
          </div>

          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-red-800">
              <span className="font-semibold">Note:</span> Suspended or removed members forfeit any pending payouts and cannot rejoin for 12 months.
            </p>
          </div>
        </div>
      </div>

      {/* Rule Acknowledgment */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={agreedToRules}
            onChange={(e) => setAgreedToRules(e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded mt-1 cursor-pointer"
          />
          <div className="flex-1">
            <label className="cursor-pointer">
              <h3 className="font-bold text-emerald-900 mb-1">Acknowledgment of Rules</h3>
                <p className="text-sm text-emerald-800">
                I acknowledge that I have read, understood, and agree to follow all the rules, policies, and guidelines outlined above. I understand the consequences of non-compliance and commit to maintaining the integrity and trust of this ChiedzaFund group.
              </p>
            </label>
            <button
              className={`mt-4 w-full py-2 rounded-lg font-medium transition ${
                agreedToRules
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-300 text-slate-600 cursor-not-allowed'
              }`}
              disabled={!agreedToRules}
            >
              {agreedToRules ? 'Rules Acknowledged ✓' : 'Please agree to continue'}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <FAQItem
            question="What if I miss a payment deadline?"
            answer="Contact your admin immediately to arrange alternative payment or discuss your situation. Late payments incur penalties based on how many days overdue you are."
          />
          <FAQItem
            question="Can the group rules be changed?"
            answer="Yes, but only with agreement from the admin and a majority vote from all members. Any changes must be documented and communicated to everyone."
          />
          <FAQItem
            question="What happens if the admin behaves unfairly?"
            answer="Members can file a formal complaint to trigger a group review. If the issue is serious, an independent mediator can be brought in to resolve it fairly."
          />
          <FAQItem
            question="Can I withdraw from the group?"
            answer="Yes, but only after all your outstanding contributions and penalties are paid. You cannot withdraw during your payout turn."
          />
          <FAQItem
            question="What if someone defaults before my payout?"
            answer="The group has safeguards and maintains reserves to ensure payouts continue. Admin will pursue collection and members may make up the shortfall."
          />
        </div>
      </div>
    </div>
  )
}

// Rule Section Component
function RuleSection({ title, icon: Icon, color, rules }) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className={`bg-gradient-to-r ${colorStyles[color]} text-white p-4 flex items-center gap-2`}>
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="p-6 space-y-3">
        {rules.map((item, idx) => {
          const ItemIcon = item.icon
          return (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-b-0 last:pb-0">
              <ItemIcon className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800">{item.rule}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{item.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Resolution Step Component
function ResolutionStep({ number, title, description }) {
  return (
    <div className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
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


