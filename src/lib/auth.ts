import { MongoClient, Db } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// ১. MongoClient এর টাইপ হবে MongoClient, string নয়
const client: MongoClient = new MongoClient(process.env.MONGODB_URI as string);

// ২. ডাটাবেজ সিলেক্ট করা
const db: Db = client.db("StayNest");

// ৩. Better Auth কনফিগারেশন
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client, 
  }),
   emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
 
});