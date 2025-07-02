import mongoose from "mongoose";

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn : null , promise : null}
}

async function connectDb() {
    if(cached.conn){
        console.log("Using cached database connection");
        return cached.conn
    }

    if(!cached.promise){
        const opts = {
            bufferCommands : false
        }
        
        // Debug: Check if MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined in environment variables");
            throw new Error("MONGODB_URI is not defined");
        }

        // Debug: Print masked connection string
        const maskedUri = process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@');
        console.log("Attempting to connect to MongoDB with URI:", maskedUri);

        // Use the URI as-is (do not append /test)
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
            .then(mongoose => {
                console.log("Successfully connected to MongoDB");
                return mongoose
            })
            .catch(err => {
                console.error("MongoDB connection error:", err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error("Failed to establish MongoDB connection:", error);
        throw error;
    }
}

export default connectDb