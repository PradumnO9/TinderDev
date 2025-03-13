const express = require("express");
const paymentController = require("../controllers/paymentController");
const { userAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/create-order", userAuth, paymentController.createOrder);

router.post("/webhook", paymentController.verifyWebhook);

router.get("/verify-premium", userAuth, paymentController.verifyPremiumUser);

module.exports = router;
