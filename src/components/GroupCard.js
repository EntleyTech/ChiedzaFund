'use client'

import { Users, DollarSign, Calendar, Shield } from 'lucide-react'

export default function GroupCard({ group, onClick, currentUser }) {
  const isAdmin = group.adminId === currentUser?.id

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-6 shadow-sm border transition cursor-pointer ${
        isAdmin 
          ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-300' 
          : 'bg-white border-slate-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg text-slate-800 flex-1">{group.name}</h3>
        {isAdmin && (
          <div className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold ml-2 flex-shrink-0">
            <Shield className="w-3 h-3" />
            ADMIN
          </div>
        )}
      </div>

      {isAdmin && (
        <p className="text-xs text-purple-700 font-semibold mb-3">You manage this group</p>
      )}

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{group?.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>${group.amount?.toLocaleString() || 0} / {group.frequency}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Next payout: {group?.nextPayout?.date || 'TBD'}</span>
        </div>
      </div>
    </div>
  )
}
