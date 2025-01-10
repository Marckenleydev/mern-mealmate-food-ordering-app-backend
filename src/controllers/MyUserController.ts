import { Request, Response } from "express";
import User from "../models/user";


const getCurrentUser = async(req:Request, res:Response)=>{

  try {
    const currentUser = await User.findOne({_id: req.userId});
    if(!currentUser){
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(currentUser);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user" });
    return;
  }
}

const createCurrentUser = async (req: Request, res: Response)=> {
  try {
    // Check if the user already exists
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
       res.status(200).send(); // User exists, send status 200
    }

    
    const newUser = new User(req.body);
    await newUser.save();

    // Return the user object to the client
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

const updateCurrentUser = async(req:Request,res:Response)=>{

  try {
    const {name,addressLine1,country,city} = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return ;
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();
    res.send(user);
    

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
    
  }
}
export default { createCurrentUser,updateCurrentUser,getCurrentUser };
