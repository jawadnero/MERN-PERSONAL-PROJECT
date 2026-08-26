import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { adminRequest } from './adminApi'
import './adminPages.css'

const AdminProduct = () => {
	const { user } = useContext(AuthContext)
	const navigate = useNavigate()
	const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', image: null })
	const [state, setState] = useState({ loading: false, error: '' })
	const submit = async (event) => {
		event.preventDefault(); setState({ loading: true, error: '' })
		try { const body = new FormData(); Object.entries(form).forEach(([key, value]) => value !== null && body.append(key, value)); await adminRequest('/api/products', user.token, { method: 'POST', body }); navigate('/admin/products') }
		catch (error) { setState({ loading: false, error: error.message }) }
	}
	return <main className="admin-page"><header><div><p className="admin-eyebrow">Catalog</p><h1>Add product</h1></div></header><ProductForm form={form} setForm={setForm} submit={submit} state={state} /></main>
}

export const ProductForm = ({ form, setForm, submit, state }) => <form className="admin-form" onSubmit={submit}>{[['name','Name'],['description','Description'],['price','Price'],['category','Category'],['stock','Stock']].map(([key, label]) => <label key={key}>{label}{key === 'description' ? <textarea required value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /> : <input required type={['price','stock'].includes(key) ? 'number' : 'text'} min={key === 'price' ? '0' : undefined} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />} </label>)}<label>Image<input type="file" accept="image/*" required={!form.image} onChange={(event) => setForm({ ...form, image: event.target.files[0] || null })} /></label>{state.error && <p className="admin-error">{state.error}</p>}<button className="admin-action" disabled={state.loading}>{state.loading ? 'Saving...' : 'Save product'}</button></form>

export default AdminProduct
