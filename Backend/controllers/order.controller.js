const orderModel = require("../models/order.model");
const sendEmail = require("../services/sendEmail.service")


const createOrder = async (req, res) => {
    try {
        const { items, products, totalAmount, address, paymentId } = req.body
        const orderItems = Array.isArray(products) && products.length ? products : items

        if (!orderItems || orderItems.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: "Invalid order data" })
        }

        const order = new orderModel({
            user: req.user._1d,
            products: orderItems,
            totalAmount,
            address,
            paymentId
        })
        await order.save()
        const message = `Dear ${req.user.name},\n\nYour order has been created successfully. Here are the details:\n\nOrder ID: ${order._id}\nTotal Amount: ${order.totalAmount}\nPayment ID: ${order.paymentId}\n\nThank you for shopping with us!\n\nBest regards,\nYour Company Name`;

        await sendEmail(req.user.email, 'Order Created', message)
        res.status(201).json({
            message: "Order created successfully", order
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order', error
        })
    }
}



const myOrder = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id }).populate("products.productId", "name price")
        res.json(orders);
    }catch(error){
        res.status(500).json({
            message: 'Error fetching orders', error
        })
    }

};

const getOrder = async (req, res) =>{
    try{
        const orders = await orderModel.find({}).populate("user", "id name")
        res.json(orders);
    }catch(error){
        res.status(500).json({
            message: 'Error fetching orders', error
        })
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const {status} = req.body
        const order = await orderModel.findById(req.params.id)

        if(order){
            order.status = status
            await order.save()
            res.json({ message: "Order status updated successfully", order })

        }else{
            res.status(404).json({ message: "Order not found" })
        }
    }catch(error){
        res.status(500).json({
            message: 'Error updating order status', error
        })
    }

}

module.exports = {
    createOrder,
    myOrder,
    getOrder,
    updateOrderStatus
}