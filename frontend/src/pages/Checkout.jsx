import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthContext } from '../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/cartSlice'
import { formatPrice } from '../utils/currency'
import '../styles/checkout.css'

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.cartItems)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [address, setAddress] = useState({ fullName: '', street: '', city: '' })
    const [message, setMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [paymentOrder, setPaymentOrder] = useState(null)
    const [paymentId, setPaymentId] = useState('')
    const [paymentVerified, setPaymentVerified] = useState(false)

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0)

    const handleChange = (event) => {
        setAddress({ ...address, [event.target.name]: event.target.value })
    }

    const handleStartPayment = async () => {
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } })
            return
        }

        setSubmitting(true)
        setMessage('')

        try {
            const response = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice, currency: 'PKR' })
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to start payment')
            }

            if (!data.checkoutUrl || !data.order_id) {
                throw new Error('Payment gateway did not return a checkout URL')
            }

            sessionStorage.setItem('checkoutAddress', JSON.stringify(address))
            sessionStorage.setItem('paymentOrder', JSON.stringify({
                order_id: data.order_id,
                checkoutUrl: data.checkoutUrl
            }))
            window.location.assign(data.checkoutUrl)
        } catch (error) {
            setMessage(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const placeOrder = useCallback(async (verifiedPaymentId) => {
        setSubmitting(true)
        setMessage('')

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    products: cartItems.map((item) => ({
                        productId: item.productId || item._id,
                        qty: item.qty,
                        price: item.price
                    })),
                    totalAmount: totalPrice,
                    address,
                    paymentId: verifiedPaymentId
                })
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to place order')
            }

            dispatch(clearCart())
            sessionStorage.removeItem('checkoutAddress')
            sessionStorage.removeItem('paymentOrder')
            navigate('/order-success', { replace: true })
        } catch (error) {
            setMessage(error.message)
        } finally {
            setSubmitting(false)
        }
    }, [address, cartItems, dispatch, navigate, totalPrice, user])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const paymentStatus = params.get('payment')

        if (paymentStatus === 'cancelled') {
            sessionStorage.removeItem('paymentOrder')
            setMessage('Payment was cancelled. No order was placed.')
            window.history.replaceState({}, '', '/checkout')
            return
        }

        if (paymentStatus !== 'success' || !user || paymentVerified) {
            return
        }

        const storedPaymentOrder = JSON.parse(sessionStorage.getItem('paymentOrder') || 'null')
        const orderId = params.get('order_id') || storedPaymentOrder?.order_id
        const returnedPaymentId = params.get('payment_id') || params.get('paymentId')

        if (!orderId || !returnedPaymentId) {
            setMessage('Payment completed, but SafePay did not return payment details.')
            return
        }

        const verifyAndPlaceOrder = async () => {
            setSubmitting(true)
            try {
                const response = await fetch('/api/payment/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId, payment_id: returnedPaymentId })
                })
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Payment verification failed')
                }

                setPaymentOrder({ order_id: orderId })
                setPaymentId(returnedPaymentId)
                setPaymentVerified(true)
                await placeOrder(returnedPaymentId)
            } catch (error) {
                setPaymentVerified(false)
                setMessage(error.message)
                setSubmitting(false)
            }
        }

        verifyAndPlaceOrder()
    }, [location.search, paymentVerified, placeOrder, user])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!user) {
            navigate('/login', { state: { from: '/checkout' } })
            return
        }

        if (!paymentVerified) {
            setMessage('Complete payment before placing your order.')
            return
        }

        await placeOrder(paymentId.trim())
    }

    if (cartItems.length === 0) {
        return (
            <main className="checkout-container checkout-empty">
                <h2>Your cart is empty</h2>
                <p>Add products to your cart before checking out.</p>
                <Link to="/shop" className="checkout-link">Continue Shopping</Link>
            </main>
        )
    }

    return (
        <main className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h3>Delivery Address</h3>
                    <input name="fullName" placeholder="Full name" value={address.fullName} onChange={handleChange} required />
                    <input name="street" placeholder="Street address" value={address.street} onChange={handleChange} required />
                    <input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
                    {message && <p className="checkout-error">{message}</p>}
                    {!paymentOrder ? (
                        <button type="button" onClick={handleStartPayment} disabled={submitting}>
                            {submitting ? 'Starting Payment...' : 'Continue to Payment'}
                        </button>
                    ) : (
                        <div className="payment-step">
                            <h3>Payment</h3>
                            <p>{paymentVerified ? 'Payment verified. Creating your order...' : 'Redirecting to SafePay...'}</p>
                            <strong>Payment Order: {paymentOrder.order_id}</strong>
                            <button type="submit" disabled={!paymentVerified || submitting}>
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    )}
                </form>
                <aside className="checkout-summary">
                    <h3>Order Summary</h3>
                    {cartItems.map((item) => (
                        <p key={item.productId || item._id}>
                            <span>{item.name} x {item.qty}</span>
                            <strong>{formatPrice(item.price * item.qty)}</strong>
                        </p>
                    ))}
                    <div className="checkout-total">
                        <span>Total</span>
                        <strong>{formatPrice(totalPrice)}</strong>
                    </div>
                </aside>
            </div>
        </main>
    )
}

export default Checkout
