import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import uploadImageOnCloudinary from "../utils/imageUpload";
// import multer from "multer";
import { Order } from "../models/order.model";

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        const restaurant = await Restaurant.findOne({ user: req.id });



        if (restaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant already exists for this user"
            });
        }
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl,
        });

        return res.status(200).json({
            success: true,
            message: "Restaurant Added",
        });
    } catch (error: any) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant:[],
                message: "Restaurant Not Found"
            });
        }
        return res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant Not Found"
            });
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);//converts "string representation of an array" to array object

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant Not Found"
            });
        }
        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });
        }

        order.status = status;

        await order.save();
        return res.status(200).json({
            success: true,
            status: order.status,
            message: "Order Status Updated"
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        //We have provided 3 types of Search
        const searchText = req.params.searchText || ""; //from url
        const searchQuery = req.query.searchQuery as string || ""; //from url with '?'  
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisines => cuisines);

        const query: any = {}; //query object

        //Searching based on searchText(name, city, country)
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ]
        }
        //Searching based on searchQuery(name, cuisines)
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { selectedCuisines: { $regex: searchQuery, $options: 'i' } },
            ]
        }
        //Searching based on selectedCuisines(cuisines listed)
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines }
        }
        const restaurants = await Restaurant.find(query);
        return res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { created: -1 } //sorted by last created first
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success:true,
            restaurant
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}