import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { adminRequest, useAdminData } from './adminApi'
import './adminPages.css'

const AdminProducts = () => {
  const { user } = useContext(AuthContext)
  const { data: products, loading, error } = useAdminData(() => adminRequest('/api/products', user.token), [user.token])
  const removeProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await adminRequest(`/api/products/${id}`, user.token, { method: 'DELETE' })
    window.location.reload()
  }

  return <main className="admin-page"><header><div><p className="admin-eyebrow">Catalog</p><h1>Products</h1></div><Link className="admin-action" to="/admin/add-product">Add product</Link></header>
    {loading && <p className="admin-state">Loading products...</p>}
    {!loading && error && <p className="admin-state admin-error">{error}</p>}
    {!loading && !error && !products?.length && <p className="admin-state">No products have been added yet.</p>}
    {!loading && !error && products?.length > 0 && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td>{product.name}</td><td>{product.category}</td><td>${Number(product.price).toLocaleString()}</td><td>{product.stock}</td><td><Link to={`/admin/edit-product/${product._id}`}>Edit</Link><button type="button" onClick={() => removeProduct(product._id)}>Delete</button></td></tr>)}</tbody></table></div>}
  </main>
}

export default AdminProducts