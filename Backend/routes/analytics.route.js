const express = require("express");
const { protect } = require("../middleware/auth.middleware")
const { admin } = require("../middleware/admin.middleware")
const { getAdminStates } = require("../controllers/analytics.controller")

const router = express.Router()

router.get("/", protect, admin, getAdminStates)

module.exports = router