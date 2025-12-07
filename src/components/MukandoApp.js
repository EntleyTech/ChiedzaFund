'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, DollarSign, Calendar, CheckCircle, AlertCircle, TrendingUp, Clock, Settings, LogOut, Bell, Award, Menu, X, Shield } from 'lucide-react'
const PUBLIC_LOGO_JPG = '/logo.jpg'
const PUBLIC_LOGO_PNG = '/logo.PNG'
import AuthScreen from './AuthScreen'
import Dashboard from './Dashboard'
import GroupDetail from './GroupDetail'
import CreateGroupModal from './CreateGroupModal'
import AdminDashboard from './AdminDashboard'

export default function MukandoApp() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showAuth, setShowAuth] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showAdminView, setShowAdminView] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  // Initialize demo data
  const [users, setUsers] = useState([
    { id: 1, name: 'Genius Garauzive', email: 'genius@gmail.com', password: '', phone: '+263771428528', role: 'user' },
    { id: 2, name: 'Entley', email: 'entley@gmail.com', password: '', phone: '+263723456789', role: 'user' },
    { id: 3, name: 'Entleytech Admin', email: 'entleytech@gmail.com', password: '', phone: '+263734567890', role: 'admin' }
  ])

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Office Savings Circle',
      code: 'MK-OFFICE-001',
      pendingRequests: [],
      adminId: 1,
      amount: 5000,
      frequency: 'weekly',
      members: [
        { userId: 1, position: 1, contributions: [
          { date: '2024-12-01', status: 'paid', amount: 5000 },
          { date: '2024-11-24', status: 'paid', amount: 5000 }
        ]},
        { userId: 2, position: 2, contributions: [
          { date: '2024-12-01', status: 'paid', amount: 5000 },
          { date: '2024-11-24', status: 'paid', amount: 5000 }
        ]},
        { userId: 3, position: 3, contributions: [
          { date: '2024-12-01', status: 'pending', amount: 5000 },
          { date: '2024-11-24', status: 'paid', amount: 5000 }
        ]}
      ],
      nextPayout: { position: 1, date: '2024-12-08' },
      createdAt: '2024-11-01'
    }
  ])

  // Auth handlers
  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setCurrentUser(user)
      setShowAuth(false)
      generateNotifications(user)
    } else {
      alert('Invalid credentials. Please check your email and password and try again.')
    }
  }

  const handleRegister = (name, email, password, phone) => {
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      phone,
      role: 'user',
      adminOf: []
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    setShowAuth(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setShowAuth(true)
    setSelectedGroup(null)
  }

  // Generate notifications
  const generateNotifications = (user) => {
    const notifs = []
    groups.forEach(group => {
      const member = group.members.find(m => m.userId === user.id)
      if (member) {
        const lastContribution = member.contributions[0]
        if (lastContribution?.status === 'pending') {
          notifs.push({
            id: notifs.length + 1,
            type: 'warning',
            message: `Payment pending for ${group.name}`,
            groupId: group.id
          })
        }
      }
    })
    setNotifications(notifs)
  }

  // Create group handler
  const handleCreateGroup = (groupData) => {
    const newGroup = {
      id: groups.length + 1,
      ...groupData,
      code: groupData.code || `MK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2,5).toUpperCase()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      adminPhone: currentUser.phone || '',
      members: [
        { 
          userId: currentUser.id, 
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          position: 1, 
          status: 'active',
          joinedAt: new Date().toISOString().split('T')[0],
          role: 'admin+member',
          contributions: [],
          totalContributed: 0,
          paymentHistory: []
        }
      ],
      totalMembers: 1,
      nextPayout: { position: 1, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      totalPool: 0,
      cycles: [],
      securityAlerts: [],
      suspendedMembers: []
    }
    // Add group to state
    setGroups([...groups, newGroup])

    // Promote current user to admin role (if not already) and register adminOf reference
    const updatedUser = {
      ...currentUser,
      role: 'admin',
      adminOf: Array.isArray(currentUser?.adminOf) ? [...currentUser.adminOf, newGroup.id] : [newGroup.id]
    }

    // Update current user and users list
    setCurrentUser(updatedUser)
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u))

    // Optionally open admin view or the created group
    setShowCreateGroup(false)
  }

  // Handle a join request submitted by a user via group code
  const handleRequestJoin = (groupCode, requester) => {
    const target = groups.find(g => g.code === groupCode)
    if (!target) {
      alert('Group code not found. Please check with the admin.')
      return
    }

    // Prevent duplicate pending requests from the same user
    const existing = (target.pendingRequests || []).find(r => r.userId === requester.id)
    if (existing) {
      alert('You have already submitted a join request to this group.')
      return
    }

    const request = {
      id: Date.now(),
      userId: requester.id,
      name: requester.name,
      email: requester.email,
      phone: requester.phone || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const updatedGroup = {
      ...target,
      pendingRequests: [...(target.pendingRequests || []), request]
    }

    setGroups(groups.map(g => g.id === target.id ? updatedGroup : g))
    alert('Join request submitted to the group admin.')
  }

  // Approve a pending join request (admin action)
  const approveJoinRequest = (groupId, requestId) => {
    const target = groups.find(g => g.id === groupId)
    if (!target) return

    const req = (target.pendingRequests || []).find(r => r.id === requestId)
    if (!req) return

    const newMember = {
      userId: req.userId,
      name: req.name,
      email: req.email,
      phone: req.phone || '',
      position: (target.members?.length || 0) + 1,
      status: 'active',
      joinedAt: new Date().toISOString().split('T')[0],
      role: 'member',
      contributions: [],
      totalContributed: 0,
      paymentHistory: []
    }

    const updatedGroup = {
      ...target,
      members: [...(target.members || []), newMember],
      totalMembers: (target.totalMembers || (target.members?.length || 0)) + 1,
      pendingRequests: (target.pendingRequests || []).filter(r => r.id !== requestId)
    }

    setGroups(groups.map(g => g.id === groupId ? updatedGroup : g))

    // Add a notification for the requester (optional)
    setNotifications(n => [...n, { id: Date.now(), type: 'info', message: `${req.name} has been approved to join ${target.name}`, groupId }])

    // Optionally update the user record to reflect membership
    setUsers(prev => prev.map(u => u.id === req.userId ? ({ ...u, memberOf: Array.isArray(u.memberOf) ? [...u.memberOf, groupId] : [groupId] }) : u))
  }

  // Reject a pending join request (admin action)
  const rejectJoinRequest = (groupId, requestId) => {
    const target = groups.find(g => g.id === groupId)
    if (!target) return

    const req = (target.pendingRequests || []).find(r => r.id === requestId)
    if (!req) return

    const updatedGroup = {
      ...target,
      pendingRequests: (target.pendingRequests || []).filter(r => r.id !== requestId)
    }

    setGroups(groups.map(g => g.id === groupId ? updatedGroup : g))
    setNotifications(n => [...n, { id: Date.now(), type: 'warning', message: `${req.name}'s join request to ${target.name} was rejected`, groupId }])
  }

  // Mark contribution as paid
  const markAsPaid = (groupId, userId, amount) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map(m => {
            if (m.userId === userId) {
              const updatedContribs = (m.contributions || []).map((c, idx) =>
                idx === 0 ? { ...c, status: 'paid', amount: amount ?? c.amount, paidAt: new Date().toISOString().split('T')[0] } : c
              )
              // if no contributions exist, push one
              if (!m.contributions || m.contributions.length === 0) {
                updatedContribs.push({ date: new Date().toISOString().split('T')[0], status: 'paid', amount: amount ?? g.amount })
              }
              return { ...m, contributions: updatedContribs }
            }
            return m
          })
        }
      }
      return g
    }))
    generateNotifications(currentUser)
  }

  // Update a specific contribution amount for a member (admin action)
  const updateContributionAmount = (groupId, userId, contributionIndex, amount) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map(m => {
            if (m.userId === userId) {
              const contribs = (m.contributions || []).slice()
              if (contribs[contributionIndex]) {
                contribs[contributionIndex] = { ...contribs[contributionIndex], amount }
              } else {
                // add placeholder if index missing
                contribs[contributionIndex] = { date: new Date().toISOString().split('T')[0], status: 'paid', amount }
              }
              return { ...m, contributions: contribs }
            }
            return m
          })
        }
      }
      return g
    }))
  }

  // Get user groups
  const getUserGroups = () => {
    return groups.filter(g => 
      g.members.some(m => m.userId === currentUser?.id)
    )
  }

  // Update current user's profile (name, email, phone, password)
  const handleUpdateProfile = (updatedFields) => {
    if (!currentUser) return
    const allowed = ['name', 'email', 'phone', 'password']
    const payload = {}
    Object.keys(updatedFields).forEach(k => { if (allowed.includes(k)) payload[k] = updatedFields[k] })

    // Basic validation: password length if provided
    if (payload.password && payload.password.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }

    const updatedUser = { ...currentUser, ...payload }
    setCurrentUser(updatedUser)
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
    alert('Profile updated successfully')
  }

  // Calculate stats
  const calculateStats = () => {
    const userGroups = getUserGroups()
    let totalContributed = 0
    let onTimePayments = 0
    let totalPayments = 0

    userGroups.forEach(group => {
      const member = group.members.find(m => m.userId === currentUser.id)
      if (member) {
        member.contributions.forEach(c => {
          totalPayments++
          totalContributed += c.amount
          if (c.status === 'paid') onTimePayments++
        })
      }
    })

    return {
      totalGroups: userGroups.length,
      totalContributed,
      reliabilityScore: totalPayments > 0 ? Math.round((onTimePayments / totalPayments) * 100) : 100,
      activeGroups: userGroups.length
    }
  }

  if (showAuth) {
    return <AuthScreen 
      mode={authMode} 
      setMode={setAuthMode}
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  }

  // Admin Dashboard if user is admin and has toggled to admin view
  if (currentUser?.role === 'admin' && showAdminView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl overflow-hidden bg-white bg-opacity-0">
                <img src={PUBLIC_LOGO_JPG} alt="ChiedzaFund" className="w-8 h-8 object-contain" onError={(e)=>{e.currentTarget.src=PUBLIC_LOGO_PNG}} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">ChiedzaFund Admin</h1>
                <p className="text-xs text-slate-500">Admin Control Panel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {/* Toggle back to user view if admin wants to join other groups */}
              <button
                onClick={() => setShowAdminView(false)}
                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Back to My Dashboard
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition">
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{currentUser?.name}</span>
                <LogOut className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Admin Dashboard Content */}
        <main>
          <AdminDashboard
            user={currentUser}
            groups={groups.filter(g => g.adminId === currentUser.id || (currentUser.adminOf && currentUser.adminOf.includes(g.id)))}
            onCreateGroup={() => setShowCreateGroup(true)}
            onUpdateGroup={(updatedGroup) => {
              setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g))
            }}
            onApproveRequest={approveJoinRequest}
            onRejectRequest={rejectJoinRequest}
            onUpdateContribution={(groupId, userId, idx, amount) => updateContributionAmount(groupId, userId, idx, amount)}
          />
        </main>

        {/* Create Group Modal */}
        {showCreateGroup && (
          <CreateGroupModal 
            onClose={() => setShowCreateGroup(false)}
            onCreate={handleCreateGroup}
          />
        )}
      </div>
    )
  }

  // Regular User Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl overflow-hidden bg-white bg-opacity-0">
              <img src={PUBLIC_LOGO_JPG} alt="ChiedzaFund" className="w-6 h-6 object-contain" onError={(e)=>{e.currentTarget.src=PUBLIC_LOGO_PNG}} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-800">ChiedzaFund</h1>
              <p className="text-xs text-slate-500">Savings System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            {/* If user is admin for any group, allow switching to Admin Panel */}
            {currentUser?.role === 'admin' && (currentUser?.adminOf?.length > 0) && (
              <button
                onClick={() => setShowAdminView(true)}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Admin Panel
              </button>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-lg transition">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{currentUser?.name}</span>
              <LogOut className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {!selectedGroup ? (
          <Dashboard 
            user={currentUser}
            groups={getUserGroups()}
            stats={calculateStats()}
            onSelectGroup={setSelectedGroup}
            onCreateGroup={() => setShowCreateGroup(true)}
            onRequestJoin={handleRequestJoin}
            onUpdateProfile={handleUpdateProfile}
            notifications={notifications}
          />
        ) : (
          <GroupDetail 
            group={selectedGroup}
            currentUser={currentUser}
            users={users}
            onBack={() => setSelectedGroup(null)}
            onMarkPaid={markAsPaid}
          />
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  )
}
