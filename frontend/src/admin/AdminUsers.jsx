import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { adminRequest, useAdminData } from './adminApi'
import './adminPages.css'

const AdminUsers = () => {
  const { user } = useContext(AuthContext); const { data, loading, error } = useAdminData(() => adminRequest('/api/auth/users', user.token), [user.token]); const users = data?.users || []
  return <main className="admin-page"><header><div><p className="admin-eyebrow">Accounts</p><h1>Users</h1></div></header>{loading && <p className="admin-state">Loading users...</p>}{!loading && error && <p className="admin-state admin-error">{error}</p>}{!loading && !error && !users.length && <p className="admin-state">No users found.</p>}{!loading && !error && users.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th></tr></thead><tbody>{users.map((account) => <tr key={account._id}><td>{account.name || account.username || 'Unnamed'}</td><td>{account.email}</td><td>{account.role}</td><td>{account.isVerified ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>}</main>
}

export default AdminUsers