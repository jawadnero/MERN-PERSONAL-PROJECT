import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import '../styles/product.css'

const Shop = () => {
	const [products, setProducts] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch('/api/products')
				if (!response.ok) {
					throw new Error('Unable to load products')
				}
				const data = await response.json()
				setProducts(Array.isArray(data) ? data : [])
			} catch (fetchError) {
				setError(fetchError.message)
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
	}, [])

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<main className="featured-products">
			<h1>Shop All Products</h1>
			<p>Browse our collection and find something you will love.</p>

			<label htmlFor="product-search" className="shop-search">
				<span>Search products</span>
				<input
					id="product-search"
					type="search"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder="Search by product name"
				/>
			</label>

			{loading && <p className="loading-text">Loading products...</p>}
			{error && <p className="no-products-text">{error}. Please try again later.</p>}
			{!loading && !error && filteredProducts.length > 0 && (
				<div className="products-grid">
					{filteredProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
			{!loading && !error && filteredProducts.length === 0 && (
				<p className="no-products-text">No products match your search.</p>
			)}
		</main>
	)
}

export default Shop
