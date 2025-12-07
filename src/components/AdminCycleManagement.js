'use client'

import { useState, useEffect } from 'react'
import { Calendar, Archive, Plus, RotateCw, CheckCircle, AlertCircle, Download } from 'lucide-react'

export default function AdminCycleManagement({ group, onUpdate }) {
  const [cycles, setCycles] = useState([
    { id: 1, name: 'Cycle 1', startDate: '2024-11-01', endDate: '2024-11-30', status: 'completed', totalCollected: 25000 },
    { id: 2, name: 'Cycle 2', startDate: '2024-12-01', endDate: '2024-12-31', status: 'active', totalCollected: 30000 }
  ])
  const [showNewCycle, setShowNewCycle] = useState(false)
  const [newCycleForm, setNewCycleForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    payoutOrder: 'rotate'
  })

  const activeCycle = cycles.find(c => c.status === 'active')
  const completedCycles = cycles.filter(c => c.status === 'completed')

  const handleCreateCycle = () => {
    if (!newCycleForm.name || !newCycleForm.startDate || !newCycleForm.endDate) {
      alert('Please fill in all fields')
      return
    }

    const cycle = {
      id: cycles.length + 1,
      name: newCycleForm.name,
      startDate: newCycleForm.startDate,
      endDate: newCycleForm.endDate,
      status: 'active',
      totalCollected: 0
    }

    setCycles([...cycles, cycle])
    setNewCycleForm({ name: '', startDate: '', endDate: '', payoutOrder: 'rotate' })
    setShowNewCycle(false)
    alert('New cycle created!')
  }

  const handleCloseCycle = (cycleId) => {
    if (confirm('Close this cycle? All pending payouts will be settled.')) {
      setCycles(cycles.map(c =>
        c.id === cycleId ? { ...c, status: 'completed' } : c
      ))
      alert('Cycle closed successfully!')
    }
  }

  const handleArchiveCycle = (cycleId) => {
    if (confirm('Archive this cycle? Data will be preserved but hidden.')) {
      setCycles(cycles.map(c =>
        c.id === cycleId ? { ...c, status: 'archived' } : c
      ))
      alert('Cycle archived!')
    }
  }

  const handleExportCycleReport = (cycleId) => {
    console.log('Exporting cycle report:', cycleId)
    alert('Cycle report exported!')
  }

  // Group-level saving end date (period end) -- admin can set this
  const [savingEndDate, setSavingEndDate] = useState(group?.savingEndDate || '')

  useEffect(() => {
    setSavingEndDate(group?.savingEndDate || '')
  }, [group?.savingEndDate])

  const handleSaveSavingEndDate = () => {
    if (!savingEndDate) {
      alert('Please choose an end date for the saving period')
      return
    }

    if (typeof onUpdate === 'function') {
      const updated = { ...group, savingEndDate }
      onUpdate(updated)
      alert('Saving period end date updated')
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Cycle Overview */}
      {activeCycle && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{activeCycle.name}</h3>
              <p className="text-emerald-100 mt-1">Currently Active</p>
            </div>
            <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full font-semibold text-sm">
              {Math.ceil((new Date(activeCycle.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-emerald-100 text-sm">Start Date</p>
              <p className="text-lg font-bold mt-1">{activeCycle.startDate}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm">End Date</p>
              <p className="text-lg font-bold mt-1">{activeCycle.endDate}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Total Collected</p>
              <p className="text-lg font-bold mt-1">${activeCycle.totalCollected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Members</p>
              <p className="text-lg font-bold mt-1">{group?.members?.length}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition">
              View Details
            </button>
            <button
              onClick={() => handleCloseCycle(activeCycle.id)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              Close Cycle
            </button>
          </div>
        </div>
      )}

      {/* Create New Cycle */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plus size={20} />
            Create New Cycle
          </h3>
          <button
            onClick={() => setShowNewCycle(!showNewCycle)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {showNewCycle ? 'Cancel' : 'New Cycle'}
          </button>
        </div>

        {showNewCycle && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cycle Name</label>
              <input
                type="text"
                value={newCycleForm.name}
                onChange={(e) => setNewCycleForm({ ...newCycleForm, name: e.target.value })}
                placeholder="e.g., Cycle 3 - Q1 2025"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={newCycleForm.startDate}
                  onChange={(e) => setNewCycleForm({ ...newCycleForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={newCycleForm.endDate}
                  onChange={(e) => setNewCycleForm({ ...newCycleForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payout Order</label>
              <select
                value={newCycleForm.payoutOrder}
                onChange={(e) => setNewCycleForm({ ...newCycleForm, payoutOrder: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="rotate">Rotate (Continue from last)</option>
                <option value="reset">Reset (Start from position 1)</option>
                <option value="custom">Custom Order</option>
              </select>
            </div>
            <button
              onClick={handleCreateCycle}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Create Cycle
            </button>
          </div>
        )}
      </div>

      {/* Cycle Status & Checklist */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle size={20} />
          Cycle Closure Checklist
        </h3>
        <div className="space-y-3">
          <ChecklistItem
            label="All contributions received"
            completed={false}
            action="Verify"
          />
          <ChecklistItem
            label="All payouts processed"
            completed={false}
            action="Process"
          />
          <ChecklistItem
            label="Penalties applied"
            completed={false}
            action="Review"
          />
          <ChecklistItem
            label="Financial report generated"
            completed={false}
            action="Generate"
          />
          <ChecklistItem
            label="Member confirmations received"
            completed={false}
            action="Send"
          />
        </div>
      </div>

      {/* Cycle History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Archive size={20} />
          Cycle History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Cycle</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Collected</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cycles.map(cycle => (
                <tr key={cycle.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{cycle.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {cycle.startDate} to {cycle.endDate}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">${cycle.totalCollected.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cycle.status === 'active' ? 'bg-emerald-100 text-emerald-800'
                      : cycle.status === 'completed' ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-800'
                    }`}>
                      {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportCycleReport(cycle.id)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        title="Export Report"
                      >
                        <Download size={14} />
                      </button>
                      {cycle.status === 'completed' && (
                        <button
                          onClick={() => handleArchiveCycle(cycle.id)}
                          className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition"
                          title="Archive"
                        >
                          Archive
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

      {/* Cycle Settings & Rules */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <RotateCw size={20} />
          Cycle Management Rules
        </h3>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">Saving Period End Date</label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={savingEndDate}
                onChange={(e) => setSavingEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveSavingEndDate}
                className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Set the date when this group's savings period will end.</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Automatic Cycle Rotation</p>
              <p className="text-slate-600">Cycles can be set to automatically create and transition</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Payout Rotation</p>
              <p className="text-slate-600">Each cycle continues from the last recipient or resets</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Data Archival</p>
              <p className="text-slate-600">Completed cycles are preserved for historical records</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Member Continuity</p>
              <p className="text-slate-600">Members remain in group across multiple cycles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle Completion Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle size={20} />
          Cycle Completion Process
        </h3>
        <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
          <li>Verify all member contributions are received and recorded</li>
          <li>Process final payout to designated recipient</li>
          <li>Apply any outstanding penalties or adjustments</li>
          <li>Generate final financial report for the cycle</li>
          <li>Send cycle completion summary to all members</li>
          <li>Archive cycle data for record-keeping</li>
          <li>Initialize new cycle if continuing</li>
        </ol>
      </div>
    </div>
  )
}

// Checklist Item Component
function ChecklistItem({ label, completed, action }) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          completed
            ? 'bg-emerald-600 border-emerald-600'
            : 'border-slate-300'
        }`}>
          {completed && <CheckCircle size={16} className="text-white" />}
        </div>
        <span className={completed ? 'text-slate-600 line-through' : 'text-slate-800'}>{label}</span>
      </div>
      <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
        {action}
      </button>
    </div>
  )
}
