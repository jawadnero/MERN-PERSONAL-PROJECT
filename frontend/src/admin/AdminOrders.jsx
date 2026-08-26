import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { adminRequest, useAdminData } from './adminApi'
import './adminPages.css'

const AdminOrders = () => {
  const { user } = useContext(AuthContext); const { data: orders, loading, error } = useAdminData(() => adminRequest('/api/orders', user.token), [user.token]); const [updating, setUpdating] = useState('')
  const updateStatus = async (id, status) => { setUpdating(id); try { await adminRequest(`/api/orders/${id}/status`, user.token, { method: 'PUT', body: JSON.stringify({ status }) }); window.location.reload() } catch (updateError) { window.alert(updateError.message) } finally { setUpdating('') } }
  return <main className="admin-page"><header><div><p className="admin-eyebrow">Operations</p><h1>Orders</h1></div></header>{loading && <p className="admin-state">Loading orders...</p>}{!loading && error && <p className="admin-state admin-error">{error}</p>}{!loading && !error && !orders?.length && <p className="admin-state">No orders have been placed yet.</p>}{!loading && !error && orders?.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td>#{order._id.slice(-8)}</td><td>{order.user?.name || order.user?.email || 'Unknown'}</td><td>${Number(order.totalAmount).toLocaleString()}</td><td>{order.status}</td><td><select disabled={updating === order._id} value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}><option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select></td></tr>)}</tbody></table></div>}</main>
}

export default AdminOrders