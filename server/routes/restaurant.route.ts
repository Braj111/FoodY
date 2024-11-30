import express from "express";
import { createRestaurant, getRestaurant, getRestaurantOrder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";


const  router = express.Router();

router.route("/").post(isAuthenticated as any, upload.single("imageFile") as any, createRestaurant as any);
router.route("/").get(isAuthenticated as any, getRestaurant as any);
router.route("/").put(isAuthenticated as any, upload.single("imageFile") as any, updateRestaurant as any);
router.route("/order").get(isAuthenticated as any, getRestaurantOrder as any);
router.route("/order/:orderId/status").put(isAuthenticated as any, updateOrderStatus as any);
router.route("/search/:searchText").get(isAuthenticated as any, searchRestaurant as any);
router.route("/:id").get(isAuthenticated as any, getSingleRestaurant as any);

export default router;
