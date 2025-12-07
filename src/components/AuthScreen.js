"use client"

import { useState } from 'react'
import { Users } from 'lucide-react'
// Prefer serving logo from public for reliability
const PUBLIC_LOGO_JPG = '/logo.jpg'
const PUBLIC_LOGO_PNG = '/logo.PNG'

export default function AuthScreen({ mode, setMode, onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [pwStrength, setPwStrength] = useState({ score: 0, label: '' })

  const handleSubmit = () => {
    if (mode === 'login') {
      onLogin(formData.email, formData.password)
    } else {
      // Validate password strength before registering
      const { score } = evaluatePassword(formData.password)
      if (score < 3) {
        alert('Please choose a stronger password. Use at least 8 characters, including uppercase, lowercase, numbers and symbols.')
        return
      }
      onRegister(formData.name, formData.email, formData.password, formData.phone)
    }
  }

  // Simple password strength evaluator
  const evaluatePassword = (pw) => {
    let score = 0
    if (!pw || pw.length < 1) return { score: 0, label: 'Too short' }
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++

    let label = 'Weak'
    if (score >= 4) label = 'Strong'
    else if (score === 3) label = 'Good'
    else if (score === 2) label = 'Fair'

    return { score, label }
  }

  const onPasswordChange = (value) => {
    setFormData({ ...formData, password: value })
    setPwStrength(evaluatePassword(value))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src={PUBLIC_LOGO_JPG} alt="ChiedzaFund" className="w-full h-full object-contain" onError={(e)=>{e.currentTarget.src=PUBLIC_LOGO_PNG}} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">ChiedzaFund</h2>
          <p className="text-slate-600 mt-2">Digital Savings Circle</p>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              mode === 'login' ? 'bg-white text-emerald-600 shadow' : 'text-slate-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-md font-medium transition ${
              mode === 'register' ? 'bg-white text-emerald-600 shadow' : 'text-slate-600'
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={formData.password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <div>Password strength: <span className="font-semibold">{pwStrength.label || '—'}</span></div>
              <div className="w-36">
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div
                    style={{ width: `${(pwStrength.score / 4) * 100}%` }}
                    className={`h-2 ${pwStrength.score >= 4 ? 'bg-emerald-600' : pwStrength.score === 3 ? 'bg-amber-500' : 'bg-red-500'}`}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">Tip: Use at least 8 characters, mix upper & lower case, numbers & symbols.</p>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 text-center font-semibold mb-2">
            Admin: entleytech@gmail.com / Genius@2002
          </p>
          <p className="text-xs text-slate-600 text-center">
            Demo: genius@gmail.com / demo123
          </p>
        </div>
      </div>
    </div>
  )
}
