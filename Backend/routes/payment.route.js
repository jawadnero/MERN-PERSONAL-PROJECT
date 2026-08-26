const express = require("express");
const { createOrder, varifyPayment } = require("../controllers/payment.controller")

const router = express.Router()



router.post("/order", createOrder)
router.post("/varify", varifyPayment)
router.post("/verify", varifyPayment)




module.exports = router