import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"
import mongoose from "mongoose";
import morgan from "morgan";
import {v2 as cloudinary} from "cloudinary";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan(':method :url :status :response-time ms'));

app.get("/health", async(req: express.Request, res: express.Response)=>{
    res.send({message:"health OK!"}).json;
})

app.use("/api/my/user", myUserRoute)
app.use("/api/my/restaurant", myRestaurantRoute)
app.use("/api/restaurant", restaurantRoute)



app.listen(7001, ()=>{
    console.log("Server running on port 7001");
})

mongoose.connect(process.env.MONGO_URI as string)
.then(() => console.log("MongoDB Connected"))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

