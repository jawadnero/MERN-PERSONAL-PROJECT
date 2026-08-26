import React from 'react'
import { Link } from 'react-router-dom'
import "../styles/product.css"
import { formatPrice } from '../utils/currency'
const ProductCard = ({ product }) => {
    return (
        <div className='product-card'>
            <img src={product.imageUrl} alt={product.name} className='product-image' />
            <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className='product-name'>{product.name}</h3>
                <p className='product-price'>{formatPrice(product.price)}</p>
                <Link to={`/product/${product._id}`} className='product-link'>
                    View Details
                </Link>
            </div>

        </div>
    )
}

export default ProductCard