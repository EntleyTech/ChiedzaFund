'use client'

import { useState } from 'react'
import { MessageSquare, Bell, Send, Flag, Eye, Trash2, Reply, Clock } from 'lucide-react'

export default function UserCommunication({ group, user }) {
  const [activeTab, setActiveTab] = useState('announcements')
  const [messages, setMessages] = useState([])
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Payment Reminder', content: 'Please pay your contribution by Dec 10th', from: 'Admin', date: '2024-12-05', read: false },
    { id: 2, title: 'Cycle Started', content: 'New savings cycle has started! Welcome to cycle 2.', from: 'Admin', date: '2024-12-01', read: true }
  ])
  const [reports, setReports] = useState([
    { id: 1, title: 'Payment Issue', description: 'Unable to process payment', date: '2024-12-03', status: 'resolved' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportForm, setReportForm] = useState({ title: '', description: '', category: 'other' })

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    setMessages([
      { id: messages.length + 1, content: newMessage, from: 'You', date: new Date().toISOString().split('T')[0], isUser: true },
      ...messages
    ])
    setNewMessage('')
  }

  const handleFileReport = () => {
    if (!reportForm.title || !reportForm.description) {
      alert('Please fill in all fields')
      return
    }
    setReports([
      { id: reports.length + 1, ...reportForm, date: new Date().toISOString().split('T')[0], status: 'pending' },
      ...reports
    ])
    setReportForm({ title: '', description: '', category: 'other' })
    setShowReportForm(false)
    alert('Report submitted!')
  }

  const handleMarkAsRead = (id) => {
    setAnnouncements(announcements.map(a =>
      a.id === id ? { ...a, read: true } : a
    ))
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          {['announcements', 'messages', 'reports'].map(tab => {
            const unreadCount = tab === 'announcements' ? announcements.filter(a => !a.read).length : 0
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 font-medium transition flex items-center justify-center gap-2 relative ${
                  activeTab === tab
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab === 'announcements' && <Bell size={18} />}
                {tab === 'messages' && <MessageSquare size={18} />}
                {tab === 'reports' && <Flag size={18} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map(announcement => (
              <div
                key={announcement.id}
                className={`rounded-lg p-4 border-l-4 transition ${
                  announcement.read
                    ? 'bg-slate-50 border-slate-300'
                    : 'bg-blue-50 border-blue-500 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{announcement.title}</h3>
                      {!announcement.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-slate-700 mb-2">{announcement.content}</p>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span>From: {announcement.from}</span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!announcement.read && (
                      <button
                        onClick={() => handleMarkAsRead(announcement.id)}
                        className="p-2 hover:bg-blue-100 rounded transition"
                        title="Mark as read"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="No announcements yet" />
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {/* Chat with Admin */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-emerald-600 text-white p-4 font-bold">
              Direct Message with Admin
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports & Issues Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Report Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Flag size={20} />
                Report an Issue
              </h3>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {showReportForm ? 'Cancel' : '+ New Report'}
              </button>
            </div>

            {showReportForm && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="payment">Payment Issue</option>
                    <option value="dispute">Member Dispute</option>
                    <option value="verification">Verification Problem</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    placeholder="Brief summary..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    placeholder="Provide details about the issue..."
                    rows="4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleFileReport}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {reports.length > 0 ? (
              reports.map(report => (
                <div key={report.id} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{report.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} />
                    {report.date}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState message="No reports filed yet" />
            )}
          </div>
        </div>
      )}

      {/* Communication Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Bell size={18} />
          Communication Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Check announcements regularly for important updates</li>
          <li>✓ Reply to messages within 24 hours if possible</li>
          <li>✓ Be respectful and professional in all communications</li>
          <li>✓ Report issues immediately to prevent complications</li>
          <li>✓ Keep your contact information updated</li>
          <li>✓ Respect the privacy of other group members</li>
        </ul>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <div className="text-center py-8 text-slate-500">
      <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
      <p>{message}</p>
    </div>
  )
}
