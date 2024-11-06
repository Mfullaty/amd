import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import db from "./db";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Authorize function received credentials:", credentials);

          // Check if credentials are provided
          if (!credentials?.identifier || !credentials?.password) {
            throw { error: "No Inputs Found", status: 401 };
          }
          console.log("Passed Check 1");

          let user;
          // Determine if the identifier is an email or phone number
          if (credentials.identifier.includes("@")) {
            // Identifier is an email
            user = await db.user.findUnique({
              where: { email: credentials.identifier },
            });
          } else {
            // Identifier is a phone number
            const lastFourDigits = credentials.identifier.slice(-4);

            // Attempt to find the user by the last four digits of the phone number
            user = await db.user.findFirst({
              where: {
                phone: {
                  endsWith: lastFourDigits,
                },
              },
            });

            if (!user) {
              console.log("No user found with provided phone number");
              throw { error: "No user found with provided phone number", status: 401 };
            }

            // Now, format the phone number with the country code from the database
            const phoneNumber = parsePhoneNumberFromString(credentials.identifier, user.country);
            if (!phoneNumber || !phoneNumber.isValid()) {
              console.log("Invalid phone number format");
              throw { error: "Invalid phone number format", status: 401 };
            }

            const formattedPhoneNumber = phoneNumber.formatInternational();

            // Verify the phone number
            user = await db.user.findUnique({
              where: { phone: formattedPhoneNumber },
            });

            if (!user) {
              console.log("No user found with formatted phone number");
              throw { error: "No user found with formatted phone number", status: 401 };
            }
          }

          // Check if user exists
          if (!user) {
            console.log("No user found");
            throw { error: "No user found", status: 401 };
          }
          console.log("Passed Check 2");

          // Check if password is correct
          const passwordMatch = await compare(credentials.password, user.hashedPassword);
          if (!passwordMatch) {
            console.log("Password incorrect");
            throw { error: "Password Incorrect", status: 401 };
          }
          console.log("Passed Check 3");

          // Create user object
          const userObj = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
            phone: user.phone,
            country: user.country,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
          console.log("User Compiled");
          return userObj;
        } catch (error) {
          console.log("Authorization failed");
          console.log(error);
          throw { error: "Something went wrong", status: 401 };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.country = token.country;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone;
        token.country = user.country;
        token.image = user.picture;
        token.emailVerified = user.emailVerified;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
  },
};
