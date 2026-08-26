const express = require("express");
const { protect } = require("../middleware/auth.middleware")
const { admin } = require("../middleware/admin.middleware")
const { createOrder, getOrder, myOrder, updateOrderStatus } = require("../controllers/order.controller")
const router = express.Router()


router.route("/").post(protect, createOrder).get(protect, admin, getOrder);
router.route("/myorders").get(protect, myOrder);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;