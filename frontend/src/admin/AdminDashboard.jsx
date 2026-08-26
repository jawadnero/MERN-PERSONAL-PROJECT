import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const EMPTY_ANALYTICS = { totalUsers: 0, totalOrders: 0, totalProducts: 0, totalRevenue: 0 }
const metrics = [
	['totalRevenue', 'Total revenue', '$', 'Across all orders'],
	['totalOrders', 'Orders', '', 'Placed in your store'],
	['totalProducts', 'Products', '', 'Available in catalog'],
	['totalUsers', 'Customers', '', 'Registered accounts'],
]

const AdminDashboard = () => {
	const { user } = useContext(AuthContext)
	const [analytics, setAnalytics] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [lastUpdated, setLastUpdated] = useState(null)
	const [refreshKey, setRefreshKey] = useState(0)

	useEffect(() => {
		const controller = new AbortController()

		const loadAnalytics = async () => {
			if (!user?.token) {
				setLoading(false)
				return
			}

			try {
				setLoading(true)
				setError('')
				const response = await fetch('/api/analytics', {
					headers: { Authorization: `Bearer ${user.token}` },
					signal: controller.signal,
				})
				const payload = await response.json().catch(() => ({}))
				if (!response.ok) throw new Error(payload.message || payload.error || 'Unable to load analytics.')
				setAnalytics(Object.fromEntries(Object.keys(EMPTY_ANALYTICS).map((key) => [key, Number(payload[key]) || 0])))
				setLastUpdated(new Date())
			} catch (fetchError) {
				if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Unable to load analytics.')
			} finally {
				if (!controller.signal.aborted) setLoading(false)
			}
		}

		loadAnalytics()
		return () => controller.abort()
	}, [user?.token, refreshKey])

	const retry = () => {
		setAnalytics(null)
		setRefreshKey((currentKey) => currentKey + 1)
	}

	if (!user) return <main className="admin-dashboard"><div className="admin-message"><h1>Admin access required</h1><Link to="/login">Sign in to continue</Link></div></main>
	if (user.role !== 'admin') return <main className="admin-dashboard"><div className="admin-message"><h1>Access denied</h1><p>Your account does not have administrator access.</p></div></main>

	const hasData = analytics && Object.values(analytics).some((value) => value > 0)

	return (
		<main className="admin-dashboard">
			<header className="admin-dashboard-header">
				<div><p className="admin-eyebrow">Store overview</p><h1>Good to see you, {user.name || 'Admin'}.</h1><p className="admin-subtitle">A live snapshot of your ShopNest store.</p></div>
				<div className="admin-header-actions"><span className="admin-live-status"><i /> Live data</span><button className="admin-refresh" type="button" onClick={retry} disabled={loading} aria-label="Refresh analytics">Refresh</button></div>
			</header>
			{loading && <div className="admin-state" role="status">Loading store analytics...</div>}
			{!loading && error && <div className="admin-state admin-state-error" role="alert"><strong>Analytics unavailable</strong><span>{error}</span><button type="button" onClick={retry}>Try again</button></div>}
			{!loading && !error && !hasData && <div className="admin-state"><strong>No store activity yet</strong><span>Analytics will appear here as customers, products, and orders are added.</span></div>}
			{!loading && !error && analytics && <>
				<section className="admin-metrics" aria-label="Store analytics">{metrics.map(([key, label, prefix, detail]) => <article className={`admin-metric admin-metric-${key}`} key={key}><span className="admin-metric-label">{label}</span><strong>{prefix}{analytics[key].toLocaleString()}</strong><small>{detail}</small></article>)}</section>
				<div className="admin-dashboard-footer"><span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Updated just now'}</span><div className="admin-quick-actions"><Link to="/admin/products">View catalog</Link><Link to="/admin/orders">Review orders</Link><Link to="/admin/add-product">Add product</Link></div></div>
			</>}
		</main>
	)
}

export default AdminDashboard
