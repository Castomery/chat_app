import MessageModel from "../models/message.model.ts"
import UserModel from "../models/user.model.ts"
import type { Request, Response } from "express"
import messageRouter from "../routes/message.routes.ts";
import cloudinary from "../configs/cloudinary.ts";

const getAllContacts = async (req: Request, res: Response) => {

    try {
        const loggedInUserId = (req as any).user._id;
        const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal sever error"});
    }


}

const getAllChats = async (req: Request, res: Response) => {

    try {

        const loggedInUserId= (req as any).user._id;
        const messages = await MessageModel.find({
            $or: [
                {senderId:loggedInUserId},
                {receiverId: loggedInUserId},
            ]
        })

        const chatPartnersIds = [...new Set(messages.map(msg => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))]

        const chatPartners = await UserModel.find({_id: {$in:chatPartnersIds}}).select("-password");

        res.status(200).json(chatPartners);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal sever error"});
    }

}

const getMessagesByUserId = async(req: Request, res: Response) => {
    try {
        
        const myId = (req as any).user._id;

        const {id} = req.params;

        const messages = await MessageModel.find({
            $or: [
                {senderId:myId, receiverId: id},
                {senderId:id, receiverId: myId},
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal sever error"});
    }
}

const sendMessage = async(req: Request, res: Response) => {
    try {
        
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = (req as any).user._id;

        if(!text && !image){
            return res.status(400).json({message: "Text or image is required."})
        }

        if(senderId.equals(receiverId)){
            return res.status(400).json({message: "Cannot send messages to yourself"});
        }

        const receiverExist = await UserModel.exists({_id: receiverId});

        if(!receiverExist) return res.status(404).json({message: "Receiver not found"});

        let imageUrl;

        if(image){
            const uploadeRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadeRes.secure_url;
        }

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal sever error"});
    }
}

export {getAllContacts, getMessagesByUserId, sendMessage, getAllChats};