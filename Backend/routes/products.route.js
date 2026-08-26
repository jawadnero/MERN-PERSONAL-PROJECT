const express = require("express");
const { protect } = require("../middleware/auth.middleware")
const { admin } = require("../middleware/admin.middleware")
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/products.controller")
const router = express.Router()
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProduct);
router.route("/:id").get(getProductById).put(protect, admin, upload.single("image"), updateProduct).delete(protect, admin, deleteProduct);



module.exports = router