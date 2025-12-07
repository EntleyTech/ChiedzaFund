'use client'

import { useState } from 'react'
import { Send, Bell, Mail, MessageSquare, Users, Calendar, Trash2 } from 'lucide-react'

export default function AdminCommunication({ group, members }) {
  const [activeTab, setActiveTab] = useState('announcements')
  const [announcements, setAnnouncements] = useState([
    { id: 1, date: '2024-12-05', title: 'Payment Reminder', content: 'Please pay your contribution by Dec 10', postedBy: 'Admin' },
    { id: 2, date: '2024-12-01', title: 'Cycle Started', content: 'New savings cycle has started!', postedBy: 'Admin' }
  ])
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', recipientType: 'all' })
  const [reminderMessages, setReminderMessages] = useState([
    { id: 1, memberId: 1, type: 'payment-due', status: 'sent', date: '2024-12-04' },
    { id: 2, memberId: 2, type: 'payout-ready', status: 'sent', date: '2024-12-03' }
  ])

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Please fill in title and content')
      return
    }

    const announcement = {
      id: announcements.length + 1,
      date: new Date().toISOString().split('T')[0],
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      postedBy: 'Admin',
      recipients: newAnnouncement.recipientType === 'all' ? 'All Members' : `Position ${newAnnouncement.recipientType}`
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({ title: '', content: '', recipientType: 'all' })
    alert('Announcement posted!')
  }

  const handleSendReminder = (type, memberId) => {
    console.log(`Sending ${type} reminder to member ${memberId}`)
    alert('Reminder sent!')
  }

  const handleDeleteAnnouncement = (id) => {
    if (confirm('Delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          {['announcements', 'reminders', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 font-medium transition flex items-center justify-center gap-2 ${
                activeTab === tab
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab === 'announcements' && <Bell size={18} />}
              {tab === 'reminders' && <Mail size={18} />}
              {tab === 'messages' && <MessageSquare size={18} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Post New Announcement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Send size={20} />
              Post New Announcement
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Write your announcement..."
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Send To</label>
                <select
                  value={newAnnouncement.recipientType}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, recipientType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">All Members</option>
                  <option value="pending">Members with Pending Payments</option>
                  {members?.map(m => (
                    <option key={m.userId} value={m.position}>Position #{m.position}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handlePostAnnouncement}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Post Announcement
              </button>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Announcements</h3>
            <div className="space-y-3">
              {announcements.map(announcement => (
                <div key={announcement.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{announcement.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{announcement.content}</p>
                      <div className="flex gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {announcement.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {announcement.recipients || 'All Members'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          {/* Automated Reminders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Mail size={20} />
              Send Automated Reminders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReminderCard
                title="Payment Due Reminder"
                description="Remind members about pending contributions"
                icon={Mail}
                onClick={() => handleSendReminder('payment-due', null)}
              />
              <ReminderCard
                title="Payout Ready Notification"
                description="Notify next recipient about upcoming payout"
                icon={Bell}
                onClick={() => handleSendReminder('payout-ready', null)}
              />
              <ReminderCard
                title="Meeting Reminder"
                description="Send meeting date and details to all members"
                icon={Calendar}
                onClick={() => handleSendReminder('meeting', null)}
              />
              <ReminderCard
                title="Cycle Update"
                description="Share cycle progress and statistics"
                icon={Users}
                onClick={() => handleSendReminder('cycle-update', null)}
              />
            </div>
          </div>

          {/* Reminder History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Reminder History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Recipient</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reminderMessages.map(reminder => (
                    <tr key={reminder.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-800">{reminder.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-800 capitalize">{reminder.type.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">Member {reminder.memberId}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Send Direct Message
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Member</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value="">Choose a member...</option>
                  {members?.map(m => (
                    <option key={m.userId} value={m.userId}>Member {m.userId} (Position #{m.position})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  placeholder="Type your message..."
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-medium">
                Send Message
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 Use direct messages for sensitive or individual member communications.
              Use announcements for group-wide important updates.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Reminder Card Component
function ReminderCard({ title, description, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-300 transition text-left"
    >
      <div className="flex items-start gap-3">
        <Icon size={24} className="text-emerald-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-slate-800">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}
