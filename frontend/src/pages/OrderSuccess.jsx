import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/checkout.css'

const OrderSuccess = () => (
    <main className="checkout-container checkout-success">
        <h2>Order Successfully Placed</h2>
        <p>Your payment was verified and your order has been confirmed.</p>
        <Link to="/shop" className="checkout-link">Continue Shopping</Link>
    </main>
)

export default OrderSuccess
