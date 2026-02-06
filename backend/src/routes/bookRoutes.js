import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectedRoute from "../middleware/auth.js";

const router = express.Router();

router.post("/", protectedRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Upload the image to cloud storage (e.g., Cloudinary) and get the URL
        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url;

        // Save to database
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })

        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });

    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/", protectedRoute, async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit

        const books = await Book.find().sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImg");

            const totalBooks = await Book.countDocuments();    
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
        
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server error" });
    }
})  

router.delete("/:id", protectedRoute, async (req, res) =>{
    try {
        const book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }
        // check if the book belongs to the user
        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "You are not authorized to delete this book"});
        }
        // delete the image from cloudinary
        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.error("Error deleting image from Cloudinary:", deleteError);
            }
        }
        await book.deleteOne();
        res.status(200).json({message: "Book deleted successfully"});
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/user", protectedRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ books });
    } catch (error) {
        console.error("Error fetching user's books:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

export default router;