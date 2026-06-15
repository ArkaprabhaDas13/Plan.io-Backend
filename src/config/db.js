import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully Connected to the Database!");
    } catch (err) {
        console.error("Error connecting to the database:", err.message);
        process.exit(1);
    }
};

export default connectDB;
