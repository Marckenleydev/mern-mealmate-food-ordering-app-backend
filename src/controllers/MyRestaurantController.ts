
import  cloudinary  from 'cloudinary';
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import mongoose from 'mongoose';


const createMyRestaurant = async(req: Request, res: Response)=>{

    try {
        const existingRestaurant = await Restaurant.findOne({user: req.userId});

        if(existingRestaurant){
             
            res.status(409)
            .json({message: "User Restaurant already exists"})
            return
        }

       // const image = req.file as Express.Multer.File;
       // const base64Image = Buffer.from(image.buffer).toString("base64");
       // const dataURI = `data:${image.mimetype};base64,${base64Image}`;


       // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

       const imageUrl = await uploadImage(req.file as Express.Multer.File)
        
        const restaurant = new Restaurant(req.body);
       
        restaurant.imageUrl = imageUrl;
        restaurant.user = new mongoose.Types.ObjectId(req.userId)
        restaurant.lastUpadate = new Date();
        await restaurant.save();

        res.status(201).send(restaurant);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({message: "something went wrong"})
    }

}

const getMyRestaurant = async(req: Request, res: Response)=>{
    const restaurant = await Restaurant.findOne({user: req.userId})
    if(!restaurant){
        res.status(404).json({message: "User Restaurant not found"})
        return;
    }

    res.json(restaurant);
    
    try {
        
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({message: "error fetching my restaurant"})
    }
}

const updateMyRestaurant = async(req: Request, res: Response)=>{
    try {
        const restaurant = await Restaurant.findOne({user: req.userId})
        if(!restaurant){
            res.status(404).json({message: "User Restaurant not found"})
            return;
        }

        restaurant.restaurantName = req.body.restaurantName
        restaurant.city=req.body.city
        restaurant.country=req.body.country
        restaurant.deliveryPrice=req.body.deliveryPrice
        restaurant.estimatedDeliveryTime=req.body.estimatedDeliveryTime
        restaurant.cuisines=req.body.cuisines
        restaurant.menuItems=req.body.menuItems
        restaurant.lastUpadate=new Date();

        if(req.file){
            const imageUrl = await uploadImage(req.file as Express.Multer.File)
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        res.status(200).send(restaurant)




    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({message: "something went wrong"})
    }
}
export default {createMyRestaurant,getMyRestaurant,updateMyRestaurant} ;


const uploadImage= async (file:Express.Multer.File) => {

    const image = file
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
}