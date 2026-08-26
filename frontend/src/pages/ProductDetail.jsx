import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {addToCart} from '../redux/cartSlice'
import { formatPrice } from '../utils/currency'
import '../styles/productDetail.css'


const ProductDetail = () => {
const {id} = useParams()
const [product, setProduct] = useState(null)
const [loading, setLoading] = useState(true)
const dispatch = useDispatch()  

useEffect(()=>{
  const fetchProduct = async()=>{
    try{
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching product:", error)
      setLoading(false)
    }
  };
  fetchProduct()
},[id])

const handleAddToCart = () => {
  if(product){
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1
    }))
    alert(`Successfully added to your cart!`)
  };
 }
if(loading) return <div style={{textAlign: 'center', margin: '100px', color: '#f97316'}}>Loading...</div> 
if(!product)return <div style={{textAlign: 'center', margin: '100px', color: '#ef4444'}}>Product not found</div>
  return (
    <>
    <div style={{color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem'}}>
      <Link to="/" style={{color: '#f97316', textDecoration: 'none'}}>Home</Link> / <Link to="/shop" style={{color: '#f97316', textDecoration: 'none'}}>Shop </Link> / {product.category} / <span style={{ color: '#fff'}}>{product.name}</span>    
    </div>
    <div className="product-detail">
       {/* Left Side: Image */}
       <div className="detail-image-container">
        <img src={product.imageUrl} alt={product.name} className='detail-image' />
       </div>
        {/* Right Side: Product Info */}
        <div className="detail-info">
          <h2 style={{fontSize: '1.5rem', marginBottom: '10px'}}>{product.name}</h2>
          <p className='detail-price' style={{fontSize: '2.5rem', margin: '15px 0',}}>{formatPrice(product.price)}</p>
        </div>
        {/* Description */}
        <div style={{marginBottom: '25px'}}>
          <h4 style={{color: '#fff', marginBottom: '10px'}}>Product Description</h4>
          <p style={{color: '#a1a1aa', lineHeight: '1.8'}}>{product.description}</p>
        </div>

        {/* Cart & Stock Actions */}
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button onClick={handleAddToCart} style={{backgroundColor: '#f97316', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Add to Shopping Cart</button>
        </div>

        <p style={{marginTop: '20px', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '600'}}>
          {product.stock > 0 ? ` In Stock (${product.stock} units available)`: `Temproarily Out of Stack`} 
        </p>

      </div>
    </>
  )
}

export default ProductDetail