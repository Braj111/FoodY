import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createCheckoutSession, getOrders, stripeWebhook } from "../controller/order.controller";

 

const router = express.Router();

router.route("/").get(isAuthenticated as any, getOrders as any);
router.route("/checkout/create-checkout-session").post(isAuthenticated as any, createCheckoutSession as any);
router.route("/webhook").post(express.raw({type:'application/json'}), stripeWebhook as any)

export default router;
 