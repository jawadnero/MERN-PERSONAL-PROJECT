import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from '../redux/cartSlice'
import '../styles/navbar.css'

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        logout()
        dispatch(clearCart())
        navigate('/login', { replace: true })
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-link">
                    <img src="/shopnest.jpg" alt="ShopNest Logo" className="navbar-logo" />
                    <span>ShopNest</span>
                </Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                {user ? (
                    <>
                        <li><Link to="/profile">Hi, {user.name}</Link></li>
                        {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                        <li><button onClick={handleLogout} className='btn-logout'>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar