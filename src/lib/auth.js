import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("recipehub");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "7d",
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const usersCollection = db.collection("users");
          const existing = await usersCollection.findOne({ email: user.email });
          if (!existing) {
            await usersCollection.insertOne({
              name: user.name,
              email: user.email,
              image: user.image || "",
              role: "user",
              isBlocked: false,
              isPremium: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        },
      },
    },
  },
});
