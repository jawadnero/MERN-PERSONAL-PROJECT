const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const productsRoutes = require("./routes/products.route");
const orderRoutes = require("./routes/order.route");
const paymentRoutes = require("./routes/payment.route");
const analyticsRoutes = require("./routes/analytics.route");  
const dns = require("dns");
const path = require("path");

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
])

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: [`http://localhost:3001`, `http://127.0.0.1:3001`],
       credentials: true
    }
))
app.use("/api/auth", authRouter)
app.use("/api/products", productsRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)
// app.

if(process.env.NODE_ENV === "production") {
    const frontendBuildPath = path.resolve(__dirname, "../frontend/build");

    app.use(express.static(frontendBuildPath));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
}


module.exports = app;