import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './adminPages.css'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/add-product', label: 'Add product' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
]

const AdminLayout = () => (
  <section className="admin-section">
    <nav className="admin-section-nav" aria-label="Admin navigation">
      <span className="admin-section-title">Admin</span>
      <div className="admin-section-links">
        {adminLinks.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'admin-section-link active' : 'admin-section-link'}>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
    <Outlet />
  </section>
)

export default AdminLayout