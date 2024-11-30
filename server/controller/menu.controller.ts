import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose, { ObjectId } from "mongoose";



export const addMenu= async (req:Request, res:Response) => {
    try {
        const {name, description, price} = req.body;
        const file=req.file;
        if(!file){
            return res.status(400).json({
                success:false,
                message:"Image is Required"
            });
        }
        const imageUrl= await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu = await Menu.create({
            name,
            description,
            price,
            image:imageUrl,
        });
        //push the menu inside restaurant
        const restaurant= await Restaurant.findOne({user:req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu.id);
            await restaurant.save();
        }
        return res.status(201).json({
            success:true,
            message:"Menu added Successfully",
            menu
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message:"Internal server error"});
    }
}

export const editMenu = async (req:Request, res:Response)=>{
    try {
        const {id} = req.params;
        const {name, description, price} =req.body;
        const file= req.file;

        const menu= await Menu.findById(id);
        if(!menu){
            return res.status(404).json({
                success:false,
                message: "Menu not found"
            });
        }
        if(name) menu.name=name;
        if(description) menu.description=description;
        if(price) menu.price = price;
        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image=imageUrl;
        }
        await menu.save();
        return res.status(200).json({
            success:true,
            message: "Menu Updated successfully",
            menu
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message:"Internal server error"});
    }
}