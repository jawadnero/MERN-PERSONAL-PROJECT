import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { adminRequest } from './adminApi'
import { ProductForm } from './AdminProduct'
import './adminPages.css'

const EditProduct = () => {
  const { user } = useContext(AuthContext); const { id } = useParams(); const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', image: null }); const [state, setState] = useState({ loading: true, error: '' })
  useEffect(() => { adminRequest(`/api/products/${id}`, user.token).then((product) => { setForm({ ...product, image: null }); setState({ loading: false, error: '' }) }).catch((error) => setState({ loading: false, error: error.message })) }, [id, user.token])
  const submit = async (event) => { event.preventDefault(); setState({ loading: true, error: '' }); try { const body = new FormData(); Object.entries(form).forEach(([key, value]) => value !== null && body.append(key, value)); await adminRequest(`/api/products/${id}`, user.token, { method: 'PUT', body }); navigate('/admin/products') } catch (error) { setState({ loading: false, error: error.message }) } }
  return <main className="admin-page"><header><div><p className="admin-eyebrow">Catalog</p><h1>Edit product</h1></div></header>{state.loading ? <p className="admin-state">Loading product...</p> : state.error ? <p className="admin-state admin-error">{state.error}</p> : <ProductForm form={form} setForm={setForm} submit={submit} state={state} />}</main>
}

export default EditProduct