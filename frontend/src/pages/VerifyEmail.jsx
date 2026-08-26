import React, { useContext, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

const VerifyEmail = () => {
    const { state } = useLocation()
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState(state?.email || '')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Email verification failed')
            }

            login(data)
            navigate('/')
        } catch (verificationError) {
            setError(verificationError.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Verify Email</h2>
                <p>Enter the OTP sent to your email address.</p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    required
                />
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-button" disabled={submitting}>
                    {submitting ? 'Verifying...' : 'Verify Email'}
                </button>
                <p><Link to="/register">Register again</Link></p>
            </form>
        </div>
    )
}

export default VerifyEmail
