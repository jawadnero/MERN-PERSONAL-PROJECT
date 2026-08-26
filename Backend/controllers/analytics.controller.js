const Order = require("../models/order.model");
const User = require("../models/auth.model");
const Product = require("../models/product.model");


const getAdminStates = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({});

    const totalRevenueData = orders.reduce((acc, ord) => acc + (ord.totalAmount || 0), 0);

    return res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenueData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAdminStates };