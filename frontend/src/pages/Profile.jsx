import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/profile.css'

const Profile = () => {
    const { user } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()

    if (!user) {
        navigate('/login', { state: { from: location.pathname }, replace: true })
        return null
    }

    return (
        <main className="profile-container">
            <section className="profile-card">
                <div className="profile-avatar" aria-hidden="true">
                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="profile-heading">
                    <p className="profile-eyebrow">My account</p>
                    <h1>{user.name || user.username}</h1>
                    <p className="profile-role">{user.role || 'Customer'}</p>
                </div>
                <div className="profile-details">
                    <div>
                        <span>Name</span>
                        <strong>{user.name || user.username}</strong>
                    </div>
                    <div>
                        <span>Email</span>
                        <strong>{user.email}</strong>
                    </div>
                    <div>
                        <span>Account status</span>
                        <strong className="profile-status">Verified</strong>
                    </div>
                </div>
                <Link to="/shop" className="profile-action">Continue Shopping</Link>
            </section>
        </main>
    )
}

export default Profile
