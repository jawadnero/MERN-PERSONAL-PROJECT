const axios = require("axios");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const findPaymentValue = (value, keys) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  for (const key of keys) {
    if (value[key]) {
      return value[key];
    }
  }

  for (const nestedValue of Object.values(value)) {
    const result = findPaymentValue(nestedValue, keys);
    if (result) {
      return result;
    }
  }

  return null;
};

const createOrder = async (req, res) => {
  try {
    const amount = req.body?.amount || 5000;

    if (!process.env.SAFEPAY_API_KEY || !process.env.SAFEPAY_SECRET_KEY) {
      return res.status(500).json({ message: "Payment gateway not configured" });
    }

    const response = await axios.post(
      "https://sandbox.api.getsafepay.com/order/v1/init",
      {
        amount,
        client: process.env.SAFEPAY_API_KEY,
        currency: req.body?.currency || "PKR",
        environment: "sandbox"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const paymentToken = findPaymentValue(response.data, ["token"]);
    const gatewayOrderId = findPaymentValue(response.data, ["order_id", "orderId"]);

    if (!paymentToken) {
      return res.status(502).json({
        message: "Payment gateway did not return a payment token",
        gatewayResponse: response.data
      });
    }

    const orderId = gatewayOrderId || `shopnest-${crypto.randomUUID()}`;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    const checkoutUrl = new URL("https://sandbox.api.getsafepay.com/checkout/pay");
    checkoutUrl.search = new URLSearchParams({
      beacon: paymentToken,
      cancel_url: `${frontendUrl}/checkout?payment=cancelled`,
      env: "sandbox",
      order_id: orderId,
      redirect_url: `${frontendUrl}/checkout?payment=success`,
      source: "custom",
      webhooks: "false"
    }).toString();

    return res.status(200).json({
      ...response.data,
      order_id: orderId,
      token: paymentToken,
      checkoutUrl: checkoutUrl.toString()
    });

  } catch (error) {
    console.error("Safepay Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Safepay payment failed",
      error: error.response?.data || error.message
    });
  }
};

const verifyPayment = async (req, res) => {
  const { order_id, payment_id } = req.body;

  if (!order_id || !payment_id) {
    return res.status(400).json({ message: "order_id and payment_id are required" });
  }

  if (!process.env.SAFEPAY_API_KEY || !process.env.SAFEPAY_SECRET_KEY) {
    return res.status(500).json({ message: "Payment gateway not configured" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.api.getsafepay.com/order/payments/v3/verify",
      {
        merchant_api_key: process.env.SAFEPAY_API_KEY,
        order_id,
        payment_id
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-SFPY-MERCHANT-SECRET": process.env.SAFEPAY_SECRET_KEY
        }
      }
    );

    console.log(response.data);

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Safepay Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Safepay payment verification failed",
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  createOrder,
  varifyPayment: verifyPayment,
  verifyPayment
};


