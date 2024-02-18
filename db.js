import { MongoClient } from "mongodb";
import dotenv from "dotenv";
//using dotenv.config to store the mongodb connection string in .env file
dotenv.config();

//connecting database
async function dbConnection(){
    try {
        //passing the connection string to the mongoClient
        const client=new MongoClient(process.env.connectionString);
        await client.connect();
        console.log("database connected");
        return client;
    } catch (error) {
        console.log("error connecting to the database")
    }
}

export const client=await dbConnection();